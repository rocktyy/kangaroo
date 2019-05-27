const app = getApp();

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
    submitStatus: 'apply',
    disabled: false,
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
    this.initPage();
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },

  initPage(){
    var that =this,
     userId = app.userInfo && app.userInfo.userId || '10001',
     activity_id = app.activityId,
     param = {
       userId,
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

    var alipay_user_id = '10001';
    if (app.userInfo) {
      alipay_user_id = app.userInfo.userId;
    }
    let param = {
      ...e.detail.value,
      express_type: this.data.index,
      alipay_user_id,
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
  }

});
