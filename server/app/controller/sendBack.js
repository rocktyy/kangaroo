'use strict';
const Controller = require('egg').Controller; 

class SendbackController extends Controller {

  async addAccount() {
    // 从请求消息体中取得task信息
    const param = this.ctx.request.body;
    const { name, telphone_num,	user_address, express_type, express_number, alipay_user_id } = this.ctx.request.body;
    
    console.log(this.ctx.request.body);
    // 将请求中的task转化为与数据库中结构一致的格式
    const newTask = {
      ...param,
      express_status: 1,
      activity_id: 'Third_20190601',
    }
    console.log("send_back_info to be added >>>", newTask);

    // 向数据库插入数据
    const result = await this.app.mysql.insert('send_back_info', newTask);
    
    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1,
      data: '寄回成功'  
    }
  }

}

module.exports = SendbackController;
