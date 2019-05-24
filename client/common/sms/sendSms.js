const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: 'LTAI7BFvPjPYX4GL',
  accessKeySecret: 'xfO1H0WC3sy3LsT5M6iHU5KslZWhSg',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

let randomCode = parseInt((Math.random() * 9000 + 1000)),
  templateParam = `{\"code\":\"${randomCode}"\}`; 
  console.log(templateParam);
var params = {
  "RegionId": "cn-hangzhou",
  "PhoneNumbers": "18600090136",
  "SignName": "袋鼠行动验证码",
  "TemplateCode": "SMS_166375068",
  "TemplateParam": templateParam;
}

var requestOption = {
  method: 'POST'
};

client.request('SendSms', params, requestOption).then((result) => {
  console.log(result);
}, (ex) => {
  console.log(ex);
})


