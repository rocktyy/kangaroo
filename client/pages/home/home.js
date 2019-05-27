const app = getApp();

Page({
  data: {
    agreementCheck: false,
    modalOpened:false,
    background: ['green', 'red', 'yellow'],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    applyButton:'申请安全座椅',
    returnButton:'退还安全座椅',
    authorizeButton:'点击授权使用芝麻信用分',
  },

  onLoad() {
    app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
        app.userInfo = user;
      },
      () => {
        // 获取用户信息失败
        console.log("获取用户信息失败");
      }
    );
  },
  openModal() {
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
      url: '../webview/webview'
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
      url: '../webview/webview'
    })
  },
})

