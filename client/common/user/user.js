const app = getApp();
var user = {}; 

// 保存用户信息
user.saveUserInfo = function (number_) {
  my.setStorageSync({key:'user_mobile', data: number_ });
}

// 获取用户手机号码
user.getUserInfo = function (number) {
  var userMobile = my.getStorageSync({key: 'user_mobile'}).data + "";
  return userMobile;
}

module.exports = {
  user: user
}