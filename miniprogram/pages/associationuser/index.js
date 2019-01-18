// pages/associationuser/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // checkboxItems: [
    //   { name: 'standard is dealt for u.', value: '0', checked: true },
    //   { name: 'standard is dealicient for u.', value: '1', checked: true }
    // ],
    ass_joinerList:[],
    newjoinuserList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this;
    that.setData({
      associationId: options.id
    })
    that.onQuery();
    that.onnew();


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
    var that = this;
    const db = wx.cloud.database()
    db.collection('association').where({
      _id: that.data.associationId
    }).get({
      success: res => {
        console.log("社团信息：", res.data[0].ass_joiner)
        that.setData({
          associationData: res.data,
          ass_info: res.data[0].ass_info,
          ass_joinerList: res.data[0].ass_joiner
        })
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
  //查询申请用户信息
  onnew: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('newjoinuser').where({
      association_id: that.data.associationId
    }).get({
      success: res => {
        var newjoinuserList = [];
        console.log("新申请用户数据：",res.data)
        for (var i = 0; i < res.data.length;i++){
          res.data[i].value = i
          console.log(res.data[i].value = i)
          newjoinuserList.push(res.data[i])
        }
        that.setData({
          newjoinuserList: newjoinuserList
          
        })
        console.log("编号后的新申请用户数据：",newjoinuserList)
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
  checkboxChange: function (e) {
    var ass_joinerList = this.data.ass_joinerList, values = e.detail.value;
    console.log(e)
    console.log("ass_joinerList",ass_joinerList)
    console.log("e.detail.value",e.detail.value)
    for (var i = 0, lenI = ass_joinerList.length; i < lenI; ++i) {
      console.log("ass_joinerList[i].admin",ass_joinerList[i].admin)
      ass_joinerList[i].admin = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        console.log("ass_joinerList[i].value",ass_joinerList[i].value)
        console.log("values[j]",values[j])
        if (ass_joinerList[i].value == values[j]) {
          ass_joinerList[i].admin = true;
          break;
        }
      }
    }

    this.setData({
      ass_joinerList: ass_joinerList
    });
    console.log(this.data.ass_joinerList)

    

    this.setData({
      ass_joinerList: ass_joinerList
    });
    
    
  },
  checkboxChange1: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  joinChange: function (e) {
    var newjoinuserList = this.data.newjoinuserList, values = e.detail.value;
    for (var i = 0, lenI = newjoinuserList.length; i < lenI; ++i) {
      newjoinuserList[i].admin = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (newjoinuserList[i].value == values[j]) {
          newjoinuserList[i].admin = true;
          break;
        }
      }
    }

    this.setData({
      newjoinuserList: newjoinuserList
    });
    console.log(this.data.newjoinuserList)
  },
  update:function(e){
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    //更新管理员
    // db.collection('association').doc(that.data.associationId).update({
    //   data: {
    //     ass_joiner: that.data.ass_joinerList
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
    //添加新成员
    var newjoinuserList =[];
    var num = that.data.ass_joinerList.length;
    console.log(num)
    //push出要添加成员数据
    for (var i = 0; i < that.data.newjoinuserList.length;i++){
      if (that.data.newjoinuserList[i].admin == false){
        //给要添加成员编号
        that.data.newjoinuserList[i].value = num + i
        newjoinuserList.push({
          id: that.data.newjoinuserList[i]._id,
          user_name: that.data.newjoinuserList[i].user_name,
          user_phone: that.data.newjoinuserList[i].user_phone,
          user_wechat: that.data.newjoinuserList[i].user_wechat,
          value: that.data.newjoinuserList[i].value,
          openid: that.data.newjoinuserList[i]._openid,
          user_userid: that.data.newjoinuserList[i].user_userid,
          user_avatar: that.data.newjoinuserList[i].user_avatar,
        })  
      }
    }
    console.log(newjoinuserList)
    that.setData({
      newjoinuserList: newjoinuserList
    })
    //合并成员
    console.log(that.data.ass_joinerList.concat(newjoinuserList))
    db.collection('association').doc(that.data.associationId).update({
      data: {
        ass_joiner: that.data.ass_joinerList.concat(newjoinuserList)
      },
      success: function (res) {
        console.log(res)
        //发送给云函数移除添加过的成员
        for (var i = 0; i < newjoinuserList.length;i++){
          console.log(newjoinuserList[i].id)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'removejoinuser',
            // 传给云函数的参数
            data: {
              id: newjoinuserList[i].id
            },
            success: function (res) {
              
            },
            fail: console.error
          })
          console.log(that.data.newjoinuserList)
          //发送给云函数将社团信息写入userinfo表单
          wx.cloud.callFunction({
            // 云函数名称
            name: 'assjoinuser',
            // 传给云函数的参数
            data: {
              user_userid: that.data.newjoinuserList[i].user_userid,
              association_Id: that.data.associationData[0]._id,
              association_name: that.data.associationData[0].ass_name
            },
            success: function (res) {
              console.log(res)
            },
            fail: console.error
          })
        }
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          image: '',
          duration: 1500,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        //定时返回上一页
        that.data.Interval = setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })

    // for (var i = 0; i < newjoinuserList.length;i++){
    //   db.collection('newjoinuser').doc(newjoinuserList[i]._id).remove({
    //   success: function (res) {
    //     console.log(res)
    //     db.collection('association').doc(that.data.associationId).push({
    //       data: {
    //         ass_joiner: newjoinuserList[i]
    //       },
    //       success: function (res) {
    //         console.log(res)
    //       }
    //     })
    //   }
    //   })
    // }
    
  },
  update1:function(){
    //更新管理员和添加成员
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('association').doc(that.data.associationId).update({
      data: {
        ass_joiner: that.data.Newass_joinerList
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  call:function(e){
    console.log()
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})