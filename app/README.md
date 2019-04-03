# coin

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# src 文件目录
src
    |----asset 静态资源文件。
            |----image image文件夹,公共图片存放文件夹
            …………
    |----components 公共组件。
            |----foot.vue 网页底部组件
            |----head.vue 网页头部组件
            …………
    |----config
            |----rem.js 适配js
            |----utils.js 脚手架、工具函数
    |----requset 网络请求相关内容
            |----api.js 接口文件。统一管理服务器接口
            |----http.js 封装的axios、错误统一处理
    |----router
            |----index.js 路由文件
    |----store vuex仓库
            |----index.js
    |----style 样式
            |----common.less 公共样式
            |----mixin.less 变量、函数等
            |----reset.less 初始化样式
    |----view 页面
        |----home
                |----home.vue 首页
        |----user
                |----user.vue 个人中心
        …………
    |----App.vue 程序入口
    |----main.js 程序入口

# tempalte和css中命名采用-横线命名，eg：nav，nav-item，nav-item-ico
# js中命名一律驼峰命名法，eg: initData, setUserName。
