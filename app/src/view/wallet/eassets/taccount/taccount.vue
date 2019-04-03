<template>
    <!-- 转账 -->
    <div class="mentionMoney">
        <!-- 头部 -->
        <pub-head 
            :title="$t('wallet.taccount')"
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor"
        >
            <router-link tag="div" class="menu" style="color:#fff" :to="{path:'/wallet/eassets/bill/allRecord',query:{coin:this.coin}}">
                <span class="iconfont icon-zhangdan"></span>
            </router-link>
        </pub-head>
        <!-- 转账账号 -->
        <div class="Withdrawal-address">
            <div class="address jus-b">
                <span class="iconfont icon-guzhongtixing"></span>
                <input type="text" :placeholder="$t('wallet.paccount')" v-model="address">
                <span class="iconfont"></span>
            </div>
        </div> 
        <!-- 平台列表 -->
        <div class="Withdrawal-address listplatform">
            <div class="address jus-b">
                <span class="iconfont icon-guzhongtixing"></span>
                <input type="text" placeholder="请选择" v-model="source" disabled>
                <span class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui" @click="select()"></span>
            </div>
        </div>
        <!-- 下拉选项 -->
        <ul class="list" v-if="platform" >
            <li class="li-list" v-for="item in lists" @click="platforms(item.name)">
                <span>{{item.name}}</span>
            </li>
        </ul>
        <!-- 转账金额 -->
        <div class="withdrawal-amount">
            <div class="amount">
                <span>{{$t('wallet.tamount')}}</span>
            </div>
            <div class="input-amount">
                <img :src="'static/coins/' + coin.toLowerCase() + '.png'" alt="">
                <input type="number" :placeholder="$t('wallet.Inputprice')" v-model="amount">
            </div>
            <div class="info">
                <p><span>{{$t('wallet.Usableprice')}}</span><span>{{balance}}{{coin}}</span></p>
                <p><span>{{$t('wallet.Mindeposit')}}</span><span>{{limit}}{{coin}}</span></p>
                <p><span>{{$t('wallet.CommissionCharges')}}</span><span>{{fee}}%{{coin}}</span></p>
            </div>
        </div>
        <!-- 确定 -->
        <div class="confirm">
            <mt-button  @click="taccount()" class="btn" :disabled="disabled">
                <span>{{$t('personage.confirm')}}</span>
            </mt-button>
        </div>
        
         <!-- 弹出框 -->
        <vmode ref="vmodes" v-on:code="setCode"></vmode>

        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
//引入验证方式组件
import VMode from '@/common/VMode/VMode';
export default {
    // 提币
    name:'Taccount',
    data(){
        return{
            coin:this.$route.query.coin,//币种
            address:'',//转账账号地址
            amount:'',//转账金额
            coins:{},//所有币种
            balance:0,//可用余额
            limit:'',//最低提现
            fee:'',//手续费
            code:'',//验证码
            disabled:false,//让button按钮失效
            source:'',//平台列表
            platform:false,
            lists:[
                {name:'请选择'},
                {name:'bibank'},
            ]
        }
    },
    // 声明组件
    components:{
        pubHead,
        'vmode':VMode,
    }, 
    mounted(){
        console.log(this.coin)
        this.coins = this.$common.getJsonData(localStorage.coins)[this.coin];
        //获取当前币种余额
        this.$api.user.getCoinBalance(this.coin).then(res =>{
            this.balance = res.balance
        })
        //获取当前币种最低提现、手续费
        this.$api.user.getInfo().then(res =>{
            this.limit = res.coins[this.coin].withdrawalLimit;//最低提现
            this.fee = res.coins[this.coin].withdrawalFee;//手续费
        })
    },
    methods:{
        // 平台列表下拉
        select(){
            this.platform = !this.platform;
        },
        // 平台确认
        platforms(item){
            this.source = item;
            this.platform = false;
        },
        // 确认转账
        taccount(){
            if(this.address && this.amount && this.source){
                this.$api.user.TransferAccount({
                    address:this.address,
                    amount:this.amount,
                    coin:this.coin,
                    authCode:this.code,
                    source:this.source
                }).then(res =>{
                    this.amount = '';
                    this.disabled = false;
                    this.$toast(this.$t('wallet.taccountsuccess'));
                    this.$api.user.getCoinBalance(this.coin).then(res =>{
                        this.balance = res.balance
                    })
                }).catch(err =>{
                    this.code = '';
                    this.source = '';       
                    let stencil = this.$refs.vmodes;
                    this.disabled = true;
                    stencil.init(this);
                    if(err.data.authType){
                        stencil.showBounced({
                            authType:err.data.authType,
                            callback:this.taccount,
                        })
                    }
                    if(err && err.data.message){
                        this.$toast(this.$t('error.'+err.data.message))
                    }
                })
            }else{
                this.$toast(this.$t('login.PerfectInfo'))
            }
        },
        // 获取验证码
        setCode(code){
            this.code = code;
        },
    }
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.mentionMoney{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: @pub-bg;
    z-index: 15;
    .Withdrawal-address{
        margin: .3rem .5rem;
        &>div:first-child{
            border-top-left-radius:.1rem;
            border-top-right-radius: .1rem; 
        }
        &>div:last-child{
            border-bottom-left-radius:.1rem;
            border-bottom-right-radius: .1rem;
        }
        .address{
            height: 1rem;
            line-height: 1rem;
            background: #fff;
            border-bottom: 1px solid @bord-col;
            span{
                display: inline-block;
                width: .6rem;
                text-align: center;
            }
            input{
                width: 80%;
            }
        }
        .address-name{
            height: 1rem;
            line-height: 1rem;
            background: #fff;
            span{
                display: inline-block;
                width: .6rem;
                text-align: center;
            }
            input{
                width: 80%;
            }
        }
    }
    .withdrawal-amount{
        margin: .3rem .5rem;
        &>div:first-child{
            border-top-left-radius:.1rem;
            border-top-right-radius: .1rem; 
        }
        &>div:last-child{
            border-bottom-left-radius:.1rem;
            border-bottom-right-radius: .1rem;
        }
        .amount{
            height: .6rem;
            background: #fff;
            line-height: .6rem;
            padding-left: .2rem;
            border-bottom: 1px solid @bord-col;
            color: #222;
        }
        .input-amount{
            height: 1rem;
            line-height: 1rem;
            padding-left: .2rem;
            border-bottom: 1px solid @bord-col;
            background: #fff;
            img{
                width: .78rem;
                height: .78rem;
            }
            input{
                width: 70%;
                height: .6rem;
                margin-left: .2rem;
            }
        }
        .info{
            height: 1.6rem;
            background: #fff;
            padding-left: 0.2rem;
            line-height: .5rem;
            color: #ccc;
            p{
                &>span:first-child{
                    padding-right: .2rem;
                }
            }
        }
    }
    .confirm{
        height: .88rem;
        line-height: .88rem;
        text-align: center;
        font-size: .32rem;
        margin: 1.6rem .2rem;
        border-radius: .1rem;
        .btn{
            width: 100%;
            background: @main-cor;
            color:#fff;
        }
    }
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}

.listplatform{
    input{
        background: #fff;
    }
}

.list{
    position: absolute;
    left: .6rem;
    top: 3.5rem;
    background: #666;
    width: 6rem;
    height: 6rem;
    z-index: 20;
    border-radius: 0.3rem;
    border: 1px solid rgba(0,0,0,.15);
    // box-shadow: 0 6px 12px rgba(0,0,0,.175);
    overflow: scroll;
    .li-list{
        height: .8rem;
        line-height: .8rem;
        font-size: 0.26rem;
        border-bottom: 1px solid #fff;
        color: #fff;
        &>span:nth-of-type(1){
            padding-left: .2rem;
            float: left;
        }
        &>span:nth-of-type(2){
            padding-left: .2rem;
            float: right;
        }
    }
}
</style>
