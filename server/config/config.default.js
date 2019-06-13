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
 
  config.mysql = {
    client: {
      host: '47.101.202.3', //online
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
