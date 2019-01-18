const app = getApp();
// time
var util = require('../unitl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityIdData: [],
    joinuser: [],
    joinbutton: false,
    show: false,
    share: '',
    latitude: '',
    longitude: '',
    _openid: true,
    shareImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 隐藏导航栏加载框
    var start_time = new Date();
    that.setData({
      start_time: util.formatTime(new Date()).substring(0, 10)
    })
    console.log(that.data.start_time)
    console.log(options.scene !== undefined)
    if (options.scene !== undefined) {
      wx.setStorageSync("activityId", options.scene)
    } else {
      wx.setStorageSync("activityId", options.id)
    }


    console.log(wx.getStorageSync("userInfo").length == 0)
    console.log(wx.getStorageSync("userid").length == 0)
    console.log(wx.getStorageSync("userInfo").length == 0 || wx.getStorageSync("userid").length == 0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.onQuery();
    //this.eventDraw();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    //var that = this;
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.activityIdData[0].act_name,
      path: '/pages/activitymore/index?id=' + this.data.activityIdData[0]._id + '',
      //imageUrl: '/images/90yy.png',
      success: function(res) {
        console.log(res)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;

        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;

          }
        })

      },
      fail: function(res) {
        // 转发失败

      }
    }
  },
  //查询社团信息
  onQuery: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('activity').where({
      _id: wx.getStorageSync("activityId")
    }).get({
      success: res => {
        //时间转换
        // var d = new Date(res.data[0].act_time)
        // var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        // res.data[0].act_time = datetime
        if (res.data[0]._openid == wx.getStorageSync('openid')) {
          that.setData({
            _openid: false
          })
        }
        that.setData({
          activityIdData: res.data,
          joinuser: res.data[0].joinuser,
          act_info: res.data[0].act_info
        })
        console.log('查询社团信息： ', that.data.activityIdData)
        console.log(res.data[0].joinuser)
        var activityIdData = res.data
        //查询是否参加活动
        for (var i = 0; i < activityIdData[0].joinuser.length; i++) {
          if (activityIdData[0].joinuser[i].user_openid == wx.getStorageSync("openid")) {
            //console.log(activityIdData)
            that.setData({
              joinbutton: true
            })
          }
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  call: function(e) {
    console.log(e.currentTarget.id)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
    })
  },
  join: function(e) {
    //console.log(wx.getStorageSync("userInfo"))
    const db = wx.cloud.database()
    const _ = db.command
    let formId = e.detail.formId;
    let data ={
      keyword1: {
        value: this.data.activityIdData[0].act_name
      },
      keyword2: {
        value: this.data.activityIdData[0].act_date + '' + this.data.activityIdData[0].act_time
      },
      keyword3: {
        value: this.data.activityIdData[0].act_add
      },
      keyword4: {
        value: this.data.activityIdData[0].act_phone
      }
    }
    console.log(data)

    var that = this
    that.setData({
      timeStamp_DV: e.timeStamp - that.data.timeStamp_last,
      timeStamp_last: e.timeStamp
    })
    console.log(that.data.timeStamp_DV)
    if (that.data.timeStamp_DV < 5000) {
      console.log("重复点击")
    } else {
      if (wx.getStorageSync("userInfo").length == 0 || wx.getStorageSync("userid").length == 0) {
        wx.showToast({
          title: '请登陆',
          icon: "none",
          duration: 1500,
          success: function(res) {

            that.data.Interval = setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
            //clearTimeout(that.data.Interval);
          },
          fail: function(res) {},
        })
      } else {

        console.log(wx.getStorageSync('userInfos').user_sn == undefined)
        console.log(wx.getStorageSync('userInfos').user_sn == '')
        console.log(wx.getStorageSync('userInfos').user_sn)


        if (wx.getStorageSync('renzheng') == true) {
          wx.showLoading({
            title: '报名中',
          })

          wx.cloud.callFunction({
            name: 'join',
            data: {
              activityId: wx.getStorageSync("activityId"),
              user_openid: wx.getStorageSync("openid"),
              user_avatar: wx.getStorageSync("userInfo").avatarUrl,
              user_userid: wx.getStorageSync("userid")
            },
            success: res => {

              console.log(res.result.stats.updated)
              if (res.result.stats.updated > 0) {
                const db = wx.cloud.database()
                wx.cloud.callFunction({
                  name: 'joinuser',
                  data: {
                    activityId: wx.getStorageSync("activityId"),
                    user_openid: wx.getStorageSync("openid"),
                    user_avatar: wx.getStorageSync("userInfo").avatarUrl,
                    user_userid: wx.getStorageSync("userid"),
                    act_name: that.data.activityIdData[0].act_name,
                  },
                  success: res => {

                    console.log(res.result.stats.updated)
                    if (res.result.stats.updated > 0) {
                      wx.cloud.callFunction({
                        name: 'wxmessage',
                        data: {
                          code: '',
                          templateId: 'Bg0BnBKFY3BDzUGH3cuqqtib0KHYoHSGJA9ZjwYD2H4', 
                          formId: formId,
                          data,
                          page: 'pages/activitycard/index?id=' + this.data.activityIdData[0]._id + ''
                        },
                      }).then((res) => {
                        console.log(res);
                        wx.hideLoading()
                        wx.showToast({
                          title: '报名成功',
                          icon: "none",
                          duration: 1500
                        })
                        that.setData({
                          joinbutton: true
                        })
                        that.onReady();
                      });
                    }
                  },
                  fail: err => {

                    console.error('[云函数] [sum] 调用失败：', err)
                  }
                })
              }
            },
            fail: err => {

              console.error('[云函数] [sum] 调用失败：', err)
            }
          })

        } else {
          wx.showToast({
            title: '请完善用户信息',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }

    }
  },


  qrcode: function(e) {
    wx.navigateTo({
      url: '../activitycard/index?id=' + wx.getStorageSync("activityId") + ''
    })
  },
  open: function() {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)


        }
      }
    });
  },
  associationmore: function(e) {
    wx.navigateTo({
      url: '/pages/associationmore/index?id=' + this.data.activityIdData[0].act_usrass_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  openmap: function(e) {
    var that = this
    var latitude = +that.data.activityIdData[0].act_gps.substr(0, that.data.activityIdData[0].act_gps.indexOf(','))
    var longitude = +that.data.activityIdData[0].act_gps.substr(that.data.activityIdData[0].act_gps.indexOf(',') + 1)
    console.log(+that.data.activityIdData[0].act_gps.substr(0, that.data.activityIdData[0].act_gps.indexOf(',')))
    console.log(+that.data.activityIdData[0].act_gps.substr(that.data.activityIdData[0].act_gps.indexOf(',') + 1))
    that.setData({
      latitude: latitude,
      longitude: longitude
    })
    wx.openLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      scale: 28
    })
  },
  act_info: function(e) {
    console.log(e)
    this.setData({
      act_info: e.detail.value
    })
  },
  update: function() {

    var that = this
    console.log(that.data.activityIdData[0]._id)
    console.log(that.data.act_info)
    const db = wx.cloud.database()
    db.collection('activity').doc(that.data.activityIdData[0]._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        act_info: that.data.act_info
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          image: '',
          duration: 1500,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        that.onReady();
      }
    })
  },
  share_qrcode: function(e) {
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: 'qrcode', // 云函数名称
      data: { // 小程序码所需的参数
        page: "pages/activitymore/index",
        id: that.data.activityIdData[0]._id
      },
      complete: res => {
        console.log('callFunction test result: ', res)
        that.setData({ // 获取返回的小程序码
          xcxCodeImageData: res.result,
        })
        wx.cloud.getTempFileURL({
          fileList: [{
            fileID: res.result.fileID, // 文件 ID
            maxAge: 120 * 60 * 1000, // 有效期
          }],
          success: res => {
            console.log(res.fileList[0].tempFileURL)
            that.setData({
              imageUrl: res.fileList[0].tempFileURL
            })
            wx.hideLoading()
            wx.downloadFile({
              url: that.data.imageUrl,
              success: function(res) {
                console.log(res)
                if (res.statusCode === 200) {
                  that.eventDraw();
                  // wx.saveImageToPhotosAlbum({
                  //   filePath: res.tempFilePath,
                  //   success(res) {
                  //     wx.showToast({
                  //       icon: 'success',
                  //       title: '已存至相册！',
                  //     })
                  //   }
                  // })
                }
              },
              fail: function(res) {
                console.log("失败" + res)
                wx.hideLoading()
              }
            })
          },
          fail: console.error
        })
      }
    })

  },
  share_link: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['查看关联小程序方法', '复制小程序AppId', '复制页面路径'],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: '../tips/index',
              })
              break;
            case 1:
              wx.setClipboardData({
                data: 'wxd43ec2bfbf854c39',
                success: function(res) {
                  wx.showToast({
                    title: '已复制至剪贴板',
                    icon: 'success',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                },
                fail: function(err) {
                  wx.showToast({
                    title: '复制失败',
                    icon: 'loading',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                }
              })
              break;
            case 2:
              wx.setClipboardData({
                data: 'pages/activitymore/index?id=' + that.data.activityIdData[0]._id + '',
                success: function(res) {
                  wx.showToast({
                    title: '已复制至剪贴板',
                    icon: 'success',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                },
                fail: function(err) {
                  wx.showToast({
                    title: '复制失败',
                    icon: 'loading',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                }
              })
              break;
          }

        }
      }
    });
  },
  uploadimg: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '上传中',
        })
        console.log(res)
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'mapping/' + wx.getStorageSync("openid") + Date.parse(new Date()) / 1000 + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: function(res) {
            console.log('[上传文件] 成功：', res)
            const fileList = res.fileID
            wx.cloud.getTempFileURL({
              fileList: [res.fileID],
              success: function(res) {
                console.log(res.fileList[0].tempFileURL)
                wx.setClipboardData({
                  data: '![](' + res.fileList[0].tempFileURL + ')',
                  success: function(res) {
                    wx.showToast({
                      title: '已复制至剪贴板',
                      icon: 'success',
                      image: '',
                      duration: 1500,
                      mask: true,
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  },
                  fail: function(err) {
                    wx.showToast({
                      title: '复制失败',
                      icon: 'loading',
                      image: '',
                      duration: 1500,
                      mask: true,
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  }
                })
              },
              fail: e => {
                console.error('[上传文件] 失败：', e)
              },
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      }
    })
  },
  signin: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['QR_CODE'],
      success: function(res) {

        const useropenid = res.result.split(',')[0]
        //用户凭证上的活动id
        const activityids = res.result.split(',')[1]
        //签到上的活动id
        const activityid = that.data.activityIdData[0]._id
        console.log(useropenid)
        console.log(activityids)
        console.log(activityid)
        var joinuser = that.data.activityIdData[0].joinuser
        for (var i = 0; i < joinuser.length; i++) {
          if (joinuser[i].user_openid == useropenid && activityid == activityids) {
            const db = wx.cloud.database();
            const _ = db.command;
            db.collection('userinfo').where({
              _openid: useropenid
            }).get({
              success: function(res) {
                // res.data 包含该记录的数据
                console.log(res.data[0].activity)
                var user_activity = res.data[0].activity
                for (var j = 0; j < user_activity.length; j++) {
                  if (user_activity[j].act_id == activityid) {
                    wx.cloud.callFunction({
                      // 云函数名称
                      name: 'signin',
                      // 传给云函数的参数
                      data: {
                        useropenid: useropenid,
                        activityid: activityids,
                        num: j
                      },
                      success: function(res) {
                        console.log(res.result) // 3
                      },
                      fail: console.error
                    })
                  }
                  break;
                }
                console.log(user_activity)

              }
            })

            break;
          }

        }


      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  onClose: function(e) {
    var that = this;
    console.log(e)
    that.setData({
      show: false
    });
  },
  onopen: function(e) {
    var that = this;
    console.log(e)

    that.setData({
      show: true
    });
    const openid = e.currentTarget.id;
    const db = wx.cloud.database();
    db.collection('userinfo').where({
      _openid: openid
    }).get({
      success: function(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        var activity = res.data[0].activity
        console.log(new Date(activity[0].start_time))
        console.log(util.formatTime(new Date(activity[0].start_time)))
        var act_infos = []
        for (var i = 0; i < 30; i++) {
          //日期后推30天
          var start_time = util.formatTime(new Date(new Date() - 86400000 * i)).substring(0, 10)
          //console.log(start_time.substring(5, 7))
          act_infos.push({
            date: start_time,
            corol: '#f6f6f6',
            num: start_time.substring(8, 10)
          })
          console.log()
          var z = 0;
          for (var j = 0; j < activity.length; j++) {
            //报名的活动日期
            var user_act_start_time = util.formatTime(new Date(activity[j].start_time)).substring(0, 10)
            if (start_time == user_act_start_time) {
              z = z + 1;
              if (z < 2) {
                act_infos[i].corol = "#ff663f"
              } else {
                act_infos[i].corol = "#ff2345"
              }
            } else {

            }
          }


        }
        console.log(act_infos)
        that.setData({
          act_infos: act_infos,
          act_infos_show: true
        })
      }
    })
  },
  eventDraw() {
    var that = this;
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    let post = this.data.activityIdData[0].act_post
    let name = this.data.activityIdData[0].act_name
    let date = this.data.activityIdData[0].act_date
    let time = this.data.activityIdData[0].act_time
    let bg = 'https://phsl-62bbb8.tcb.qcloud.la/icon/bg.png?sign=64d392ab08cd94270fc506fbbe7325f2&t=1539518151'
    that.setData({
      painting: {
        width: 800,
        height: 1000,
        clear: true,
        views: [{
            type: 'image',
            url: bg,
            top: 0,
            left: 0,
            width: 800,
            height: 1000
          },
          {
            type: 'image',
            url: post,
            top: 0,
            left: 0,
            width: 800,
            height: 342
          },
          {
            type: 'text',
            content: name,
            fontSize: 50,
            color: '#000',
            breakWord: true,
            textAlign: 'center',
            top: 400,
            left: 400,
            bolder: true
          },
          {
            type: 'text',
            content: date + '  ' + time,
            fontSize: 30,
            color: '#000',
            breakWord: true,
            textAlign: 'center',
            top: 500,
            left: 400,
            bolder: true
          },
          {
            type: 'image',
            url: that.data.imageUrl,
            top: 600,
            left: 250,
            width: 300,
            height: 300
          },
          {
            type: 'text',
            content: '扫码了解更多',
            fontSize: 20,
            color: '#000',
            breakWord: true,
            textAlign: 'center',
            top: 950,
            left: 400,
            bolder: true
          }
        ]
      }
    })
    console.log("2")
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  }
})