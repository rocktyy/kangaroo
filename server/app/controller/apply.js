'use strict';
const Controller = require('egg').Controller; 

class ApplyController extends Controller {

  async addApplyChair() {
    const addParam = this.ctx.request.body;
    const { userId, activity_id } = this.ctx.request.body;

    const param = {
      apply_id: userId + '_' + activity_id,
      activity_id,
      name: addParam.name,
      wechat_id: addParam.wechat_id,
      telphone_num: addParam.telphone_num,
      sms_num: addParam.sms_num,
      address: addParam.address,
      id_card: addParam.id_card,
      child_name: addParam.child_name,
      child_age: addParam.child_age,
      use_last_day: addParam.use_last_day,
      birth_certificate: addParam.birth_certificate,
      apply_status: 1,
    }

    const newTask = {
      ...param,
      alipay_user_id: userId
    }
    // 向数据库插入数据
    const dataInfo = await this.app.mysql.insert('apply_info', newTask);
    const result = dataInfo && dataInfo[0] || {};
    if(Object.keys(result).length === 0){
      this.ctx.body = {
        success: false,
        data: '服务正忙，稍后再试'  
      }
      return;
    }

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: true,
      data: '添加成功',
    }
  }

  async changeState() {
    // 从请求消息体中取得userId
    const { id } = this.ctx.request.body;
    console.log("Task ID to be changed >>>", id);
    // 访问数据库拿到task
    const chosenTask = await this.app.mysql.get('apply_info', { id });
    // task.done在数据库中为TINYINT类型，0表示false，1表示true
    chosenTask.done = (chosenTask.done + 1) % 2;
    // 更新task状态
    const result = await this.app.mysql.update('apply_info', chosenTask);
    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }
  
  async initApplyInfo() {
    // 从url的query中取得userId
    var { activity_id, userId } = this.ctx.request.body;
    console.log(activity_id, userId);
    var dataInfo = await this.app.mysql.select('apply_info', {
      where: { 
        alipay_user_id: userId,
        activity_id,
      }
    });
    const result = dataInfo && dataInfo[0] || {};
    console.log(result);

    if(Object.keys(result).length === 0){
      this.ctx.body = {
        success: false,
        data: '服务正忙，稍后再试'  
      }
      return;
    }

    // 将todo项写入消息体，返回给前端
    this.ctx.body = {
      success: true,
      data: result.apply_status,
    };
  }
}

module.exports = ApplyController;
