// 请修改为您的小程序云应用的真实域名
const DOMAIN_NAME = 'app2137169189test.mapp-test.xyz';

Page({
  data: {
    imgUrls: [],
    addImgText: "拍照/相册",
    canAddImg: true,
    maxAddImgNum: 1,
    i: 0
  },
  addImg: function () {    // 上传照片
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
      var that = this;
      var ii = that.data.i;
      if(ii < that.data.imgUrls.length){
        // my.uploadFile({
        //     url: "",    //自己服务器接口地址
        //     fileType: 'image',
        //     fileName: 'file',
        //     filePath: that.data.imgUrls[that.data.i],
        //     formData: {   //这里写自己服务器接口需要的额外参数
        //         session: my.getStorageSync({key:'session'}).data
        //     },
        //     success: (res) => {
          var res = {data:'{"data":{"image_url":"xxxxxx"},"code":0,"msg":"\u6210\u529f"}', errMsg:"uploadFile:ok", statusCode:200};
          //res是自己服务器接口返回的数据（image_url的值为服务器上的图片链接），这里用假数据模拟
          if(JSON.parse(res.data).code == 0){
            alert('上传成功' + that.data.i);
          }
          that.setData({i: ii+1});
          that.uploadImg();
        //     },
        // });
      }else{
        that.setData({i:0})
      }
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
