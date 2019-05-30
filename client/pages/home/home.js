const app = getApp();

Page({
  data: {
    agreementCheck: false,
    modalOpened:false,
    background: ['green', 'red', 'yellow'],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    count: 0,
    maxCount: 50,
    urlRange: '',
    applyStatus: 0, //0未申请 1为申请
    applyButton:'申请安全座椅',
    returnButton:'退还安全座椅',
    authorizeButton:'点击授权使用芝麻信用分',
  },

  onShow() {
    // 页面加载
    let user = app.userInfo && app.userInfo.userId;
    if(user){
      // 首页初始化
      this.pageInit(user);
    }
  },

  onLoad() {
    // 初始化userId
    app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
        app.userInfo = user;
        // 首页初始化
        this.pageInit(user.userId);
      },
      () => {
        // 新建回寄订单
        my.showToast({
          content: "获取用户信息失败，请重试",
        });
      }
    );
  },

  pageInit(user){
    var that =this,
      activityId = app.activityId,
      param = {
        userId: user,
        activityId
      };
    // 初始化首页的 数据
    this.getHomeInint(param).then(res=>{
      if(res.success){
        console.log(res);
        that.setData({
          count: res.count, 
          maxCount: res.maxCount,
          urlRange: res.urlRange,
          applyStatus : res.applyInfo && res.applyInfo.applyStatus || 0,
        });
        console.log(res.startDate)
        app.startDate = res.startDate;
        
      }else{
        // 新建回寄订单
        my.showToast({
          content: "系统繁忙，请重试",
        });
      }
    }); 
  },

  compareDate(){
    console.log(app.startDate)
    let startDate = app.startDate;
    let d1Timestamp = Date.parse(new Date());
    let d2Timestamp = Date.parse(new Date(Date.parse(startDate)));
    console.log(d1Timestamp,d2Timestamp);
    return !!(d1Timestamp>d2Timestamp);
  },

  activityCheck(count){
    if(!this.compareDate()){
      my.alert({
        title: '活动提示',
        content: '袋鼠行动将于2019年6月1日8点开始哦！ (6月1日-6月4日每日限量申请50台座椅，先到先得）',
        buttonText: '我知道了',
        success: () => {
        },
      });
      return false;
    }
    // console.log(this.data.count , this.data.maxCount)
    if(this.data.count > this.data.maxCount){
      my.alert({
        title: '活动提示',
        content: '今日安全座椅已全部申领完毕，明日早八点将再次开放申请。',
        buttonText: '我知道了',
        success: () => {
          // 数据埋点
        },
      });
      return false;
    }
    return true;
  },

  openModal() {
    if(!this.activityCheck()){
      return;
    }
    this.setData({
      modalOpened: true,
    });

    // this.appFreeze();
    // this.tradePay();
  },

  onModalClick() {
    this.setData({
      modalOpened: false,
    });
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
    my.tradePay({
      tradeNO: 'alipay_sdk=alipay-sdk-java-3.7.73.ALL&app_id=2019051364502296&biz_content=%7B%22amount%22%3A%220.02%22%2C%22extra_param%22%3A%22%7B%5C%22category%5C%22%3A%5C%22RENT_CAR_GOODS%5C%22%7D%22%2C%22order_title%22%3A%22%E6%94%AF%E4%BB%98%E5%AE%9D%E8%B5%84%E9%87%91%E6%8E%88%E6%9D%83%22%2C%22out_order_no%22%3A%221559187476230%22%2C%22out_request_no%22%3A%221559187476230%22%2C%22payee_user_id%22%3A%222088721126886588%22%2C%22product_code%22%3A%22PRE_AUTH_ONLINE%22%7D&charset=utf-8&format=json&method=alipay.fund.auth.order.app.freeze&notify_url=http%3A%2F%2Fapp2138419400test.mapp-test.xyz&sign=x%2BgI7f9CFnBq9Xvce9ywUVpRetM5OSxlyb49f%2FK1gK5UCKEZYefSvdyIVWoGgO7R3%2FCyhfXHlzZkaq4RfnUgaJLGpkfScbFxVv1nO60snEj9kcWcAQI%2FySdAYv6EUnoj9woJlSnNLlR0aOmMG45oNNB51bq770CfEYap%2FRINS8DjRft0sqG5bMHRHmKetJOWBksUabjI1RcoL0M16I9eZxOYd63YPIAWVdK0yIFH89GhahmcAapud9KO3HZlmgbtYvtjn3Ugb5HGKRb%2BKuOObn1gv%2BbW%2F2va8Ozrl4vEjEsQ0rSIJWyHJfNIHaP4ZDjlZoOlA2IAQHCph2nm9cfFmA%3D%3D&sign_type=RSA2&timestamp=2019-05-30+11%3A37%3A56&version=1.0', 
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

  radioChange(e) {
    this.setData({
      agreementCheck: true,
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  sendBack() {
    var query = '../send_back/send_back?from=home';
    my.navigateTo({
      url: query
    })
  },
  linkAgreement() {
    var query = '../agreement/agreement?from=home';
    my.navigateTo({
      url: query
    })
  },

  onAuthorize() {
    let that = this;
    let agreementCheck = this.data.agreementCheck;
    if(!agreementCheck){
      my.showToast({
        content: "请同意袋鼠行动协议",
      });
      return;
    }
    my.showToast({
      content: "签约支付宝预授权协议",
    });

    that.onModalClick();
    setTimeout(function(){
      // 跳转 申请单页面
      var query = '../apply/apply?biz=home';
      my.navigateTo({
        url: query
      })
    },1000)
  },
  imgClick(event){
    // 图片点击，视频播放
    my.navigateTo({
      url: '../webview/webview?videoUrl='+this.data.urlRange+'/video1.html'
    })
  },

  tradePay(){
    my.tradePay({
      orderStr: 'myOrderStr', //完整的支付参数拼接成的字符串，从服务端获取
      success: (res) => {
        my.alert({
        content: JSON.stringify(res),
      });
      },
      fail: (res) => {
        my.alert({
        content: JSON.stringify(res),
      });
      }
    });
  },

  getHomeInint(param) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/home?activityId='+param.activityId+'&userId='+param.userId,
        success: (res) => {
          console.log(res)
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },

  sayHello() {
    var theDemoDomain = app.demoDomain;
    my.request({
      url: theDemoDomain+'/hello', 
      success: (res) => {
        my.alert({
          title: "来自云服务的问候",
          content: res.data.data
        });
      },
      fail: (err) => {
        my.alert({
          title: "错误信息",
          content: JSON.stringify(err)
        })
      }
    });
  },

  secondImgClick(event){
    // 图片点击，视频播放
    my.navigateTo({
      url: '../webview/webview?videoUrl='+this.data.urlRange+'/video2.html'
    })
  },
})

