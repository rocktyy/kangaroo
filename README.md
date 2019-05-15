## 概述

本示例演示如何使用使用蚂蚁小程序云应用作为后端服务器编写一个HelloWorld。

## 前置条件
1. 拥有支付宝账号
2. [申请](https://open.alipay.com/platform/miniBeta.htm#/?_k=o88xd4)开通小程序开发者权限。
3. [创建小程序](https://docs.alipay.com/mini/introduce/create)。
4. [开通云服务](https://yuque.antfin-inc.com/tiny-site/cloud-service/bnd2v4#4khlly)。

## 使用步骤
1. 创建云服务，选择NodeJS技术栈，并构建服务器环境。具体做法详见[这篇文档](https://yuque.antfin-inc.com/tiny-site/cloud-service/rgrr6s)。
2. 关联云服务：点击IDE顶部“关联应用”，选择您的小程序，然后点击旁边的“云服务”，关联刚刚构建好的NodeJS环境。

![屏幕快照 2018-09-14 下午8.46.06.png | center | 799x65](https://cdn.nlark.com/lark/0/2018/png/26789/1536929219508-88dbbe86-8a8c-4cd5-8a43-fac188ee76fb.png "")

3. 打开client/pages/index/index.js，修改调用后端请求的域名。测试环境的域名可以从云服务应用的详情页获取：

![b.png | center | 799x604](https://cdn.nlark.com/lark/0/2018/png/26789/1536929958989-a7a81268-7afc-46dd-8bba-9ec8b0e74d6f.png "")


![屏幕快照 2018-09-14 下午9.00.20.png | center | 799x274](https://cdn.nlark.com/lark/0/2018/png/26789/1536930061667-5b1f7825-5aa4-4b48-bc2e-36f4a5a1f862.png "")

4. 上传部署server端代码：点击IDE顶部云服右边的工具图标，在下拉菜单中选择“上传部署服务端代码”。

![屏幕快照 2018-09-14 下午8.47.15.png | center | 799x267](https://cdn.nlark.com/lark/0/2018/png/26789/1536929298934-2cbf0eb0-95a4-440e-9700-b8e8a6a64149.png "")

5. 运行client端查看效果。
    

![屏幕快照 2018-09-14 下午9.40.12.png | center | 379x671](https://cdn.nlark.com/lark/0/2018/png/26789/1536932434288-49419587-3c63-4524-94f6-5b37ef27c121.png "")


## 资源
1. 更详细的步骤，[请参考这篇快速开始文档](https://yuque.antfin-inc.com/tiny-site/cloud-service/bwwxu1)

