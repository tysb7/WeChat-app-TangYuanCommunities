// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//用户参与活动
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('activity').doc(event.activityId).update({
      data: {
        joinuser: _.push({
          user_openid: event.user_openid,
          user_avatar: event.user_avatar
        })
      }
    })

  } catch (e) {
    console.error(e)
  }
  return {
    context: context,
  }
}
