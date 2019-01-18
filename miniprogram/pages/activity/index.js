// time
var util = require('../unitl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityData: [],
    morelesshidden: true,
    data1:'',
    src2:'',
    fontFamily: 'Bitstream Vera Serif Bold',
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: time.substring(0, 10)
    });
    console.log(that.data.date)
    
    that.onQuery();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  
    //that.qrcode();
    
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
    wx.showNavigationBarLoading();
    var that = this;
    that.onLoad();
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
  //查询活动信息
  onQuery: function() {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("activity").orderBy("act_date", 'asc').orderBy("act_time", 'desc').where({
      act_date: _.gte(this.data.date)
      })
      .get({
        success: res => {
          this.setData({
            activityData: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', this.data.activityData)
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
  moreless: function(e) {
    var id = e.currentTarget.id,
      activityData = this.data.activityData;
    for (var i = 0; i < activityData.length; i++) {
      if (activityData[i]._id == id) {
        activityData[i].open.open = !activityData[i].open.open
        //时间转换
        // var d = new Date(activityData[i].act_time)
        // var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
        // activityData[i].act_time = datetime
      } else {
        activityData[i].open.open = false
      }
    }
    this.setData({
      activityData: activityData
    });

  },
  lookmore: function(e) {
    wx.navigateTo({
      url: '../activitymore/index?id=' + e.currentTarget.id + '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  qrcode:function(e){
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    wx.cloud.callFunction({
      name: 'qrcode',   // 云函数名称
      data: {    // 小程序码所需的参数
        page: "pages/activitymore/index",
        id: 'W6nGCxCzvz2iPhyN'
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
            console.log(res.fileList[0])
            that.setData({
              imageUrl: res.fileList[0].tempFileURL
            })
          },
          fail: console.error
        })
      }
    })
    
  }
})