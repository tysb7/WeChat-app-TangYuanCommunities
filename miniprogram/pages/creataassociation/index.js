const app = getApp();
const db = wx.cloud.database();
const _ = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [{
        text: '第一步',
        desc: '填写信息'
      },
      {
        text: '第二步',
        desc: '填写详情'
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
    userinfodate:'',
    index: 0,
    active: 0,
    ass_name: '',
    ass_wechat: '',
    ass_phone: '',
    ass_mes: '',
    files: [],
    jian: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.onuserinfo();
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
  ass_name: function(e) {
    console.log(e.detail.value)
    this.setData({
      ass_name: e.detail.value
    })
  },
  ass_wechat: function(e) {
    console.log(e.detail.value)
    this.setData({
      ass_wechat: e.detail.value
    })
  },
  ass_phone: function(e) {
    console.log(e.detail.value)
    this.setData({
      ass_phone: e.detail.value
    })
  },
  ass_mes: function(e) {
    console.log(e.detail.value)
    this.setData({
      ass_mes: e.detail.value
    })
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
            if ((res.width / res.height) < 1.1 && (res.width / res.height) > 0.9) {
              console.log("Ok")
            } else {
              wx.showToast({
                title: '请上传1：1图标',
                icon: 'none',
                duration: 1500,
                success: function(res) {
                  that.delImage();
                },
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
    var img = []
    console.log(img.push(this.data.files))
    wx.previewImage({
      current: 0, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  },
  delImage: function(e) {
    var that = this;
    that.setData({
      files: [],
      jian: false
    })
  },
  nextstep:function(e){
    console.log(e)
    var that = this;
    let formId = e.detail.formId
    db.collection('formId').add({
      data: {
        formId: formId,
        date:new Date()
      }
    })
      .then(res => {
        console.log(res)
      })
    if (that.data.ass_name !== 0 && that.data.ass_wechat !== 0 && that.data.ass_phone !== 0 && that.data.ass_mes) {
      that.uplodeimg();

    }
    else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  uplodeimg:function(){
    wx.showLoading({
      title: '上传中',
    })
    var that = this;
    if (that.data.files.length == 0){
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '请选择LOGO',
      })
    }
    else{

      const filePath = that.data.files
      // 上传图片
      const cloudPath = 'asslogo/' + Math.random() + 'my-image' + filePath.match(/\.[^.]+?$/)[0]
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
              that.setData({
                ass_logo: res.fileList[0].tempFileURL
              })
              console.log(that.data.ass_logo)
              that.upload();
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
    
  },
  upload:function(){
    var that = this 
    console.log(that.data.ass_name)
    console.log(that.data.ass_wechat)
    console.log(that.data.ass_phone)
    console.log(that.data.ass_mes)
    console.log(that.data.ass_logo)

    wx.showLoading({
      title: '发送请求中',
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('association').add({
      data: {
        ass_name: that.data.ass_name,
        ass_Builderwechat: that.data.ass_wechat,
        ass_Builderphone: that.data.ass_phone,
        ass_info: that.data.ass_mes,
        ass_logo: that.data.ass_logo,
        Builder_openid: wx.getStorageSync('openid'),
        Builder_name: that.data.userinfodate.user_name,
        ass_admin:[],
        ass_joiner:[{
          admin:true,
          id:"builder",
          openid:wx.getStorageSync("openid"),
          user_avatar: wx.getStorageSync("userInfos").user_avatarUrl,
          user_name: wx.getStorageSync("userInfos").user_name,
          user_phone: wx.getStorageSync("userInfos").user_phone,
          user_wechat: wx.getStorageSync("userInfos").user_wechat,
          value:0
        }],
        state:false,
        Authentication:false

      },
      success: res => {
        wx.showToast({
          title: '申请成功！',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.navigateTo({
          url: '/pages/creataassociations/index?id=' + res._id + '',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        //储存到自己信息中
        db.collection('userinfo').doc(wx.getStorageSync("userInfos")._id).update({
          data: {
            association: _.push({
              ass_id: res._id,
              ass_name: that.data.ass_name
            })
          }
        })
        // that.data.Interval = setTimeout(function () {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }, 1500)
        //clearTimeout(this.data.Interval);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发送失败！'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  onuserinfo:function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: wx.getStorageSync("openid")
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data[0])
        that.setData({
          userinfodate: res.data[0]
        })
        //console.log(that.data.userinfodate.user_name)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //发送模板消息
  send:function(e){
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    let formId = e.detail.formId;
    let data = {
      keyword1: {
        value: '创建社团'
      },
      keyword2: {
        value: that.data.ass_name
      },
      keyword3: {
        value: that.data.userinfodate.user_name
      },
      keyword4: {
        value: that.data.ass_mes
      }
    };
    wx.cloud.callFunction({
      name: 'wxmessage',
      data: {
        code: app.globalData.code, // 由于小程序云自带 openId，这里的code其实可以不传
        templateId: 'p1ERTjnjq4FV-gKcM8ZEEDsaJPg1v0qowjae9ilzmf0',
        formId: formId,
        data,
        page: '/pages/activitycard/index',
      },
    }).then((res) => {
      console.log(res);
      if (res.result && res.result.data && res.result.data.errcode === 0) {
        wx.hideLoading()

        wx.showToast({
          title: '报名成功',
          icon: "none",
          duration: 1500
        })
        that.setData({
          joinbutton: true
        })
      } else {
        wx.showToast({
          title: '报名失败',
          icon: 'none'
        })
      }
    });
  },
  // uploadformid:function(e){
  //   var fromid = e.detail.formId
  //   this.setData({
  //     fromid: e.detail.formId
  //   })
  // }
})