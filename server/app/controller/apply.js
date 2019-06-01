'use strict';
const Controller = require('egg').Controller; 

class ApplyController extends Controller {
  /**
   * 查询订单接口，查询申请单数量
   */
  async searchApplyCount(){
    const record = await this.app.mysql.query(
      'SELECT COUNT(*) as ? FROM `apply_info` WHERE `apply_status` = ?',
      ['count', 1]
    );
    const MaxRecord = await this.app.mysql.select('activity_info');
    const applyCount = record && record[0] || 0;
    const maxCount = MaxRecord && MaxRecord[0] || {};
    console.log(MaxRecord);
    console.log(this.config);

    return {
      count: applyCount.count,
      maxCount:  maxCount.max_count
    }
  }

  async addApplyChair() {
    const addParam = this.ctx.request.body;
    const { userId, activity_id } = this.ctx.request.body;
    
    // 查询申请单个数
    const { count, maxCount } = await this.searchApplyCount();
    console.log(count, maxCount)
    if( count >= maxCount){
      // 申请单超过最大申请数量 
      this.ctx.body = {
        success: false,
        data: '服务正忙，稍后再试'  
      }
      return;
    }

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
    console.log("===========insertInfo===========", newTask); 
 
    try{ 
      const dataInfo = await this.app.mysql.insert('apply_info', newTask);
      const result = dataInfo && dataInfo[0] || {};

      if(dataInfo.length === 0){
        this.ctx.body = {
          success: false,
          data: '服务正忙，稍后再试'  
        }
        return;
      }
      // 返回给前端数据库query执行结果
      this.ctx.body = {
        success: true,
        result: result,
        msg: '添加成功',
      }
    } catch(e){
      console.log('INSERT info err>>>>>', e);
      return;
    }
  }

  async searchApplyInfo(activity_id, userId) {

    var dataInfo = await this.app.mysql.select('apply_info', {
      where: { 
        alipay_user_id: userId,
        activity_id,
      }
    });
    return dataInfo
  }
 
  async initApplyInfo() {
    // 从url的query中取得userId
    var { activity_id, userId } = this.ctx.request.body;
    const dataInfo = await this.searchApplyInfo(activity_id, userId);
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
      data: result.apply_status,
    };
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
}

module.exports = ApplyController;
