'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;  
  router.get('/say-hello', controller.home.index);
  router.get('/todos', controller.home.getTodos);
  router.get('/users', controller.home.getUserInfo);
  router.post('/todos/delete', controller.home.deleteTodo);
  router.post('/todos/change', controller.home.changeState);
  router.post('/todos/add', controller.home.addTodo);
  router.post('/upload', controller.home.upload);
};
