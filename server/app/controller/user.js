'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {

  async getUserInfo() {
    // 拿到前端传过来的auth code
    const authcode = this.ctx.request.query.authcode;
    
    // 创建AlipaySdk对象
    // !!!!!!该对象中的属性需要开发者根据自己小程序的ID和密钥修改!!!!!!
    // 小程序公钥和私钥存储在public-key.pem和private-key.pem文件中，请修改文件中的内容
    const alipaySdk = new AlipaySdk({
      appId: '2019041663891017',
      privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
      alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
    });

    // 调用alipay.system.oauth.token方法，用auth code 换取 access token
    const authMethod = 'alipay.system.oauth.token';
    const authParams = {
      grant_type: 'authorization_code',
      code: authcode,
    };
    try {
      const authResult = await alipaySdk.exec(authMethod, authParams);
      console.log('user access info>>>>>>>', authResult);

      // 调用alipay.user.info.share方法，用access token 拿到用户信息
      const userMethod = 'alipay.user.info.share';
      const userParams = {
        auth_token: authResult.accessToken,
      }
      const result = await alipaySdk.exec(userMethod, userParams);
      console.log('user info>>>>>>>', result);

      // 将用户信息写入返回的消息体中，返回给前端
      this.ctx.body = result;
    } catch (err) {
      console.log('get user info err>>>>>', err);
    }
  }

}

module.exports = UserController;
