// 请修改为您的小程序云应用的真实域名
const app = getApp();
let CountDown = require('../../common/sms/countdown.js');
let sendSms = require('../../common/sms/sendSms');
const applyInfo = { 
  telphoneNum: '手机号码',
}

Page({
  data: {
    mobile: '',
    applyStatus: 0,
    smsText :'验证码：',
    btnText: '申请查询',
    agreementCheck: false,
    orderStr: '',
  },
  onLoad(query) {
    this.countdown = new CountDown(this);
  },
  //手机号输入
  bindPhoneInput(e) {
    let val = e.detail.value;
    this.setData({
      mobile: val
    })
  },
  
  radioChange(e) {
    this.setData({
      agreementCheck: true,
    });
  },

  linkAgreement() {
    let query = '../agreement/agreement?from=home';
    my.navigateTo({
      url: query
    })
  },

  submitAppFreeze() {
    let that = this;
    let agreementCheck = that.data.agreementCheck;
    if(!agreementCheck){
      my.showToast({
        content: "请同意袋鼠行动协议",
      });
      return;
    }
    let order;
    // 获取支付参数 
    const orderStr = this.getOrderStr().then(res=>{
      if(res.success){
        order = res.orderStr;
        console.log("order" ,order);
        // 调用支付
        that.tradePay(order).then(res=>{
          console.log("tradePay: res",res);
          let result = res.result &&  JSON.parse(res.result) || {};
          let data = result && result.alipay_fund_auth_order_app_freeze_response || {};
          if(res.resultCode === '6001'){
            my.showToast({
              content: "用户主动，取消授权",
            });
            return;
          }
          if(data.code === '10000'){
            that.updateRecord(true, data);
          } else if(data.code === '20000'){
            that.updateRecord(false);
            my.showToast({
              content: "授权失败",
            });
          }
        });
      } else { 
       return '';
      }
    });
  },

  updateRecord(freezeResult, data){
    let param = {
      activityId: app.activityId,
      telphoneNum: this.data.mobile,
      freezeResult: freezeResult,
      data: data,
    }, that = this;
    console.log("param", param);

    this.freezeAmount(param).then(res=>{
      if(res.success){
        my.showToast({
          content: "授权成功，提篮座椅即将发出，请注意查收",
        });
        that.refreshPage(param);
      } else {
        my.showToast({
          content: "服务正忙，稍后再试",
        });
      }
    }); 
  },

  // 写入数据库obj，当前用户增加一条todo
  freezeAmount(obj) {
    let theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/order/freezeAmount', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },

  getSmsCaptcha(e) {
    let that = this;
    let mobile = that.data.mobile;
    if(mobile == '' || !(/^1(3|4|5|7|8)\d{9}$/.test(mobile))){
      my.showToast({
        type: 'none',
        content: '请输入正确的手机号码',
        duration: 3000,
      });
      return ;
    }
    that.countdown.start();
    sendSms.client.sendCode(mobile);
  },

  valueCheck(detail) {
    // 表单不合法校验
    let arr =Object.keys(detail), aaLength = arr.length;
    for(let i=0; i< aaLength; i++){
      let val = arr[i];
      if("" === detail[val]){
        my.showToast({
          content: applyInfo[val]+ "-不能为空",
        });
        // 优化设置focus
        return false;
      } else if(val === 'telphone_num' && !(/^1(3|4|5|7|8)\d{9}$/.test(detail[val]))){
        my.showToast({
          type: 'none',
          content: '请输入正确的手机号码',
          duration: 2000,
        });
        return false;
      } else{
        continue;
      }
    }
    // 校验通过
    return true;
  },

  formSubmit(e) {
    const that = this;
    if(!this.valueCheck(e.detail.value)){
      return;
    }
    let option = {
       ...e.detail.value,
    };
    that.refreshPage(option);
  },

  refreshPage(option){
    const that = this;
    let param = {
       activity_id: app.activityId || '',
       ...option,
    };
    this.searchApplyChair(param).then(res=>{
      if(res.success){
        that.setData({
          applyStatus: res.data,
          apply: res.apply
        });
      } else {
        my.showToast({
          content:'查询失败，请重试'
        })
      }
    }); 
  },

  // 写入数据库obj，当前用户增加一条todo
  searchApplyChair(obj) {
    let theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/apply/init', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },

  // 完成支付宝预授权
  tradePay(orderStr){
    let theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.tradePay({ 
        orderStr: orderStr,
        success: (res) => {
          console.log("tradePay: success",res);
          resolve(res);
        },
        fail: (res) => {
          console.log("tradePay: fail",res);
          reject(res);
        }
      });
    });
  },

  // 写入数据库obj，当前用户增加一条todo
  getOrderStr(obj) {
    let theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/order/getOrderStr', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },
});
