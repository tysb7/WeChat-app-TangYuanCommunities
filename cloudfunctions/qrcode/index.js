const cloud = require('wx-server-sdk')
const axios = require('axios')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxd43ec2bfbf854c39&secret=628b975c9e09d87f07fa60e459be8c27')
    //const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxee8c0e9bb6fbe930&secret=592aebbf8e49db5656860b66ec04af4f')
    const token = JSON.parse(resultValue).access_token;
    console.log('------ TOKEN:', token);

    const response = await axios({
      method: 'post',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      responseType: 'stream',
      params: {
        access_token: token,
      },
      data: {
        page: event.page,
        width: 500,
        scene: event.id,
        auto_color: false,
        is_hyaline:false
      },
    });
    return await cloud.uploadFile({
      cloudPath: 'xcxcodeimages/' + event.id + '.png',
      fileContent: response.data,
    });
  } catch (err) {
    console.log('>>>>>> ERROR:', err)
  }
}