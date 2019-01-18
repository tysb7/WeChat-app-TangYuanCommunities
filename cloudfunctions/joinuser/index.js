// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//用户参与活动写入用户数据
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('userinfo').doc(event.user_userid).update({
      data: {
        activity: _.push({
          act_id: event.activityId,
          act_name: event.act_name,
          start_time: new Date(new Date()),
          signin_time:''
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
  return {
    context: context,
  }
  //上传到用户数据
}
