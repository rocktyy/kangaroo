
// 请修改为您的小程序云应用的真实域名
const app = getApp();

Page({
  data: {
    applyStatus: 0,
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this.initPage();
  },
  onShow() {
    // 页面加载
  },

  initPage(){
    var that =this,
     userId = app.userInfo && app.userInfo.userId || '10001',
     activity_id = app.activityId,
     param = {
       userId,
       activity_id
     };

    this.getApplyInfo(param).then(res=>{
      if(res.success){
        that.setData({
          applyStatus: res.data,
        });
      }else{
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    }); 
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)

    var userId = app.userInfo && app.userInfo.userId || '10001',
     activity_id = app.activityId,
     param = {
       ...e.detail.value,
       activity_id,
       userId,
     };
    console.log('param >>>>>>>', param);

    this.applyChair(param).then(res=>{
      if(res.success){
        my.alert({
          title: "申请座椅成功！",
          content: res.data
        });
        that.setData({
          applyStatus: 1,
        });
      }else{
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    }); 
  },

  // 写入数据库obj，当前用户增加一条todo
  applyChair(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/apply/add', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  },

  // 写入数据库obj，当前用户增加一条todo
  getApplyInfo(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/apply/init', 
        method: 'POST',
        data: obj,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: function(res) {
          reject();
        }
      });
    });
  },

  uploadImg() {
    // 跳转上传图片页面
    var query = '../upload_img/upload_img?from=apply';
    my.navigateTo({
      url: query
    })
  },
});
