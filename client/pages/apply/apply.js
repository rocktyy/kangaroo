// 请修改为您的小程序云应用的真实域名
const app = getApp();
var CountDown = require('../../common/sms/countdown.js');
var sendSms = require('../../common/sms/sendSms');

const applyInfo = {
  name: '姓名',
  wechat_id: '微信号',
  telphone_num: '手机号码',
  sms_num: '验证码',
  address: '收货地址',
  id_card: '身份证号',
  child_name: '宝宝姓名',
  child_age: '宝宝年龄',
  use_last_day: '预计时长',
  birth_certificate: '宝宝出生证明',
}

Page({
  data: {
    mobile: '',
    applyStatus: 0,
    birthCertificate:'',
    btnText: '点击上传',
    babyAge: 0,
    babyAgeArray: [1,2,3],
    useDay: 2,
    useDayArray: [1,2,3,4,5,6,7,8,9],
  },
  onLoad(query) {
    this.countdown = new CountDown(this);
    this.initPage();
  },
  onShow() {
    // 页面加载
    if(app.imgUrl && !this.data.birthCertificate){
      this.setData({
        birthCertificate: app.imgUrl,
        btnText: '已上传，修改...',
      });
    }
  },

  initPage(){
    var that =this,
     userId = app.userInfo && app.userInfo.userId || '10002',
     activity_id = app.activityId,
     param = {
       userId,
       activity_id
     };

    this.getApplyInfo(param).then(res=>{
      if(res.success){
        // 有数据，非第一申领 
        that.setData({
          applyStatus: res.data,
        });
      }
    }); 
  },

  //手机号输入
  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    })
  },

  bindBabyPickerChange(e) {
    this.setData({
      babyAge: e.detail.value,
    });
  },

  bindPickerChange(e) {
    this.setData({
      useDay: e.detail.value,
    });
  },
  

  getSmsCaptcha(e) {
    var that = this;
    var mobile = that.data.mobile;
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

    var smsNum = my.getStorageSync({key: 'sms_core'}).data;
    if(!smsNum) {
      my.showToast({
        content: "请填写正确的验证码信息",
      });
      return false;
    }
    if(!sendSms.client.validateCode(detail.sms_num)) {
        my.showToast({
          content: "验证码信息错误！",
        });
      return false;
    }
    // 校验通过
    return true;
  },

  formSubmit(e) {
    const that = this;
    if(!this.valueCheck(e.detail.value)){
      return;
    }

    var userId = app.userInfo && app.userInfo.userId || '10002',
     activity_id = app.activityId,
     imgUrl = app.imgUrl,
     param = {
       ...e.detail.value,
       child_age: this.data.babyAge + 1,
       use_last_day: this.data.useDay + 1,
       birth_certificate: imgUrl,
       activity_id,
       userId,
     };

    this.applyChair(param).then(res=>{
      if(res.success){
        my.showToast({
          content:  "申请座椅成功！",
        });
        that.setData({
          applyStatus: 1,
        });
      } else {
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    }); 
  },

  // 写入数据库obj，当前用户增加一条todo
  applyChair(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/apply/add', 
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

  // 写入数据库obj，当前用户增加一条todo
  getApplyInfo(obj) {
    var theDemoDomain = app.demoDomain;
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
          reject();
        }
      });
    });
  },

  uploadImg() {
    // 跳转上传图片页面
    var query = '../upload_img/upload_img?from=apply';
    my.navigateTo({
      url: query
    })
  },

  // 完成预授权服务
  submitAppFreeze() {
    // 待开发
  },


  appFreeze(){
    let param = {
      userId : app.userInfo || '2088302207659350',
    }
    //调用 获取订单ID
    this.getFreeOrder(param).then(res=>{
      if(res.success){
        // 生成支付宝统一订单
        that.setData({
          orderNo: res.data.orderNo,
        });
      }
    }); 
  },

  getFreeOrder(param) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
       my.request({
        url: theDemoDomain+'/order/getTradeNo', 
        method: 'POST',
        data: param,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject();
        }
      });
    });
  },

  tradePay(){
    /* 
      * 支付宝生成订单： myOrderStr
      * alipay_sdk=alipay-sdk-java-3.7.73.ALL&app_id=2019051364502296
      * &biz_content=%7B%22amount%22%3A%220.02%22%2C%22extra_param%22%3A%22%7B%5C%22category%5C%22%3A%5C%22RENT_CAR_GOODS%5C%22%7D%22%2C%22o
      * rder_title%22%3A%22%E6%94%AF%E4%BB%98%E5%AE%9D%E8%B5%84%E9%87%91%E6%8E%88%E6%9D%83%22%2C%22
      * out_order_no%22%3A%221559187476230%22%2C%22out_request_no%22%3A%221559187476230%22%2C%22
      * payee_user_id%22%3A%222088721126886588%22%2C%22product_code%22%3A%22PRE_AUTH_ONLINE%22%7D
      * &charset=utf-8&format=json&method=alipay.fund.auth.order.app.freeze
      * &notify_url=http%3A%2F%2Fapp2138419400test.mapp-test.xyz
      * &sign=x%2BgI7f9CFnBq9Xvce9ywUVpRetM5OSxlyb49f%2FK1gK5UCKEZYefSvdyIVWoGgO7R3%2FCyhfXHlzZkaq4RfnUgaJLGpkfScbFxVv1nO60snEj9kcWcAQI%2FySdAYv6EUnoj9woJlSnNLlR0aOmMG45oNNB51bq770CfEYap%2FRINS8DjRft0sqG5bMHRHmKetJOWBksUabjI1RcoL0M16I9eZxOYd63YPIAWVdK0yIFH89GhahmcAapud9KO3HZlmgbtYvtjn3Ugb5HGKRb%2BKuOObn1gv%2BbW%2F2va8Ozrl4vEjEsQ0rSIJWyHJfNIHaP4ZDjlZoOlA2IAQHCph2nm9cfFmA%3D%3D
      * &sign_type=RSA2&timestamp=2019-05-30+11%3A37%3A56&version=1.0',
     */
    my.tradePay({ 
      tradeNO: 'myOrderStr',
      success: (res) => { 
        my.alert({
          title:'成功',
          content: JSON.stringify(res),
        });
      },
      fail: (res) => {
        my.alert({
          title:'失败',
          content: JSON.stringify(res),
        });
      }
    });
  },
});
