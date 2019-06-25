if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;


function success() {
require('../..//app');
require('../../components/header/header');
require('../../node_modules/mini-antui/es/modal/index');
require('../../components/favorite_btn/favorite_btn');
require('../../node_modules/mini-antui/es/list/index');
require('../../node_modules/mini-antui/es/list/list-item/index');
require('../../node_modules/mini-antui/es/swipe-action/index');
require('../../pages/home/home');
require('../../pages/apply/apply');
require('../../pages/send_back/send_back');
require('../../pages/apply_search/apply_search');
require('../../pages/upload_img/upload_img');
require('../../pages/agreement/agreement');
require('../../pages/webview/webview');
require('../../pages/manage/manage');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}