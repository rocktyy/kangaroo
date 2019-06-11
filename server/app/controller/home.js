'use strict';
const Controller = require('egg').Controller;
class HomeController extends Controller {
 
  /**
   * 查询订单接口，查询申请单数量
   */
  async searchApplyCount(){
    const record = await this.app.mysql.query(
      'SELECT COUNT(*) as ? FROM `apply_info` WHERE `apply_status` = ?',
      ['count', 1]
    );
    const applyCount = record && record[0] || 0;
    return applyCount.count;
  }

  /**
   * index:首页初始化查询接口
   */
  async index() {
    const { logger } = this.ctx;
    const { activityId } = this.ctx.request.query;
    // 库存 第一天50，第二天50，第三天放开，总：200
    const record = await this.app.mysql.select('activity_info', {
      where: { activity_id: activityId } } );
    // 获取申请单的个数 
    const count = await this.searchApplyCount();
    const result = record && record[0] || {};
    const maxCount = result.max_count || 50;
    const startDate = result.start_date || '2019/6/01 8:00';
    const urlRange = result.url_range || 'https://xiaochengxu.autovideogroup.com';
    const activityStatus  = result.activity_status;
    logger.info('home index:  activity_id= ', activityId); 

    if(!result){
      // 查询失败或者无数据
      this.ctx.body = {
        success: false,
        data: 'system error:'
      };
      return;
    }

    this.ctx.body = {
      success: true,
      urlRange,
      count: count,
      startDate,
      maxCount : maxCount,
      activityStatus,
      data: 'Hello! stock info:' + count,
    };
  }
  
  async hello() {
    this.ctx.body = {
      success: true,
      data: 'hello~ small app!',
    };
  }

}

module.exports = HomeController;
