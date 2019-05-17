'use strict';
const Controller = require('egg').Controller;
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
// 用于存储上传图片的目录路径，该路径对应的文件夹必须存在
// 此处设置为应用的静态资源目录，方便外界访问
const UPLOAD_DIR = 'app/public'; 
const uuid = require('uuid');

// eg:https://app2119791483test.mapp-test.xyz
const DEMO_DOMAIN = 'app2136429017test.mapp-test.xyz'; 

class FileController extends Controller {

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

module.exports = FileController;
