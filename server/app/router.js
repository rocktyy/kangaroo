'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;  
  router.get('/hello', controller.home.);
  router.get('/home', controller.home.index);
  
  router.get('/users', controller.user.getUserInfo);
  router.post('/apply/init', controller.apply.initApplyInfo);
  router.post('/apply/add', controller.apply.addApplyChair);
  router.post('/apply/change', controller.apply.changeState);
  router.post('/sms/sendSms', controller.sms.sendSms);
  router.post('/upload', controller.file.upload);

  router.post('/sendBack/init', controller.sendback.getSendBackInfo);
  router.post('/sendBack/add', controller.sendback.addAccount);
  
};
