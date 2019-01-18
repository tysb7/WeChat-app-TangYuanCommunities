const db = wx.cloud.database();
const _ = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    associationdata:[],
    joinbutton:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      creatassId: options.id
    })
    
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection('association').doc(that.data.creatassId).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          associationdata: res.data,
        })
        var joinerList = res.data.ass_joiner
        console.log(joinerList.length)
        if (joinerList.length > 5) {
          //开团成功
          wx.cloud.callFunction({
            name: 'creatsuccess',
            data: {
              associationId: that.data.associationdata._id,
              state: true
            },
            success: function (res) {
              console.log(res)
              that.setData({
                joinbutton: true,
              })
              wx.showToast({
                title: '开团成功！',
                icon: 'success',
                image: '',
                duration: 1500,
                mask: true,
                success: function(res) {
                },
                fail: function(res) {},
                complete: function(res) {},
              })
              that.data.Interval = setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/associationmore/index?id=' + that.data.creatassId+'',
                })
              }, 1500)
            }
          })
        }
        for (var i = 0; i < joinerList.length; i++) {
          //console.log(joinerList[i].openid == wx.getStorageSync("openid"))
          if (joinerList[i].openid == wx.getStorageSync("openid")) {
            //console.log("1")
            that.setData({
              joinbutton: true,
            })
            break;
          } else {
            //console.log("1")
            that.setData({
              joinbutton: false,
            })
          }
        }
      }
    })
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
      title: '我正在创建' + this.data.associationdata.ass_name+',快来和我一起合伙吧',
      path: '/pages/creataassociations/index?id=' + this.data.associationdata._id+'',
      //imageUrl: '/images/90yy.png',
      success: function (res) {
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
  join:function(e){
    var that = this;
    //添加formid
    let formId = e.detail.formId
    db.collection('formId').add({
      data: {
        formId: formId,
        date: new Date()
      }
    })
      .then(res => {
        console.log(res)
      })
      //判断用户是否认证信息
    if (wx.getStorageSync('renzheng') == true){
      wx.cloud.callFunction({
        name: 'assjoinuser2',
        data: {
          associationId: that.data.associationdata._id,
          admin: false,
          id: 'superadmin',
          openid: wx.getStorageSync('openid'),
          user_avatar: wx.getStorageSync('userInfos').user_avatarUrl,
          user_name: wx.getStorageSync('userInfos').user_name,
          user_phone: wx.getStorageSync('userInfos').user_phone,
          user_wechat: wx.getStorageSync('userInfos').user_wechat,
          value: that.data.associationdata.ass_joiner.length
        },
        success: function (res) {
          that.setData({
            joinbutton: false,
          })
          const db = wx.cloud.database();
          const _ = db.command;
          console.log(wx.getStorageSync("userInfos")._id)
          console.log(that.data.associationdata._id)
          console.log(that.data.associationdata.ass_name)
          db.collection('userinfo').doc(wx.getStorageSync("userInfos")._id).update({
            data: {
              association: _.push({
                ass_id: that.data.associationdata._id,
                ass_name: that.data.associationdata.ass_name
              })
            },
            success: function (res) {
              console.log(res)
              //刷新
              that.onReady();
            }
          })
          wx.showToast({
            title: '加入成功！',
            icon: 'success',
            image: '',
            duration: 1500,
            mask: true,
            success: function (res) {

            },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            joinbutton: true,
          })
        },
        fail: console.error
      })
    }else{
      wx.showToast({
        title: '请先完善个人信息',
        icon: '',
        image: '',
        duration: 1500,
        mask: true,
        success: function (res) {
          wx.switchTab({
            url: 'pages/usr/index'
          })
         },
        fail: function (res) { },
        complete: function (res) { },
      })
      
    }
    console.log()
  },
  //发送模板消息
  send: function (e) {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    //let formId = e.detail.formId;
    let data = {
      keyword1: {
        value: '创建社团'
      },
      keyword2: {
        value: 'that.data.ass_name'
      },
      keyword3: {
        value: 'that.data.userinfodate.user_name'
      },
      keyword4: {
        value: 'that.data.ass_mes'
      }
    };
    wx.cloud.callFunction({
      name: 'wxmessage',
      data: {
        //code: app.globalData.code, // 由于小程序云自带 openId，这里的code其实可以不传
        templateId: 'p1ERTjnjq4FV-gKcM8ZEEDsaJPg1v0qowjae9ilzmf0',
        formId: this.data.formId,
        data,
        page: '/pages/activitycard/index',
      },
    }).then((res) => {
      console.log(res);

    });
    
  },
  
})