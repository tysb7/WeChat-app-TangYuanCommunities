// pages/markdowm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markdown: '# 在公众号中添加小程序\n\n> 1.进入公众号后台，选择小程序管理\n\n![](https://phsl-62bbb8.tcb.qcloud.la/icon/4.jpg?sign=a7c9e16477f64d3b837502144de263b9&t=1538708292)\n\n> 2.填入复制的小程序AppId并点击邀请\n\n![](https://phsl-62bbb8.tcb.qcloud.la/icon/3.jpg?sign=73db317f1b9fd92bf06742326a45ad43&t=1538708536)\n\n> 3.修改自定义菜单，添加小程序\n\n![](https://phsl-62bbb8.tcb.qcloud.la/icon/2.jpg?sign=1f48c0e040270413fbf2fb1170c8abc7&t=1538708619)\n\n> 4.填入复制的路径，保存即可\n\n![](https://phsl-62bbb8.tcb.qcloud.la/icon/1.jpg?sign=b42153095db9bb07ae177df94d979765&t=1538708229)\n\n> 5.在公众号推文中添加小程序同第4步方法'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  join(e){
    console.log(e)
    let openid = wx.getStorageSync('openid')
    let formId = e.detail.formId;
    let data ={
      keyword1: {
        value: 'this.data.activityIdData[0].act_name'
      },
      keyword2: {
        value:' this.data.activityIdData[0].act_date '
      },
      keyword3: {
        value: 'this.data.activityIdData[0].act_add'
      },
      keyword4: {
        value:' this.data.activityIdData[0].act_phone'
      }
    }
    wx.cloud.callFunction({
      name: 'wxmessage',
      data: {
        code: '',
        templateId: 'Bg0BnBKFY3BDzUGH3cuqqtib0KHYoHSGJA9ZjwYD2H4', //模板消息ID，可以在公众号后台创建并查询
        formId: formId,
        data,
        page: 'pages/activitycard/index'
      },
    }).then((res) => {
      console.log(res.result)
    })
  }
})