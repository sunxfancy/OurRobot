OurRobot
===========

一款通过微信群和人聊天的机器人，使用hubot-weixin开发

名字来源： We Chat With Our Robot
微信名：名乃


## 项目本地测试

Hubot需要使用npm安装，clone本项目后，在hubot-wechat目录下执行：

```sh

npm i
```

来安装全部依赖项。

控制台调试：

```
./bin/hubot
```

微信配置：

首先你要注册一个微信号，并用web微信登录： <https://wx.qq.com>
打开浏览器调试模式，找到里面的webwxinit的接口请求，将hubot-weixin需要的项目填到`node_modules/hubot-weixin/config.yaml`里面
