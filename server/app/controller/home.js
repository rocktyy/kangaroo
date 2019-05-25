'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {

  /**
   * 查询订单接口，查询申请单数量
   */
  async searchApplyCount(){
    const record = await this.app.mysql.query(
      'SELECT COUNT(*) as ? FROM `apply_info` WHERE `apply_status` = ?',
      ['count', 0]
    );
    const applyCount = record && record[0] || 0;
    return applyCount.count;
  }

  async index() {
    // 库存 第一天50，第二天50，第三天放开，总：200
    const record = await this.app.mysql.select('activity_info', {
      where: { activity_id: 'kangaroo_action_third_20190601' } } );
    
    // 获取申请单的个数 
    const count = await this.searchApplyCount();
    const result = record && record[0] || {};

    if(!result){
      // 查询失败或者无数据
      this.ctx.body = {
        success: false,
        count: count,
        data: 'system error:'
      };
    }

    this.ctx.body = {
      success: true,
      count: count,
      data: 'Hello! stock info:' + result.stock,
    };
  }

}

module.exports = HomeController;
