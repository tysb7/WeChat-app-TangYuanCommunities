// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//用户参与活动
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('userinfo').where({
      _openid: event.useropenid
    }).update({
      data: {
        activity: event.user_activity
      }
    })

  } catch (e) {
    console.error(e)
  }
  return {
    context: context,
  }
}
