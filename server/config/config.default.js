'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1536859564199_3953';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      ignoreJSON: false,
    },
  };

  config.mysql = {
    client: {
      host: '106.14.134.49',
      port: '3306',
      user: 'admin',
      // admin用户的初始密码请到云服务详情页的“数据库”标签页查看
      password: 'y3wS7c8w', 
      database: 'kangaroo',
    },
    app: true,
    agent: false,
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/sample',
      options: {
        user: 'admin',
        // admin用户的初始密码请到云服务详情页的“数据库”标签页查看
        pass: '',
        useNewUrlParser: true,
      },
    },
  };

  return config;
};
