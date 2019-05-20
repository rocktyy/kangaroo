const app = getApp();

Page({
  data: {
    background: ['green', 'red', 'yellow'],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    applyButton:'申请安全座椅',
    returnButton:'退还安全座椅',
  },

  onLoad() {
    app.getUserInfo().then(
      user => {
        this.getTodoList().then(res=>{
          this.setData({ todos: res.todoList });
        })
      },
      () => {
        // 获取用户信息失败
        console.log("获取用户信息失败");
      }
    );
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  sayHello() {
    console.log(my.canIUse('favorite'))
    my.httpRequest({
      url: `https://${DOMAIN_NAME}/say-hello`,
      success: (res) => {
        my.alert({
          title: "来自云服务的问候",
          content: res.data.data
        });
        //小程序自定义埋点用法，详见 https://docs.alipay.com/mini/api/report
        my.reportAnalytics('miniDemo', {
          demoName: 'simple-node',
          res: res
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
  sendBack() {
    var query = '../agreement/agreement?biz=home';
    my.navigateTo({
      url: query
    })
    my.alert({
      content: JSON.stringify(query),
    });
  },
})

