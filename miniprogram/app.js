//app.js
const ald = require('/dist/alading/ald-stat.js');
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:'phsl-62bbb8'
      })
    }

    this.globalData = {}
  }
})
