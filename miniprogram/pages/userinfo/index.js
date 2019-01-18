// time
var util = require('../unitl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfodate: [],
    user_name: '',
    user_phone: '',
    user_wechat: '',
    user_dad: '',
    user_sn: '',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: wx.getStorageSync("openid")
    }).get({
      success: res => {

        console.log(res.data[0].start_time)
        wx.setStorageSync('userInfos', res.data[0])
        that.setData({
          userinfodate: res.data[0],
          user_name: res.data[0].user_name,
          user_phone: res.data[0].user_phone,
          user_wechat: res.data[0].user_wechat,
          user_dad: res.data[0].user_dad,
          user_sn: res.data[0].user_sn,
          id: res.data[0]._id,
          
        })
        //console.log(that.data.userinfodate.user_name)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    // var mobile = '13201520701'
    // var smscode = '110426'
    // var plugin = requirePlugin("qcloudsms")

    // plugin.sendSMS(
    //   {
    //     secretid: 'AKIDlECVCcO9Daq65I6pmmVE98V3g1Kf5Lf6eri',
    //     secretkey: 'd9Rlu82cYh3Wx53ggy644Z0n0BPz3127XZ8zWWc6',
    //     mobile: mobile,
    //     content: '您的手机号：' + mobile + '，验证码：' + smscode + '，请及时完成验证，如不是本人操作请忽略。【腾讯云市场】'
    //   },

    //   function success(res) {
    //     if (res.data.message) {
    //       console.log(res.data.message)
    //     } else if (res.data.result >= 0) {
    //       console.log(res.data.errmsg)
    //     } else {
    //       console.log(res.data.errmsg)
    //     }
    //   },

    //   function fail(err) {
    //     console.log(err.errMsg)
    //   }
    // )
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
  user_name: function(e) {
    console.log(e.detail.value)
    this.setData({
      user_name: e.detail.value
    })
  },
  user_phone: function(e) {
    console.log(e.detail.value)
    this.setData({
      user_phone: e.detail.value
    })
  },
  user_wechat: function(e) {
    console.log(e.detail.value)
    this.setData({
      user_wechat: e.detail.value
    })
  },
  user_dad: function(e) {
    console.log(e.detail.value)
    this.setData({
      user_dad: e.detail.value
    })
  },
  user_sn: function(e) {
    console.log(e.detail.value)
    this.setData({
      user_sn: e.detail.value
    })
  },
  update: function() {
    wx.showLoading({
      title: '',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    var that = this
    const db = wx.cloud.database()
    //const newCount = this.data.count + 1
    db.collection('userinfo').doc(this.data.id).update({
      data: {
        user_name: that.data.user_name,
        user_phone: that.data.user_phone,
        user_wechat: that.data.user_wechat,
        user_dad: that.data.user_dad,
        user_sn: that.data.user_sn
      },
      success: res => {
        console.log(res)
        if (that.data.user_name !== '' && that.data.user_phone !== '' && that.data.user_wechat !== '' && that.data.user_dad !== '' && that.data.user_sn !== ''){
          wx.setStorageSync("renzheng", true)
        }
        else{
          wx.setStorageSync("renzheng", false)
        }
        wx.hideLoading();
        wx.showToast({
          title: '更改成功',
          icon: 'success',
          duration: 1500,
          mask: true,
          success: function(res) {
            that.onLoad();
            that.data.Interval = setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
            //clearTimeout(that.data.Interval);
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })


  }
})