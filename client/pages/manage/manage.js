
// 请修改为您的小程序云应用的真实域名
const DOMAIN_NAME = 'app2137169189test.mapp-test.xyz';

Page({
  data:{
    itemsThumb: [
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '田玉岩的申请-出生证明',
        extra: '描述',
        arrow: true,
      },
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '戴琳的申请-出生证明',
        arrow: true,
      },
    ],
    swipeIndex: null,
    right2: [{ type: 'edit', text: '通过' }, { type: 'delete', text: '拒绝' }],
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onRightItemClick(e) {
    my.confirm({
      title: '温馨提示',
      content: `${e.index}-${e.extra}-${JSON.stringify(e.detail)}`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.showToast({
            content: '确定 => 执行滑动删除还原',
          });
          e.done();
        } else {
          my.showToast({
            content: '取消 => 滑动删除状态保持不变',
          });
        }
      },
    });
  },
  onItemClick(e) {
    my.alert({
      content: `dada${e.index}`,
    });
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index || null,
    });
  },
});
