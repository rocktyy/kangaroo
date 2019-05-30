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
  },

  onModalClick() {
    this.setData({
      modalOpened: false,
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

