'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;  
  router.get('/say-hello', controller.home.index);
  router.get('/users', controller.user.getUserInfo);
  router.get('/todos', controller.operation.getTodos);
  router.post('/sms/sendSms', controller.sms.sendSms);
  router.post('/todos/delete', controller.operation.deleteTodo);
  router.post('/todos/change', controller.operation.changeState);
  router.post('/todos/add', controller.operation.addTodo);

  router.post('/sendBack/init', controller.sendback.getSendBackInfo);
  router.post('/sendBack/add', controller.sendback.addAccount);
  
  router.post('/upload', controller.file.upload);
};
