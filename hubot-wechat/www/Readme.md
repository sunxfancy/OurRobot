API 文档
==========


这里有全部的Restful API接口的说明


## 控制类

开启一个robot

```js
url:  /start/:adapter  (post)

ok:  {err: 0}

error0: {
    err: 200, msg: '找不到该adapter'
}

error1: {
    err: 201, msg: '通用名字和adapter名字均未设置'
}

error2: {
    err: 202, msg: 'adapter启动失败'
}
```


停止一个robot

```js
url:  /stop/:adapter  (post)

ok:  {err: 0}

error0: {
    err: 200, msg: '找不到该adapter'
}
```


## 状态类

查看任意时刻的运行状态


```js
url:  /list  (get)

ok:  {
    err: 0, 
    status: {
        weixin: 'running',
        gitter: 'startup',
        telegram: 'stop'   
    }
}
```


## 设置参数类

设置通用机器人的名字，若某个adapter没有设置专用名字，则用通用名字代替

```js
url:  /name  (post)
params: { data: '名乃' }


ok: { err: 0 }

error0: {
    err: 300, msg: '输入参数不正确'
}
```

设置某个adapter的机器人专用名


```js
url:  /name/:adapter  (post)
params: { data: '小哀' }

ok: { err: 0 }

error0: {
    err: 300, msg: '输入参数不正确'
}
```


## 微信登录

请求某次登录的uuid

```js
url:  /wxlogin  (get)

ok: { code: 200, uuid: "gZU-6Vl4vw==" }

error0: {
    err: 100, msg: '登录错误，jslogin接口异常'
}
```

轮询某次登录用户是否扫描并确认登录

```js
url:  /wxlogin/:uuid  (get)

ok0: { code: 408 } // 用户未扫描
ok1: { code: 201 } // 用户扫描但未确认
ok1: { code: 200 } // 用户扫描确认

error0: {
    err: 101, msg: '登录错误，cgi接口异常'
}
```