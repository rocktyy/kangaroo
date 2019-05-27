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
    useDay: 2,
    useDayArray: [1,2,3,4,5,6,7,8,9,10,11],
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

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
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
});
