Component({
  
  uploadImg() {
    // 跳转上传图片页面
    var query = '../upload_img/upload_img?from=apply';
    my.navigateTo({
      url: query
    })
  },
});
