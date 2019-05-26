Page({
  data: {

  },
  onmessage(e){
    my.alert({
      content: '拿到数据'+JSON.stringify(e), // alert 框的标题
    });
  }
});