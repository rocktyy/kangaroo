const app = getApp();

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
    this.setData({
      index: e.detail.value,
    });
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)

    var userId = '10001';
    if (app.userInfo) {
      userId = app.userInfo.userId;
    }
    console.log('Add todo to user>>>>>>>', userId);
    this.addTodo({
      ...e.detail.value,
      userId: userId
    }).then(res=>{
      if(res.success){
        my.alert({
          title: "回寄已经成功",
          content: res.data.data
        });
      }else{
        my.showToast({
          content:'请求失败，请重试'
        })
      }
    })    
  },

  // 写入数据库obj，当前用户增加一条todo
  addTodo(obj) {
    var theDemoDomain = app.demoDomain;
    return new Promise(function (resolve, reject) {
      my.request({
        url: theDemoDomain+'/sendBack/add', 
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
          console.log('Add todo fail>>>>>>>>', res)
          reject();
        }
      });
    });
  }

});
