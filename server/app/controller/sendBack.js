'use strict';
const Controller = require('egg').Controller; 

class SendBackController extends Controller {

  async addAccount() {
    // 从请求消息体中取得task信息
    const { name, telephone_nm, address, express_type, express_number, userId } = this.ctx.request.body;
    
    console.log(this.ctx.request.body);

    // 将请求中的task转化为与数据库中结构一致的格式
    const newTask = {
      label: text,
      done: completed ? 1 : 0,
      img_url: iconUrl === '' ? null : iconUrl,
      user_id: userId
    }
    console.log("Task to be added >>>", newTask);
    
    // 向数据库插入数据
    const result = await this.app.mysql.insert('send_back_info', newTask);
    
    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

}

module.exports = SendBackController;
