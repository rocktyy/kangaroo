


App({
  userInfo: null,  
  imgUrl: '',
  activityId: 'Third_20190601',
  startDate: '2019/6/01 8:00',

  // 请修改为您的小程序云应用的真实域名
  demoDomain: 'https://kangarooaaction.autovideogroup.com',

  getUserInfo() {
    var theDemoDomain = this.demoDomain;
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);
      my.getAuthCode({
        scopes: 'auth_user',
        success: res => {
          my.request({
            url: theDemoDomain +'/users?authcode=' + res.authCode,
            method: 'GET',
            success: function(res) {
              resolve(res.data);
            },
            fail: function(res) {
              my.alert({content: 'fail: ' + res});
            },
            complete: function(res) {
            }
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
});
