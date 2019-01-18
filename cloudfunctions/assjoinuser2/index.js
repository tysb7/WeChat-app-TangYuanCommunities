// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//用户开团写入数据
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('association').doc(event.associationId).update({
      data: {
        ass_joiner: _.push({
          admin:event.admin,
          id:event.id,
          openid:event.openid,
          user_avatar: event.user_avatar,
          user_name:event.user_name,
          user_phone:event.user_phone,
          user_wechat:event.user_wechat,
          value: event.value
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
