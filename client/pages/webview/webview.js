Page({
  data: {
    video: '',
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    const { videoUrl } = query;
    console.info('videoUrl=' + videoUrl);
    this.setData({
      video: videoUrl,
    });
  },
  onmessage(e){
    my.alert({
      content: '拿到数据'+JSON.stringify(e), // alert 框的标题
    });
  }
});