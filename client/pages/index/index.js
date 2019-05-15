
// 请修改为您的小程序云应用的真实域名
const DOMAIN_NAME = 'app2137169189test.mapp-test.xyz';

Page({
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
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
  }
});
