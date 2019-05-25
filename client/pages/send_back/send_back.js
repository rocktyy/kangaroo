const app = getApp();

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
    disabled: false,
    array: ['顺丰', '申通', '韵达', '其他'],
    sendAddress: {
      title: '座椅回收信息（运费由袋鼠行动支付，快递时请选择到付）',
      reviveAtuor: '收件人：陆斯恩',
      tel: '电话：  0371-66687776',
      address: '快递地址：河南省郑州市金水区农业路东62号苏荷中心',
    },
    footerTitle: '感谢您的支持与使用！',
    footerContent: `欢迎将宝宝使用的安全椅的照片发布到微博@汽车洋葱圈
      和我们一起长高更多的用户关注儿童汽车出行安全`,
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);

  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)

    var alipay_user_id = '10001';
    if (app.userInfo) {
      alipay_user_id = app.userInfo.userId;
    }
    let param = {
      ...e.detail.value,
      express_type: this.data.index,
      alipay_user_id,
    }

    console.log('param >>>>>>>', param);

    this.addTodo(param).then(res=>{
      if(res.success){
        my.alert({
          title: "回寄已经成功",
          content: res.data
        });
      }else{
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    })    
  },

  // 写入数据库obj，当前用户增加一条todo
  addTodo(obj) {
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
          console.log('Add todo fail>>>>>>>>', res)
          reject();
        }
      });
    });
  }

});
