const app = getApp();
var client = {};
client.init = function (apiUrl, appId, appSecret){
  this.apiUrl = apiUrl;
  this.appId  = appId;
}

client.send = function (mobile){
  var theDemoDomain = app.demoDomain;
  return new Promise(function (resolve, reject) {
    my.request({
      url: theDemoDomain + '/sms/sendSms',
      method: 'POST',
      data: {
        telphoneNum: mobile,
      },
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      success: (res) => {
        resolve(res.data);
      },
      fail: function(res) {
        reject();
      }
    });
  });
} 

//发送验证码
client.sendCode = function (number_) {
  my.setStorageSync({key:'sms_mobile', data:number_});
  client.send(number_).then(res=>{
    if(res.success){
      my.setStorageSync({key:'sms_core', data: res.sms_number});
    }else{
      my.showToast({
        content:'验证码请求失败，请重试'
      })
    }
  }); 
}

//验证验证码
client.validateCode = function (number) {
  var smsNum = my.getStorageSync({key: 'sms_core'}).data + "";
  if (number !== smsNum) {
    return false;
  }
  return true;
}
module.exports = {
  client: client
}