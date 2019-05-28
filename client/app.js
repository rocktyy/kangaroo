


App({
  userInfo: null,  
  imgUrl: '',
  activityId: 'Third_20190601',
  startDate: '2019-6-01 8:00',

  // 请修改为您的小程序云应用的真实域名
  demoDomain: 'https://app2138419400test.mapp-test.xyz',

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
          reject({});
        },
      });
    });
  },
});
