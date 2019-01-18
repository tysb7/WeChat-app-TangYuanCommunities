var QRCode = require('../qrcode.js');
var qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityIdData:'',
    userinfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('openid') + ',' + options.id)
    var that = this;
    that.onQuery();
    that.onuser();
    qrcode = new QRCode('canvas', {
      text: wx.getStorageSync('openid') + ',' + options.id,
      width: 150,
      height: 150,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

 
  //查询社团信息
  onQuery: function () {
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
        //console.error(res)
        that.setData({
          activityIdData: res.data
        })
      },
      fail: err => {
        //console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //查询用户信息
  onuser: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('userinfo').where({
      _openid: wx.getStorageSync("openid")
    }).get({
      success: res => {
        that.setData({
          userinfo: res.data,
        })
        
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
})