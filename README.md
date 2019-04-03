# exchange
免费创建数字币交易所

架构golang、mongodb、redis、rabbmitmq

采用内存撮合，微服务架构，支持高并发，多集群

[所需软件打包下载]

https://share.weiyun.com/5IUjCcJ

1.安装erlang

2.设置erlang环境变量

![erlang](https://github.com/nearcode/exchange/blob/master/erlang.png)

3.安装nodejs
安装完成后在终端执行命令

    npm install vue -g
    npm install vue-cli -g
    
4.进到app目录
    
    运行网站
    npm start
    编辑发布网站
    npm run build
    
5.运行打包文件目录下的start文件，会自动启动mongodb、redis、rabbitmq

6.网站程序说明

[网站程序下载]

https://share.weiyun.com/5EPeGxY
    
    web.exe启动一个web环境，相当于nginx,可通过访问http://127.0.0.1访问网站
    base.exe为网站api
    exchange.exe为交易api
    match.exe为撮合程序
    kline.exe为K线
