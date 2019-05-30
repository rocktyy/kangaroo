'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const AlipaySdk = require('alipay-sdk').default;

class OrderController extends Controller {

  /**
   * 获取微信统一下单参数
   */
  getUnifiedorderXmlParams(obj){
    var body = '<xml> ' +
      '<appid>'+config.wxappid+'</appid> ' +
      '<body>'+obj.body+'</body> ' +
      '<mch_id>'+config.mch_id+'</mch_id> ' +
      '<nonce_str>'+obj.nonce_str+'</nonce_str> ' +
      '<notify_url>'+obj.notify_url+'</notify_url>' +
      '<openid>'+obj.openid+'</openid> ' +
      '<out_trade_no>'+obj.out_trade_no+'</out_trade_no>'+
      '<spbill_create_ip>'+obj.spbill_create_ip+'</spbill_create_ip> ' +
      '<total_fee>'+obj.total_fee+'</total_fee> ' +
      '<trade_type>'+obj.trade_type+'</trade_type> ' +
      '<sign>'+obj.sign+'</sign> ' +
      '</xml>';
      return body;
  }

  GetDateNow(){
    var sNow = '',vNow = new Date();
    sNow += String(vNow.getFullYear());
    sNow += String(vNow.getMonth() + 1);
    sNow += String(vNow.getDate());
    sNow += String(vNow.getHours());
    sNow += String(vNow.getMinutes());
    sNow += String(vNow.getSeconds());
    sNow += String(vNow.getMilliseconds());
    return sNow;
  }
  

  async getTradeNo(activityId, userId) {
    // 拿到前端传过来的auth code
    var { userId } = this.ctx.request.body;
    
    // 创建AlipaySdk对象
    // !!!!!!该对象中的属性需要开发者根据自己小程序的ID和密钥修改!!!!!!
    // 小程序公钥和私钥存储在public-key.pem和private-key.pem文件中，请修改文件中的内容
    const alipaySdk = new AlipaySdk({
      appId: '2019051364502296',
      privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
      alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
    });

    let orderId = this.GetDateNow();
 
    try { 
      // 调用alipay.user.info.share方法，用access token 拿到用户信息
      const userMethod = 'alipay.fund.auth.order.app.freeze';
      const userParams = {
        notifyUrl: 'http://app2138419400test.mapp-test.xyz',
        bizContent: {
          productCode: "PRE_AUTH_ONLINE",
          orderTitle: "支付宝资金授权",
          outOrderNo: orderId,
          outRequestNo: orderId,
          amount: "0.02",
          payeeUserId: "2088721126886588",
          //需要支持信用授权，该字段必传
          extraParam: {
            "category": "RENT_CAR_GOODS",
          }
        }
      }

      console.log("userParams", userParams);
      const result = await alipaySdk.exec(userMethod, userParams);

      // 将用户信息写入返回的消息体中，返回给前端
      this.ctx.body = result;
    } catch (err) {
      console.log('get user info err>>>>>', err);
    }
  }

  async freeTradeNo(activityId, userId) {
    // 支付宝订单解冻
  }
  
}

module.exports = OrderController;
