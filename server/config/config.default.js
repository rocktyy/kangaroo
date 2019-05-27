'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1536859564199_3953';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      ignoreJSON: false,
      enable: false,
    },
  };

  // !!!!!!MySQL参数host（数据库服务IP地址）和password（admin用户的登录密码）需修改为小程序云应用服务中的MySQL的对应值!!!!!!
  config.mysql = {
    client: {
      // 865750
      //host: '47.101.222.13', //test
      host: '47.101.202.3', 
      port: '3306',
      user: 'admin',
      password: 'dMa4Ghgj', 
      database: 'kangaroo',
      charset : 'utf8mb4'
    },
    app: true,
    agent: false,
  };

  return config;
};
