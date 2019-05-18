
// 请修改为您的小程序云应用的真实域名
const DOMAIN_NAME = 'app2137169189test.mapp-test.xyz';

Page({
  data: {
    index: 0,
    array: ['顺丰', '申通', '韵达', '其他'],
    footerTitle: '感谢您的支持与使用！',
    footerContent: `欢迎将宝宝使用的安全椅的照片发布到微博@汽车洋葱圈
      和我们一起长高更多的用户关注儿童汽车出行安全`,
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
  },
  submit() {
    console.log(my.canIUse('favorite'))
    my.httpRequest({
      url: `https://${DOMAIN_NAME}/say-hello`,
      success: (res) => {
        my.alert({
          title: "寄送已经成功",
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
