'use strict';
const Controller = require('egg').Controller; 

class SendbackController extends Controller {

  async getSendBackInfo() {
    // 从url的query中取得userId
    var { activity_id, mobile } = this.ctx.request.body;
    var dataInfo = await this.app.mysql.select('send_back_info', {
      where: { 
        telphone_num: mobile,
        activity_id,
      }
    }) || [];
    const result = dataInfo && dataInfo[0] || {};
    
    if(dataInfo.length === 0){
      this.ctx.body = {
        success: false,
        data: '服务正忙，稍后再试'  
      }
      return;
    }

    // 将todo项写入消息体，返回给前端
    this.ctx.body = {
      success: true,
      data: result,
    };
  }

  async addAccount() {
    // 从请求消息体中取得task信息
    const param = this.ctx.request.body;
    const { name, telphone_num,	user_address, express_type, express_number, alipay_user_id } = this.ctx.request.body;
    
    // 将请求中的task转化为与数据库中结构一致的格式
    const newTask = {
      ...param,
      express_status: 1,
      activity_id: 'Third_20190601',
    }
    console.log("param",newTask);
    // 向数据库插入数据
    const result = await this.app.mysql.insert('send_back_info', newTask);
    
    if(result.affectedRows !== 1){
      this.ctx.body = {
        success: false,
        data: '寄回失败，稍后再试'  
      }
      return;
    }

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: true,
      data: '寄回成功'  
    }
  }

}

module.exports = SendbackController;
