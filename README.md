# deprecated: move to gitlab #

ecs-server 
=============

Ali Ecs Server Api repo

## dev ##

```
    yarn install 
```

**修改配置**

依照 `./config/config.example.json` 的格式创建 `serverConfig.json` 以及 `prodConfig.json`, 并且修改其中配置参数

**配置(Config)**

|参数名称                        |描述
|-------------------------------|----------------------------------------------------------
|port                           | 服务器端口号
|keys                           | Koa keygrip
|sessionKey                     | session key, 默认  `Koa:sess`
|db.databaseName                | 数据库名
|db.username                    | 账号
|db.password                    | 密码
|db.host                        | 地址
|db.port                        | 端口
|db.dialect                     | 数据库类型,当前只支持 `mysql`

然后运行脚本, 初始化数据库
```
    yarn run db:init:test
```

运行程序
```
    yarn run dev
```


## api

 [Api Documentations](https://documenter.getpostman.com/collection/view/131861-5c93d47f-265c-b4b7-e3dc-7e3627032f29?_ga=2.66080809.667647118.1519614116-1468126025.1511865075)
