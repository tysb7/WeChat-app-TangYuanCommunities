// pages/association/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    associationData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.onQuery();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var that = this;
    that.onLoad();
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
    
  },
  //查询社团信息
  onQuery: function () {
    const db = wx.cloud.database()
    db.collection('association').where({
      state:true
    }).get({
      success: res => {
        this.setData({
          associationData: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.associationData)
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
  lookmore:function(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/associationmore/index?id='+ e.currentTarget.id+'',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})