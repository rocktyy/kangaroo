
// 请修改为您的小程序云应用的真实域名
const DOMAIN_NAME = 'app2137169189test.mapp-test.xyz';

Page({
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  submit() {
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
  uploadImg() {
    var query = '../upload_img/upload_img?biz=apply';
    my.navigateTo({
      url: query
    })
  },
});
