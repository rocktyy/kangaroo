'use strict'; 
/**
 * ctul 请求stable机器接口
 * @author rock.tyy
 */ 

const Controller = require('egg').Controller; 

class curlService extends Controller {
  /**
   * 同步模版信息
   * @param {object} params 入参
   * @param { environment } params.environment : 执行环境
   * @param { iterationInfo } params.iterationInfo : 模版信息
   */

  async getCurlResult(params) {
    const { logger } = this.ctx;
    const methodUrl = "api/iteration/synchronizeTemplate", deployArray = {
      "dev": "http://100.67.201.7/" + methodUrl,
      "sit": "http://100.67.201.8/" + methodUrl,
    }, url = deployArray[params.environment], param = {
      method: 'POST',
      dataType: 'json',
      data: { iterationInfo: params.iterationInfo },
      headers:{
        'Accept' : 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      timeout: 3000,
    };

    // 打印请求数据
    logger.info("curl request param: ", param);

    const curlResponse  = await this.ctx.curl(url, param);
    
    if(!curlResponse.data.success){
      logger.error("getCurlResult error: ", curlResponse);
    } else {
      logger.error("getCurlResult success: ", curlResponse);
    }
    const response = Object.assign({}, curlResponse.data);

    return response;
  }
}

module.exports = curlService;
