'use strict';
const Controller = require('egg').Controller;

const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
// 用于存储上传图片的目录路径，该路径对应的文件夹必须存在
// 此处设置为应用的静态资源目录，方便外界访问
const UPLOAD_DIR  = 'app/public'; 

const DEMO_DOMAIN = 'https://kangaroo.kangarooaaction.com';

class FileController extends Controller {

  async upload() {
    // 从请求中获取文件流
    const { ctx } = this;
    let stream;
    try{
      stream = await ctx.getFileStream();
    }catch(e){
      console.log('getFileStream err',e)
    }
    // 生成文件名（ UPLOAD_DIR 为存储上传图片的文件夹，该文件夹必须存在）
    var fileId = uuid.v1() + path.extname(stream.filename);
    const name = UPLOAD_DIR + '/' + fileId;
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
      success: true,
      statusCode: 200,
      data: {
        imgUrl: DEMO_DOMAIN +'/public/' + fileId,
      },
      errMsg: 'uploadFile:ok',
    };
  }

}

module.exports = FileController;
