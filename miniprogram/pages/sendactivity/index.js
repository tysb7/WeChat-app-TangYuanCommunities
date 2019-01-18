// pages/sendactivity/index.js

var util = require('../unitl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [{
        text: '第一步',
        desc: '发布活动'
      },
      {
        text: '第二步',
        desc: '发布活动'
      },
      {
        text: '第三步',
        desc: '活动预览'
      },
      {
        text: '第四步',
        desc: '身份认证'
      }
    ],
    index: 0,
    active: 0,
    nextbutton: "下一步",
    height: '',
    date: '',
    time: '12:01',
    act_name: '',
    act_add: '',
    act_gps: '',
    act_phone: '',
    act_gpsinfo: "点击选择坐标(尽可能准确)",
    act_info: '',
    act_info_titel: '',
    files: [],
    jian: false,
    act_post:'',
    userinfo:[],
    assList:'',
    associationId:'',
    association:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        console.log(80 / (750 / res.screenWidth))
        that.setData({
          height: res.screenHeight + 50
        })
        console.log(that.data.height)
      },
    })
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    
    this.setData({
      date: time.substring(0, 10),
      time: time.substring(11, 16),
    });
    console.log(that.data.date)

    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: wx.getStorageSync("openid")
    }).get({
      success: res => {
        console.log(res.data[0].association)
        //挑选出发布上线的社团
        var assList = wx.getStorageSync('userAssadminList')
        var newassList = []
        for (var i = 0; i < assList.length; i++) {
          if (assList[i].state == true) {
            newassList.push(assList[i])
          }
        }
        console.log(newassList)
        this.setData({
          userinfo: res.data[0],
          assList: newassList,
          associationId: wx.getStorageSync('userAssadminList')[0]._id
        })
        
        
        console.log('[数据库] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },
  nextstep: function() {
    var that = this;
    
    that.setData({
      active: that.data.active + 1
    })
    console.log(that.data.act_phone.length)
    console.log(that.data.active)
    if (that.data.active == 0) {
      that.setData({
        nextbutton: "下一步"
      });
    }
    if (that.data.active == 1) {
      if (that.data.act_name.length !== 0 && that.data.act_add.length !== 0 && that.data.act_gps.length !== 0 && that.data.act_phone.length !== 0 && that.data.files.length !== 0 && that.data.associationId.length !== 0) {
        that.setData({
          nextbutton: "预览"
        });
      } else {
        console.log("false")
        wx.showToast({
          title: '请填写完整',
          icon: 'none',
          duration: 1500,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        that.laststep();
      }

    }
    if (that.data.active == 2) {
      that.setData({
        nextbutton: "认证"
      });
    }
    if (that.data.active == 3) {
      that.setData({
        nextbutton: "提交"
      });


    }
    if (that.data.active == 4) {
      wx.showLoading({
        title: '上传中',
      })

      const filePath = that.data.files
      // 上传图片
      const cloudPath = that.data.date + '/' + Math.random()+ 'my-image' + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: function (res) {
          console.log('[上传文件] 成功：', res)
          const fileList = res.fileID
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],
            success: function(res) {
              console.log(res.fileList[0].tempFileURL)
              that.setData({
                act_post: res.fileList[0].tempFileURL
              })
              console.log(that.data.act_post)
              that.uploadactivity();
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

    } else {

    }

  },
  laststep: function() {
    var that = this;
    that.setData({
      active: that.data.active - 1
    })
    console.log(that.data.active)
    if (that.data.active == 0) {
      that.setData({
        nextbutton: "下一步"
      });
    }
    if (that.data.active == 1) {
      that.setData({
        nextbutton: "预览"
      });
    }
    if (that.data.active == 2) {
      that.setData({
        nextbutton: "认证"
      });
    }
    if (that.data.active == 3) {
      that.setData({
        nextbutton: "提交"
      });
    } else {

    }
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        that.setData({
          files: res.tempFilePaths[0],
          jian: true
        });
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            console.log(res.width)
            console.log(res.height)
            if ((res.width / res.height) < 2.4 && (res.width / res.height) > 2.3) {
              console.log("dd")
            } else {
              wx.showToast({
                title: '请上传21：9海报',
                icon: 'none',
                duration: 1500,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        })
        console.log(res)

      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  delImage: function(e) {
    var that = this;
    that.setData({
      files: [],
      jian: false
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
    console.log(e.detail.value)
  },
  act_name: function(e) {
    console.log(e.detail.value)
    this.setData({
      act_name: e.detail.value
    })
  },
  act_add: function(e) {
    console.log(e.detail.value)
    this.setData({
      act_add: e.detail.value
    })
  },
  act_gps: function(e) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          act_gpsinfo: '已选择',
          act_gps: res.latitude + ',' + res.longitude
        })
      },
    })
  },
  act_phone: function(e) {
    console.log(e.detail.value.length)

    if (e.detail.value.length == 11) {
      this.setData({
        act_phone: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  act_info: function(e) {
    console.log(e)
    this.setData({
      act_info: e.detail.value
    })
  },
  uploadactivity:function(){
    var that = this;
    const db = wx.cloud.database()
    db.collection('association').where({
      _id: that.data.associationId
    }).get({
      success: res => {
        console.log(res.data[0])
        that.setData({
          association: res.data[0]
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        db.collection('activity').add({
          data: {
            act_time: that.data.time,
            act_date: that.data.date,
            act_name: that.data.act_name,
            act_add: that.data.act_add,
            act_gps: that.data.act_gps,
            act_phone: that.data.act_phone,
            act_info: that.data.act_info,
            act_post: that.data.act_post,
            open: { "open": false },
            act_usrass_id: that.data.association._id,
            act_usrass_name: that.data.association.ass_name,
            act_usrass_logo: that.data.association.ass_logo,
            joinuser: [{
              user_avatar: wx.getStorageSync('userInfos').user_avatarUrl,
              user_openid: wx.getStorageSync('openid')
            }],
            Authentication: that.data.association.Authentication
          },
          success: res => {
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            wx.showToast({
              title: '创建活动成功',
            })
            wx.cloud.callFunction({
              name: 'joinuser',
              data: {
                activityId: res._id,
                act_name: that.data.act_name
              },
              success: res =>{
                that.data.Interval = setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              },
              fail:err=>{
                wx.showToast({
                  icon: 'none',
                  title: '创建活动失败'
                })
              }
            })
            
            
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '创建活动失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    
  },
  call: function (e) {
    console.log(e.currentTarget.id)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
    })
  },
  bindPickerChange:function(e){
    console.log(e)
    this.setData({
      index: e.detail.value,
      associationId: this.data.assList[e.detail.value]._id
    })
  }
})