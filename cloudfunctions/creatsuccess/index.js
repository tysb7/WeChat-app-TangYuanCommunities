// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//社团创建成功
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('association').doc(event.associationId).update({
      data: {
        state: event.state
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
