App({
  userInfo: null,
  
  // demoDomain: 'https://xxxxxx.mapp-test.xyz',
  // 请修改为您的小程序云应用的真实域名
  demoDomain: 'http://127.0.0.1:7001',

  getUserInfo() {
    var theDemoDomain = this.demoDomain;
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      console.log("get user info...");
      my.getAuthCode({
        scopes: 'auth_user',
        success: res => {
          console.info('authCode>>>>>>>>>', res.authCode);

          my.request({
            url: theDemoDomain +'/users?authcode=' + res.authCode,
            method: 'GET',
            success: function(res) {
              console.log('user info>>>>>>>>>>>', res);
              resolve(res.data);
            },
            fail: function(res) {
              
              console.log('query user info fail>>>>>>>', res);
              my.alert({content: 'fail: ' + res});
            },
            complete: function(res) {
              console.log('query user info complete>>>>>>', res);
            }
          });
        },
        fail: () => {
          console.log('get authcode fail');
          reject({});
        },
      });
    });
  },
});
