'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const AlipaySdk = require('alipay-sdk').default;
const order = require('../common/orderStr');

class OrderController extends Controller {
  getOrder(mobile) {
    return new Promise((resolve, reject) => { 
      var exec = require('child_process').exec;
      var exec_path = "java -jar jar/test.jar  " + mobile;
      var data, child;
      child = exec(exec_path, function (error, stdout, stderr){  
        if(error !== null){
          reject("error");
        }
        stdout = stdout.replace(/↵/g,"<br/>");
        let startIndex = stdout.indexOf('alipay_sdk');
        let lastIndex = stdout.indexOf('","success');
        let orderStr = stdout.substring(startIndex, lastIndex);
        resolve(orderStr);
      });
    });
  }

  async getOrderStr(){
    const { logger } = this.ctx;
    const { mobile } = this.ctx.request.body;
    const that = this;
    const result = await this.getOrder(mobile); 
    if(result === 'error'){
      that.ctx.body = {
        success: false, 
        data: '系统异常，请稍后再试',
      };
      return;
    }

    that.ctx.body = {
      success: true, 
      orderStr: result,
      data: '成功',
    }; 
  }

  /**
   * 冻结用户金额
   */
  async freezeAmount(){
    /*
     * 完成预授权，将用户订单状态修改 ，apply_status修改成
     * 5.预授权支付完成 6.预授权支付失败
    */
    const { logger } = this.ctx;
    const { telphoneNum, freezeResult, activityId, data } = this.ctx.request.body;
    console.log(data);
    const applyStatus =  freezeResult ? 5: 6;
    logger.info('param : telphoneNum || applyStatus ', telphoneNum, applyStatus);
    try {
      const result =  await this.app.mysql.query(
        'UPDATE `apply_info` SET apply_status = ? WHERE telphone_num = ?', 
        [applyStatus, telphoneNum])
      const updateSuccess = result.affectedRows === 1;
      logger.info('update apply_info:  ', result);

      const newTask = {
        order_id: data.auth_no,
        activity_id: activityId,
        out_request_no: data.out_request_no || '',
        telphone_num: telphoneNum,
        extend_param: JSON.stringify(data),
        order_status: 1
      }
      const dataInfo = await this.app.mysql.insert('order_info', newTask);

      this.ctx.body = {
        success: result.affectedRows === 1 && dataInfo.affectedRows === 1, 
        data: '状态修改成功',
      };
    } catch (err) { 
        logger.error('update apply_info:  ', err); 
        this.ctx.body = {
          success: false, 
          data: '系统异常，请稍后再试',
        };
    }
  }
}

module.exports = OrderController;
