const app = getApp();

Page({
  data: {
    imgUrls: [],
    photoImg: '../../assets/upload.png',
    addImgText: "拍照/相册",
    canAddImg: true,
    maxAddImgNum: 1,
    i: 0
  },
  addImg: function () {    
    // 上传照片
    var that = this;
    my.chooseImage({
        count: that.data.maxAddImgNum,
        success: (res) => {
            var _imgUrls = this.data.imgUrls;
            _imgUrls = _imgUrls.concat(res.apFilePaths);
            if(_imgUrls.length == 0) {
              that.set_data(that,_imgUrls,"拍照/相册",true);
            }
            if(_imgUrls.length > 0 && _imgUrls.length < that.data.maxAddImgNum){
              that.set_data(that,_imgUrls,"+",true);
            }
            if(_imgUrls.length >= that.data.maxAddImgNum){
              that.set_data(that,_imgUrls.splice(0,that.data.maxAddImgNum),"+",false);
            }
        },
    });
  },
  toUploadImg: function(){
    this.uploadImg();
  },
  uploadImg: function() {
    var theDemoDomain = app.demoDomain;
    var that = this;
    var ii = that.data.i;
    if(ii < that.data.imgUrls.length){
      my.uploadFile({
        url: theDemoDomain + '/upload',
        fileType: 'image',
        fileName: 'file',
        filePath: that.data.imgUrls[that.data.i],
        headers: {
          contentDisposition: 'attachment',
        },
        success: (res) => {
          console.log('upload img>>>>>>>>>', res);
          var record = JSON.parse(res.data);
          if(record.success){
            app.imgUrl = record.data.imgUrl;
            my.showToast({
              content: '图片上传成功',
              duration: 1000,
            });
          }
          that.setData({i: ii+1});
          that.uploadImg();
          // 跳转到 上传页面
          that.navigateTo();
        },
      });
    }else{
      that.setData({i:0})
    }
  },
  navigateTo: function (msg) {
    // var query = '../apply/apply?from=upload_img&imgUrl='+msg;
    my.navigateBack({
      delta: 1
    })
  },
  // 删除照片
  delImg: function (e) {
    var index = e.target.dataset.index;
    var _imgUrls = this.data.imgUrls;
    _imgUrls.splice(index, 1);
    if(_imgUrls.length == 0){
      this.set_data(this,_imgUrls,"拍照/相册",true);
    }
    if(_imgUrls.length > 0 && _imgUrls.length < this.data.maxAddImgNum){
      this.set_data(this,_imgUrls,"+",true);
    }
  },
  set_data: function(that,imgUrls,addImgText,canAddImg) {
    that.setData({
      imgUrls: imgUrls,
      addImgText: addImgText,
      canAddImg: canAddImg
    });
  }
});
