import Vue from 'vue'
import Router from 'vue-router'
// import VueRouter from 'vue-router';

Vue.use(Router)
// Vue.use(VueRouter)

export default new Router({
  mode: 'hash',
  routes: [
    { // 首页
      path: '/home', name: 'Home', 
      component: resolve => require(['@/view/home'], resolve) 
    },
    { // 行情
      path: '/market', name: 'Market', 
      component: resolve => require(['@/view/market'], resolve) 
    },
    { // 交易
      path: '/deal/:pair', name: 'Deal', 
      component: resolve => require(['@/view/deal'], resolve),
    },
     // 股票视图
    {
      path:'/tradingView',name:'TradingView',
      component:resolve => require(['@/components/tradingView/tradingView'], resolve),
    },
    { // 钱包
      path: '/wallet', name: 'Wallet', 
      component: resolve => require(['@/view/wallet'], resolve),
      children:[
        // 现有资产
        {
          path:'eassets',name:'Eassets',
          component:resolve => require(['@/view/wallet/eassets/eassets'], resolve),
          children:[
            // 充币
            {
              path:'changeMoney',name:'ChangeMoney',
              component:resolve => require(['@/view/wallet/eassets/changeMoney/changeMoney'], resolve),
            },
            // 提币
            {
              path:'mentionMoney',name:'MentionMoney',
              component:resolve => require(['@/view/wallet/eassets/mentionMoney/mentionMoney'], resolve),
              children:[
                // 提现地址历史记录
                {
                  path:'address',name:'Address',
                  component:resolve => require(['@/view/wallet/eassets/mentionMoney/address/address'],resolve)
                }
              ]
            },
            // 转账
            {
              path:'taccount',name:'Taccount',
              component:resolve =>require(['@/view/wallet/eassets/taccount/taccount'],resolve)
            },
            // 提现记录
            {
              path:'bill',name:'Bill',
              component:resolve => require(['@/view/wallet/eassets/bill/bill'], resolve),
              children:[
                // 所有提现/充值记录
                {
                  path:'allRecord',name:'AllRecord',
                  component:resolve => require(['@/view/wallet/eassets/bill/allRecord/allRecord'],resolve)
                },
                // 充值记录
                {
                  path:'rechargeRecord',name:'RechargeRecord',
                  component:resolve => require(['@/view/wallet/eassets/bill/rechargeRecord/rechargeRecord'],resolve)
                },
                // 提现记录
                {
                  path:'withdrawalRecord',name:'WithdrawalRecord',
                  component:resolve => require(['@/view/wallet/eassets/bill/withdrawalRecord/withdrawalRecord'],resolve)
                },
              ]
            },
            //账单详情
            {
              path:'billingDetail',name:'BillingDetail',
              component:resolve => require(['@/view/wallet/eassets/billingDetail/billingDetail'],resolve)
            }
          ]
        },
        // C2C交易
        {
          path:'c2c',name:'C2C',
          component:resolve => require(['@/view/wallet/c2c/c2c'], resolve),
          children:[
            // 交易记录
            {
              path:'record',name:'Record',
              component:resolve => require(['@/view/wallet/c2c/record/record'], resolve),
              meta: {
                keepAlive: true,
                isUseCache: false // 第一次进入刷新数据，后续进入缓存数据
              },
              children:[
                // 付款信息
                {
                  path:'payment',name:'Payment',
                  component:resolve => require(['@/view/wallet/c2c/payment/payment'], resolve),
                }
              ]
            }
          ]
        },
        // 银行卡
        {
          path:'bankCard',name:'BankCard',
          component:resolve => require(['@/view/wallet/bankCard/BankCard'], resolve),
          children:[
            {
              // 添加银行卡
              path:'addBank',name:'AddBank',
              component:resolve => require(['@/view/wallet/bankCard/addBank/addBank'],resolve)
            }
          ]
        }
      ]
    },
    { // 个人
      path: '/user', name: 'User', 
      component: resolve => require(['@/view/user'], resolve),
      children:[
        {
          // 币种设置
          path:'currencySet',name:'CurrencySet',
          component:resolve => require(['@/view/user/currencySet/CurrencySet'],resolve),
          children:[
            // 关注币种
            {
              path:"focusCurrency",name:'FocusCurrency',
              component:resolve => require(['@/view/user/currencySet/focusCurrency/FocusCurrency'],resolve)
            },
            // 未关注币种
            {
              path:"no-FocusCurrency",name:'No-FocusCurrency',
              component:resolve => require(['@/view/user/currencySet/no-focusCurrency/No-FocusCurrency'],resolve)
            }
          ],
        },
        {
          // 客服中心
          path:'callCenter',name:'CallCenter',
          component:resolve => require(['@/view/user/callCenter/CallCenter'],resolve),
          children:[
            // 添加我们
            {
              path:'addOur',name:'AddOur',
              component:resolve => require(['@/view/user/callCenter/addOur/AddOur'],resolve)
            }
          ]
        },
        {
          //安全中心
          path:'safetyCenter',name:'SafetyVenter',
          component:resolve => require(['@/view/user/safetyCenter/SafetyCenter'],resolve),
          children:[
            // 登录密码设置
            {
              path:'setPass',name:'SetPass',
              component:resolve => require(['@/view/user/safetyCenter/setPass/SetPass'],resolve)
            },
            // 谷歌验证设置
            {
              path:'setOtp',name:'SetOtp',
              component:resolve => require(['@/view/user/safetyCenter/setOtp/SetOtp'],resolve)
            },
            // 手机验证设置
            {
              path:'setMobile',name:'SetMobile',
              component:resolve => require(['@/view/user/safetyCenter/setMobile/SetMobile'],resolve)
            },
            // 邮箱验证设置
            {
              path:'setEmail',name:'SetEmail',
              component:resolve => require(['@/view/user/safetyCenter/setEmail/SetEmail'],resolve)
            },
            // 验证方式
            {
              path:'verify',name:'Verify',
              component:resolve =>require(['@/view/user/safetyCenter/verify/Verify'],resolve)
            }
          ]
        },
        // 实名认证
        {
          path:'certification',name:'Certification',
          component:resolve => require(['@/view/user/certification/Certification'],resolve)
        }
      ]
    },
    {
      // 登录
      path:'/login',name:'Login',
      component:resolve => require(['@/view/login/Login'],resolve),
      children:[
        {
          // 忘记密码
          path:'forget',name:'Forget',
          component:resolve => require(['@/view/login/forget/Forget'],resolve)
          
        },
      ]
    },
    {
      // 注册
      path:'/sign',name:'Sign',
      component:resolve => require(['@/view/login/sign/Sign'],resolve)
    },
    
    {
      // 公告
      path:"/inform",name:'Inform',
      component:resolve => require(['@/view/inform/Inform'],resolve),
      children:[
        {
          // 公告详情
          path:'detail',name:'Detail',
          component:resolve => require(['@/components/inform/detail/Detail'],resolve)
        }
      ]
    },
    // 初始进入登录页面
    {
      path:'**',
      redirect:'/home'
    },
    //验证方式
    {
      path:'/VMode',name:'VMode',
      component:resolve => require(['@/common/VMode/VMode'],resolve)
    }
  ]
})
