'use strict';
const Controller = require('egg').Controller; 

class OperationController extends Controller {

  async getTodos() {
    // 从url的query中取得userId
    var userId = this.ctx.query.userId;
    console.log('user ID in query>>>>>>>>', userId);
    var tasks; 
    if (userId) {
      // 如果前端有传userId，则向数据库请求该userId下的所有task
      tasks = await this.app.mysql.select('task', {
        where: {user_id: userId}
      });  
    } else {
      // 如果前端没有传userId，则返回数据库中所有的task
      tasks = await this.app.mysql.select('task');  
    }
    
    console.log('#################All todos', tasks);
    // 将task转换成前端所需的格式
    const todos = tasks.map(item => {return {
      text: item.label,
      completed: (item.done > 0 ? true : false),
      id: item.id,
      iconUrl: item.img_url
    }});

    // 将todo项写入消息体，返回给前端
    this.ctx.body = {
      success: true,
      todoList: todos
    };
  }

  async changeState() {
    // 从请求消息体中取得userId
    const { id } = this.ctx.request.body;
    console.log("Task ID to be changed >>>", id);

    // 访问数据库拿到task
    const chosenTask = await this.app.mysql.get('task', { id });

    // 修改task的完成状态
    // task.done在数据库中为TINYINT类型，0表示false，1表示true
    chosenTask.done = (chosenTask.done + 1) % 2;

    // 更新task状态
    const result = await this.app.mysql.update('task', chosenTask);

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async deleteTodo() {
    // 从请求消息体中取得userId
    const { id } = this.ctx.request.body;
    console.log("Task ID to be deleted >>>", id);

    // 从数据库中根据ID删除指定task
    const chosenTask = { id };
    const result = await this.app.mysql.delete('task', chosenTask);

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async addTodo() {
    // 从请求消息体中取得task信息
    const { text, completed, iconUrl, userId } = this.ctx.request.body;
    
    // 将请求中的task转化为与数据库中结构一致的格式
    const newTask = {
      label: text,
      done: completed ? 1 : 0,
      img_url: iconUrl === '' ? null : iconUrl,
      user_id: userId
    }
    console.log("Task to be added >>>", newTask);

    // 向数据库插入数据
    const result = await this.app.mysql.insert('task', newTask);
    
    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

}

module.exports = OperationController;
