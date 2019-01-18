const app = getApp()
// time
var util = require('../unitl.js');

Page({
  data: {
    GotUserInfohidden: false, //设置登陆button隐藏
    avatarUrl: 'user-unlogin.png',
    userInfo: {},
    logged: false,
    act_info_show: false,
    takeSession: false,
    requestResult: '',
    denglu: false,
    onGetUserInfo: 'onGetUserInfo',
    userAssadminList: [],
    list: [{
      name: '我的活动',
      open: false,
      pages: [],
      id: []
    }],
    ass_list: [{
      name: '我的社团',
      open: false,
      pages: [],
      id: []
    }],
    act_list: [{
      name: '发布活动',
      open: false,
      pages: [],
      id: []
    }],
    extraData: {
      id: '38410'
    }

  },
  onLoad: function() {
    var that = this;
    var time = util.formatTime(new Date());
    that.setData({
      denglu: wx.getStorageSync('denglu')
    })
    that.onGetOpenid();
    that.onassadmin();
    that.onuserinfo();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();

    console.log(Date.parse(new Date()) / 1000)
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var that = this;
    that.onLoad();
  },
  onGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    wx.setStorageSync("userInfo", e.detail.userInfo)

    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        denglu: true
      })
      wx.setStorageSync('denglu', true)
      this.onLoad();
      console.log("获取用户信息")
      var that = this
      const db = wx.cloud.database()
      db.collection('userinfo').where({
        _openid: wx.getStorageSync("openid")
      }).get({
        success: res => {

          console.log('[数据库] [查询记录] 成功: ', res.data.length)
          if (res.data.length == 0) {
            this.creatuserinfo();
            this.onLoad();
          }

        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    } else {
      console.log("用户中心")
    }
  },
  userinfo: function() {
    wx.navigateTo({
      url: '../userinfo/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  creatuserinfo: function() {
    var that = this;
    const db = wx.cloud.database()
    db.collection('userinfo').add({
      data: {
        user_name: wx.getStorageSync("userInfo").nickName,
        user_avatarUrl: wx.getStorageSync("userInfo").avatarUrl,
        user_phone: '',
        user_wechat: '',
        activity: [],
        association: [],
        start_time: new Date(new Date())
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {

        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

      }
    })
  },

  kindToggle: function(e) {
    console.log(e)
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
        if (list[i].pages.length == 0) {
          if (i == 0) {
            wx.showToast({
              title: '您尚未参与活动',
              icon: "none",
              duration: 1500
            })
          }
          if (i == 1) {
            wx.showToast({
              title: '您尚未加入社团',
              icon: "none",
              duration: 1500
            })
          }

        }

      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  ass_kindToggle: function(e) {
    console.log(e)
    var id = e.currentTarget.id,
      list = this.data.ass_list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
        if (list[i].pages.length == 0) {
          wx.showToast({
            title: '您尚未加入社团',
            icon: "none",
            duration: 1500
          })
        }

      } else {
        list[i].open = false
      }
    }
    this.setData({
      ass_list: list
    });
  },
  sendactivity: function(e) {
    if (this.data.userAssadminList.length > 0) {
      wx.navigateTo({
        url: '../sendactivity/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showToast({
        title: '您暂时没有权限',
        icon: 'none'
      })
    }

  },


  //查询用户信息
  onuserinfo: function() {
    var that = this
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: wx.getStorageSync("openid")
    }).get({
      success: res => {
        console.log('[查询记录] 查询用户信息成功: ', res.data)
        wx.setStorageSync("userid", res.data[0]._id)
        wx.setStorageSync('userInfos', res.data[0])
        that.setData({
          userInfos: res.data[0]
        })
        
        that.datelist();
        //push"我的活动"数据
        var activity = res.data[0].activity
        var list = that.data.list
        for (var i = 0; i < activity.length; i++) {
          list[0].pages[i] = activity[i].act_name
          list[0].id[i] = activity[i].act_id
        }

        //push"我的社团"数据
        var ass_list = that.data.ass_list
        var ass = res.data[0].association
        console.log(res.data[0].association)
        for (var i = 0; i < ass.length; i++) {
          ass_list[0].pages[i] = ass[i].ass_name
          ass_list[0].id[i] = ass[i].ass_id
        }
        console.log(new Date(activity[0].start_time))
        console.log(util.formatTime(new Date(activity[0].start_time)))
        var act_info = []
        for (var i = 0; i < 30; i++) {
          //日期后推30天
          var start_time = util.formatTime(new Date(new Date() - 86400000 * i)).substring(0, 10)
          //console.log(start_time.substring(5, 7))
          act_info.push({
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
                act_info[i].corol = "#ff663f"
              } else {
                act_info[i].corol = "#ff2345"
              }
            } else {

            }
          }


        }
        console.log(act_info)
        that.setData({
          act_info: act_info,
          act_info_show: true
        })
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[查询记录] 查询活动信息失败：', err)
      }
    })
  },
  activitymore: function(e) {
    console.log(this.data.list[0].id[e.currentTarget.id])
    // console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../activitymore/index?id=' + this.data.list[0].id[e.currentTarget.id] + '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  assmore: function(e) {
    console.log(this.data.ass_list[0].id[e.currentTarget.id])
    console.log(this.data.ass_list)
    wx.navigateTo({
      url: '../associationmore/index?id=' + this.data.ass_list[0].id[e.currentTarget.id] + '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //查询社团admin
  onassadmin: function() {
    var that = this
    const db = wx.cloud.database()
    db.collection('association').where({
      state: true
    }).get({
      success: res => {
        console.log('[查询记录] 查询社团信息成功: ', res.data)
        var assadminDate = res.data
        var userAssadminList1 = []
        for (var i = 0; i < assadminDate.length; i++) {
          for (var j = 0; j < assadminDate[i].ass_joiner.length; j++) {
            //console.log(assadminDate[i].ass_joiner[j].openid == wx.getStorageSync("openid"))
            //console.log(assadminDate[i].ass_joiner[j].admin)
            //var userAssadminList = []
            //userAssadminList.push(assadminDate[i]._id)
            if (assadminDate[i].ass_joiner[j].openid == wx.getStorageSync("openid") && assadminDate[i].ass_joiner[j].admin == true) {
              var userAssadminList = []
              userAssadminList1.push({
                _id: assadminDate[i]._id,
                name: assadminDate[i].ass_name,
                state: assadminDate[i].state
              })
              //console.log(userAssadminList)
            }
          }
        }
        that.setData({
          userAssadminList: userAssadminList1
        })
        console.log('拥有admin的社团', that.data.userAssadminList)
        wx.setStorageSync('userAssadminList', that.data.userAssadminList)
      },
      fail: err => {

        console.error('[查询记录] 查询活动信息失败：', err)
      }
    })
  },
  creataassociation: function() {
    console.log(wx.getStorageSync('userInfos').user_sn == undefined)
    console.log(wx.getStorageSync('userInfos').user_sn == '')
    console.log(wx.getStorageSync('userInfos').user_sn)


    if (wx.getStorageSync('renzheng') == true) {
      wx.navigateTo({
        url: '/pages/creataassociation/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
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
  },
  datelist: function() {
    console.log(new Date(new Date() - 86400000))
    console.log(new Date(wx.getStorageSync('userInfos').start_time))
    console.log(Math.floor((new Date() - (new Date(wx.getStorageSync('userInfos').start_time))) / 1000 / 60 / 60 / 24))
  }
});