// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//用户加入社团写入用户数据
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('userinfo').doc(event.user_userid).update({
      data: {
        association: _.push({
          
          ass_id: event.association_Id,
          ass_name: event.association_name
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
