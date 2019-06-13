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
