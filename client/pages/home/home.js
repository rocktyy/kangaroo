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
    // console.log(e.detail.value);
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
    console.log(this.data);
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
})

