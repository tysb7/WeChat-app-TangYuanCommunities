// pages/associationmore/index.js
// time
var util = require('../unitl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    associationId:'',
    associationData:'',
    associationList:'',
    ass_info:'',
    _openid:true,
    Authentication:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this;
    
    console.log(options.scene !== undefined)
    if (options.scene !== undefined) {
      that.setData({
        associationId: options.scene
      })
    }
    else {
      that.setData({
        associationId: options.id
      })
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.onQuery();
    that.associationList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.associationData[0].ass_name,
      path: '/pages/associationmore/index?id=' + this.data.associationData[0]._id + '',
      //imageUrl: '/images/90yy.png',
      success: function (res) {
        console.log(res)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;

        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;

          }
        })

      },
      fail: function (res) {
        // 转发失败

      }
    }
  },
  //查询社团信息
  onQuery: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('association').where({
       _id : that.data.associationId
    }).get({
      success: res => {
        that.setData({
          associationData: res.data,
          ass_info: res.data[0].ass_info,
          Authentication: !res.data[0].Authentication
        })
        console.log(res.data[0].Authentication)
        console.log('[数据库] [查询记录] 成功: ', that.data.associationData[0])
        console.log(that.data.associationData[0]._openid)
        if (that.data.associationData[0]._openid == wx.getStorageSync("openid")) {
          that.setData({
            _openid: false 
          })
        }
        var ass_joiner = that.data.associationData[0].ass_joiner
        //console.log(ass_joiner[1].openid == wx.getStorageSync("openid"))
        for (var i = 0; i < ass_joiner.length;i++){
          if (ass_joiner[i].openid == wx.getStorageSync("openid")){
            console.log('用户已加入')
            that.setData({
              joinass: true
            })
          }
        }
        const db = wx.cloud.database();
        const _ = db.command
        db.collection('newjoinuser').where({
          _openid: wx.getStorageSync('openid'),
          association_id: that.data.associationId
        })
          .get({
            success: function (res) {
              console.log(res.data.length)
              if (res.data.length > 0) {
                console.log('用户已申请')
                that.setData({
                  joinass: true
                })
              } else {

              }
            }
          })

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
  //查询社团活动信息
  associationList: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('activity').orderBy("act_date", 'asc').orderBy("act_time", 'desc').where({
      act_usrass_id: that.data.associationId
    }).get({
      success: res => {

        that.setData({
          associationList: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.associationList[0])
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
  ass_info: function (e) {
    console.log(e)
    this.setData({
      ass_info: e.detail.value
    })
  },
  update:function(){
    
    var that = this
    console.log(that.data.associationData[0]._id)
    console.log(that.data.ass_info)
    const db = wx.cloud.database()
    db.collection('association').doc(that.data.associationData[0]._id).update({
      // data 传入需要局部更新的数据
      data: { 
        // 表示将 done 字段置为 true
        ass_info: that.data.ass_info
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          image: '',
          duration: 1500,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        that.onReady();
      }
    })
  },
  activitymore:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/activitymore/index?id=' + e.currentTarget.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  lookmore:function(e){
    wx.navigateTo({
      url: '/pages/associationuser/index?id=' + this.data.associationId+'',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  joinass:function(e){
    var that = this;
    const db = wx.cloud.database();
    console.log(wx.getStorageSync("userInfos"))
    console.log(wx.getStorageSync('userInfos').user_sn == undefined)
    console.log(wx.getStorageSync('userInfos').user_sn == '')
    console.log(wx.getStorageSync('userInfos').user_sn)
    if (wx.getStorageSync('renzheng') == true) {
      db.collection('newjoinuser').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          association_id: that.data.associationId,
          user_name: wx.getStorageSync("userInfos").user_name,
          user_phone: wx.getStorageSync("userInfos").user_phone,
          user_wechat: wx.getStorageSync("userInfos").user_wechat,
          user_avatar: wx.getStorageSync("userInfos").user_avatarUrl,
          user_userid: wx.getStorageSync("userInfos")._id,
          admin: true,
          value: 1
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          wx.showToast({
            title: '申请已提交',
            icon: 'success',
            image: '',
            duration: 1500,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            joinass: true
          })
          that.onReady();
          
        }
      })

    } else {
      wx.showToast({
        title: '请完善用户信息',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  joinass1:function(e){
    var that = this; 
    that.setData({
      timeStamp_DV: e.timeStamp - that.data.timeStamp_last,
      timeStamp_last: e.timeStamp
    })
    console.log(that.data.timeStamp_DV)
    if (that.data.timeStamp_DV < 5000) {
      console.log("重复点击")
    }
    else{
      that.joinass();
    }
  },
  share_qrcode: function (e) {
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: 'qrcode',   // 云函数名称
      data: {    // 小程序码所需的参数
        page: "pages/associationmore/index",
        id: that.data.associationId
      },
      complete: res => {
        console.log('callFunction test result: ', res)
        that.setData({    // 获取返回的小程序码
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
              success: function (res) {
                console.log(res)
                if (res.statusCode === 200) {
                  that.eventDraw();
                }
              },
              fail: function (res) {
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
  share_link: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['查看关联小程序方法', '复制小程序AppId', '复制页面路径'],
      success: function (res) {
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
                success: function (res) {
                  wx.showToast({
                    title: '已复制至剪贴板',
                    icon: 'success',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
                fail: function (err) {
                  wx.showToast({
                    title: '复制失败',
                    icon: 'loading',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              })
              break;
            case 2:
              wx.setClipboardData({
                data: 'pages/associationmore/index?id=' + that.data.associationId + '',
                success: function (res) {
                  wx.showToast({
                    title: '已复制至剪贴板',
                    icon: 'success',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
                fail: function (err) {
                  wx.showToast({
                    title: '复制失败',
                    icon: 'loading',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              })
              break;
          }

        }
      }
    });
  },
  uploadimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
          success: function (res) {
            console.log('[上传文件] 成功：', res)
            const fileList = res.fileID
            wx.cloud.getTempFileURL({
              fileList: [res.fileID],
              success: function (res) {
                console.log(res.fileList[0].tempFileURL)
                wx.setClipboardData({
                  data: '![](' + res.fileList[0].tempFileURL + ')',
                  success: function (res) {
                    wx.showToast({
                      title: '已复制至剪贴板',
                      icon: 'success',
                      image: '',
                      duration: 1500,
                      mask: true,
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
                    })
                  },
                  fail: function (err) {
                    wx.showToast({
                      title: '复制失败',
                      icon: 'loading',
                      image: '',
                      duration: 1500,
                      mask: true,
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
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
  eventDraw() {
    var that = this;
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    let logo = this.data.associationData[0].ass_logo
    let name = this.data.associationData[0].ass_name
    let avatar = 'https://phsl-62bbb8.tcb.qcloud.la/icon/icon_avatarBG.png?sign=ad3cfc63d2602725ec1af7baa05414be&t=1539521830'
    let time = this.data.associationList.length
    let bg = 'https://phsl-62bbb8.tcb.qcloud.la/icon/ass_bg.png?sign=c5d9932148d135ecdb1977cf2f0e17c5&t=1539521107'
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
          type: 'text',
          content: '下课社团等你',
          fontSize: 60,
          color: '#000',
          breakWord: true,
          textAlign: 'center',
          top: 65,
          left: 400,
          bolder: true
        },
        {
          type: 'image',
          url: that.data.imageUrl,
          top: 550,
          left: 250,
          width: 300,
          height: 300
          },
          {
            type: 'image',
            url: logo,
            top: 652.5,
            left: 352.5,
            width: 95,
            height: 95
          },
          {
            type: 'image',
            url: avatar,
            top: 630.5,
            left: 330.5,
            width: 139,
            height: 139
          },
        {
          type: 'text',
          content: name,
          fontSize: 30,
          color: '#000',
          breakWord: true,
          textAlign: 'center',
          top: 880,
          left: 400,
          bolder: true
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