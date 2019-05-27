'use strict';
const Controller = require('egg').Controller;
const Core = require('@alicloud/pop-core');

const client = new Core({
  accessKeyId: 'LTAI7BFvPjPYX4GL',
  accessKeySecret: 'xfO1H0WC3sy3LsT5M6iHU5KslZWhSg',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

class SmsController extends Controller {

  async sendSms() {
    const { telphoneNum } = this.ctx.request.body;
    
    let msgSms, randomCode = parseInt((Math.random() * 9000 + 1000)),
      templateParam = `{\"code\":\"${randomCode}"\}`,
      params = {
        "RegionId": "cn-hangzhou",
        "PhoneNumbers": telphoneNum,
        "SignName": "袋鼠行动验证码",
        "TemplateCode": "SMS_166375068",
        "TemplateParam": templateParam,
      },
      requestOption = { method: 'POST' };

    const record =  await client.request('SendSms', params, requestOption).then((result) => {
      msgSms = result;
    }, (ex) => {
      msgSms = ex;
    })
    
    this.ctx.body = {
      success: !!(msgSms.Message === 'OK'),
      msgSms: msgSms,
      sms_number: randomCode + "",
      data: 'sms send ok !',
    };
  }

}

module.exports = SmsController;
