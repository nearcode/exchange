// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import config from './config' // 配置信息
import App from './App'
import router from './router'
import api from './api' // 导入api接口
import store from './store' // 导入vuex文件
import VueI18n from 'vue-i18n' //引入中英文翻译
//引入
// import FastClick from 'fastclick'
//初始化FastClick实例。在页面的DOM文档加载完成后
// FastClick.attach(document.body)

Vue.use(VueI18n)

// 中英文切换
function language() {
  let lang = window.localStorage.getItem('language');
  if (lang) {
    return lang
  } else {
    return 'chinese'
  }
}

const languages = language()

const i18n = new VueI18n({
  locale: languages,
  messages: {
    'chinese': require('@/common/language/chinese'),
    'english': require('@/common/language/english'),
    'korean': require('@/common/language/korean'),
  }
})

Vue.prototype.$api = api; // 将api挂载到vue的原型上
Vue.prototype.$config = config;

//公共函数
import common from '@/common'
Vue.prototype.$common = common;

import * as filters from '@/common/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


// 按需引入minu-ui组件
import {
  Toast,
  Swipe,
  SwipeItem,
  Picker,
  Popup,
  Switch,
  Button,
  MessageBox,
  Radio,
  Indicator,
  Spinner 
} from 'mint-ui';
import './config/rem'
import './style/common.less'
Vue.config.productionTip = false;

// 按需加载minu-ui组件
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(Switch.name, Switch);
Vue.component(Button.name, Button);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Radio.name, Radio);
Vue.component(Spinner.name, Spinner);
// Toast提示挂载到原型
Vue.prototype.$toast = msg => Toast({
  message: msg,
  duration: 1500
});
// Loading提示挂载到原型
Vue.prototype.$loading = Indicator;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
})
