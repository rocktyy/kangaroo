'use strict';
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const Controller = require('egg').Controller;
const fs = require('fs');
// 用于存储上传图片的目录路径，该路径对应的文件夹必须存在
// 此处设置为应用的静态资源目录，方便外界访问
const UPLOAD_DIR = 'app/public'; 
const uuid = require('uuid');
const AlipaySdk = require('alipay-sdk').default;
// 后端服务所在的域名或IP地址
// !!!!!!该变量值需要开发者根据自己小程序云应用的域名进行修改!!!!!!（需要填写代协议域名）

// eg:https://app2119791483test.mapp-test.xyz
const DEMO_DOMAIN = 'app2136429017test.mapp-test.xyz'; 

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hi, ALIPAY MINIAPP';
  }

  async sayHello() {
    const users = await this.app.mysql.select('user');
    const user = users && users[0] || {};
    this.ctx.body = {
      data: 'Hello! ' + user.name
    };
  }

  async getUserInfo() {
    // 拿到前端传过来的auth code
    const authcode = this.ctx.request.query.authcode;
    
    // 创建AlipaySdk对象
    // !!!!!!该对象中的属性需要开发者根据自己小程序的ID和密钥修改!!!!!!
    // 小程序公钥和私钥存储在public-key.pem和private-key.pem文件中，请修改文件中的内容
    const alipaySdk = new AlipaySdk({
      appId: '2019051364502296',
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

  async getTodos() {
    // 从url的query中取得userId
    var userId = this.ctx.query.userId;
    console.log('user ID in query>>>>>>>>', userId);
    var tasks; 
    if (userId) {
      // 如果前端有传userId，则向数据库请求该userId下的所有task
      tasks = await this.app.mysql.select('task', {
        where: {user_id: userId}
      });  
    } else {
      // 如果前端没有传userId，则返回数据库中所有的task
      tasks = await this.app.mysql.select('task');  
    }
    
    console.log('#################All todos', tasks);
    // 将task转换成前端所需的格式
    const todos = tasks.map(item => {return {
      text: item.label,
      completed: (item.done > 0 ? true : false),
      id: item.id,
      iconUrl: item.img_url
    }});

    // 将todo项写入消息体，返回给前端
    this.ctx.body = {
      success: true,
      todoList: todos
    };
  }

  async changeState() {
    // 从请求消息体中取得userId
    const { id } = this.ctx.request.body;
    console.log("Task ID to be changed >>>", id);

    // 访问数据库拿到task
    const chosenTask = await this.app.mysql.get('task', { id });

    // 修改task的完成状态
    // task.done在数据库中为TINYINT类型，0表示false，1表示true
    chosenTask.done = (chosenTask.done + 1) % 2;

    // 更新task状态
    const result = await this.app.mysql.update('task', chosenTask);

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async deleteTodo() {
    // 从请求消息体中取得userId
    const { id } = this.ctx.request.body;
    console.log("Task ID to be deleted >>>", id);

    // 从数据库中根据ID删除指定task
    const chosenTask = { id };
    const result = await this.app.mysql.delete('task', chosenTask);

    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async addTodo() {
    // 从请求消息体中取得task信息
    const { text, completed, iconUrl, userId } = this.ctx.request.body;
    
    // 将请求中的task转化为与数据库中结构一致的格式
    const newTask = {
      label: text,
      done: completed ? 1 : 0,
      img_url: iconUrl === '' ? null : iconUrl,
      user_id: userId
    }
    console.log("Task to be added >>>", newTask);

    // 向数据库插入数据
    const result = await this.app.mysql.insert('task', newTask);
    
    // 返回给前端数据库query执行结果
    this.ctx.body = {
      success: result.affectedRows === 1
    }
  }

  async upload() {
    // 从请求中获取文件流
    const { ctx } = this;
    console.log('upload request>>>>>>', ctx.request);
    let stream;
    try{
      stream = await ctx.getFileStream();
    }catch(e){
      console.log('getFileStream err',e)
    }
    
    console.log('stream>>>>>>>',stream)
    // 生成文件名（ UPLOAD_DIR 为存储上传图片的文件夹，该文件夹必须存在）
    var fileId = uuid.v1() + path.extname(stream.filename);
    const name = UPLOAD_DIR + '/' + fileId;
    console.log('fileId>>>>>>>',fileId)
    try {
      // 处理文件
      stream.pipe(fs.createWriteStream(name));
    } catch(err) {
      console.log('pipe error!!!!!!!!!!!', err);
      // 将上传的文件流消费掉，不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }

    // 返回上传图片的访问地址，DEMO_DOMAIN 为云应用域名
    ctx.body = {
      imgUrl: DEMO_DOMAIN +'/public/' + fileId,
    };
  }

}

module.exports = HomeController;
