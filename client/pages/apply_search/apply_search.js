// 请修改为您的小程序云应用的真实域名
const app = getApp();
var CountDown = require('../../common/sms/countdown.js');
var sendSms = require('../../common/sms/sendSms');
var { tradeNO } = require('../../common/trade');

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
  },
  onLoad(query) {
    this.countdown = new CountDown(this);
  },
  //手机号输入
  bindPhoneInput(e) {
    var val = e.detail.value;
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
    var query = '../agreement/agreement?from=home';
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
    my.showToast({
      content: "授权成功，提篮座椅即将发出，请注意查收",
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
    // 校验通过
    return true;
  },

  formSubmit(e) {
    const that = this;
    if(!this.valueCheck(e.detail.value)){
      return;
    }
    var activity_id = app.activityId, imgUrl = app.imgUrl,
      userId = app.userInfo && app.userInfo.userId,
      param = {
       ...e.detail.value,
       activity_id,
       userId,
    };
    this.searchApplyChair(param).then(res=>{
      if(res.success){
        my.showToast({
          content:  "查询成功！",
        });
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
          reject(res);
        }
      });
    });
  },

  // 完成支付宝预授权
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
      tradeNO: tradeNO,
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
