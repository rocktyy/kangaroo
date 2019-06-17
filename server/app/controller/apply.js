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
      alipay_user_id : userId || 'userId',
    }
 
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
      logger.error('INSERT info err>>>>> ', e); 
      this.ctx.body = {
        success: false,
        data: '手机号已经存在，提交过申请'  
      }
      return;
    }
  }

  async searchApplyInfo(activity_id, telphoneNum = '') {
    const { logger } = this.ctx;
    const dataInfo = await this.app.mysql.select('apply_info', {
      where: { 
        activity_id: activity_id,
        telphone_num: telphoneNum || '',
      }
    });
    logger.info('searchApplyInfo: ', dataInfo);
    return dataInfo
  }
 
  async initApplyInfo() {
    // 从url的query中取得userId
    var { activity_id, userId, telphoneNum } = this.ctx.request.body;
    console.log("activity_id", activity_id);
    console.log("telphoneNum", telphoneNum);
    if(!telphoneNum){
      this.ctx.body = {
        success: false,
        data: '服务正忙，请稍后再试'  
      }
      return; 
    }
    const dataInfo = await this.searchApplyInfo(activity_id, telphoneNum);
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
      apply: result,
      data: result.apply_status,
    };
  }

  /**
   * 查询申请表单信息
   */
  async findApplyInfo() {
    // 从url的query中取得userId
    var { activity_id, userId, telphoneNum } = this.ctx.request.body;
    const dataInfo = await this.searchApplyInfo(activity_id, telphoneNum);
    const result = dataInfo && dataInfo[0] || {};
    if(dataInfo.length === 0){
      this.ctx.body = {
        success: false,
        hasApplyInfo: false,
        data: '服务正忙，稍后再试'  
      }
      return;
    }

    // 将todo项写入消息体，返回给前端
    this.ctx.body = {
      success: true,
      hasApplyInfo: true,
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
