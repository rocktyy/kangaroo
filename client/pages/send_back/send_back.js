const app = getApp();
var CountDown = require('../../common/sms/countdown.js');
var sendSms = require('../../common/sms/sendSms');
const sendInfo = {
  name: '寄件人姓名',
  telphone_num: '手机号码',
  user_address: '寄件人地址',
  express_type: '快递公司',
  express_num: '运单号'
}

Page({
  data: {
    index: 0,
    form: {
      name:{
        placeholder: '申请座椅回寄时填写',
        value: '',
      },
      telphone_num: {
        value: '',
      },
      user_address: {
        value: '',
      },
      express_type: {
        value: 0,
      },
      express_num: {
        value: '',
      }
    },
    mobile: '',
    submitStatus: 'apply',
    disabled: false,
    smsText :'验证码：',
    array: ['顺丰', '申通', '韵达', '其他'],
    sendAddress: {
      title: '座椅回收信息（运费由袋鼠行动支付，快递时请选择到付）',
      reviveAtuor: '收件人：陆斯恩',
      tel: '电话：  0371-66687776',
      address: '快递地址：河南省郑州市金水区农业路东62号苏荷中心',
    },
    submitText: '提交',
    footerTitle: '感谢您的支持与使用！',
    footerContent: `欢迎将宝宝使用的安全椅的照片发布到微博@汽车洋葱圈
      和我们一起长高更多的用户关注儿童汽车出行安全`,
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this.countdown = new CountDown(this);
    this.initPage();
  },

  getMobile(){
    var mobile = my.getStorageSync({key: 'sms_mobile'}).data + "";
    return mobile;
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },

  //手机号输入
  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    })
  },

  

  initPage(){

    console.log(this.getMobile());

    var that =this,
     mobile = this.getMobile(),
     activity_id = app.activityId,
     param = {
       mobile,
       activity_id
     };

    this.getInfo(param).then(res=>{
      if(res.success){
        that.setData({
          disabled: true,
          submitStatus: 'completed',
          submitText: '申请修改',
          form: {
            name:{
              value: res.data.name,
            },
            telphone_num: {
              value: res.data['telphone_num'],
            },
            user_address: {
              value: res.data['user_address'],
            },
            express_type: {
              value: res.data['express_type'],
            },
            express_num: {
              value: res.data['express_num'],
            }
          }
        });
      }else{
        // 新建回寄订单
        console.log('请求失败，请重试');
      }
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
    // 查询手机号是否存在订单
    let param = {
      telphoneNum: mobile,
      activity_id: app.activityId,
    }; 
    const hasPhoneNum = this.searchApplyChair(param).then(res=>{
      if(res.data.success){
        return true;
      }else{
        my.showToast({
          content: "系统繁忙，请重试",
        });
        return false;
      }
    }); 
    if(!hasPhoneNum){
      my.showToast({
        type: 'none',
        content: '很抱歉，此号码无效，请核对您填写申领的号码信息，稍后再试',
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
          content: sendInfo[val]+ "-不能为空",
        });
        // 优化设置focus
        return false;
      } else if (val === 'telphone_num' && !(/^1(3|4|5|7|8)\d{9}$/.test(detail[val]))){
          my.showToast({
            type: 'none',
            content: '请输入正确的手机号码',
            duration: 2000,
          });
          return false;
      } else {
        continue;
      }
    }
    return true;
  },

  formSubmit(e) {
    var that =this;
    if(!this.valueCheck(e.detail.value)){
      return;
    }
 
    let param = {
      ...e.detail.value,
      express_type: this.data.index,
      alipay_user_id: app.userInfo && app.userInfo.userId || '',
    }
    this.addSendBackInfo(param).then(res=>{
      if(res.success){
        my.alert({
          title: "回寄已经成功",
          content: res.data
        });
        that.setData({
          disabled: true,
          submitStatus: 'completed',
        });
      }else{
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    }); 
  },

  // 写入数据库obj，当前用户增加一条todo
  addSendBackInfo(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/sendBack/add', 
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

  // 写入数据库obj，当前用户增加一条todo
  getInfo(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/sendBack/init', 
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

  // 查询手机号对应的申请订单
  searchApplyChair(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/apply/findApply', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },

});
