<template>
    <!-- 提币 -->
    <div class="mentionMoney">
        <!-- 头部 -->
        <pub-head 
            :title="$t('wallet.MentionMoney')"
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor"
        >
            <router-link tag="div" class="menu" style="color:#fff" :to="{path:'/wallet/eassets/bill/allRecord',query:{coin:this.coin}}">
                <span class="iconfont icon-zhangdan"></span>
            </router-link>
        </pub-head>
        <!-- 提现地址 -->
        <div class="Withdrawal-address">
            <div class="address jus-b">
                <span class="iconfont icon-guzhongtixing"></span>
                <input type="text" :placeholder="$t('wallet.PleaseEnterTheWithdrawalAddress')" v-model="address">
                <span class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui" @click="toAddressHistory()"></span>
            </div>
            <div class="address-name">
                <span class="iconfont icon-guzhongtixing"></span>
                <input type="text" :placeholder="$t('wallet.Address')" v-model="addressName">
            </div>
        </div> 
        <!-- 提现金额 -->
        <div class="withdrawal-amount">
            <div class="amount">
                <span>{{$t('wallet.Depositprice')}}</span>
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
            <mt-button  @click="confirm()" class="btn" :disabled="disabled">
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
    name:'MentionMoney',
    data(){
        return{
            coin:this.$route.query.coin,//币种
            address:'',//提现地址
            addressName:'',//地址名称
            amount:'',//提现金额
            coins:{},//所有币种
            balance:0,//可用余额
            limit:'',//最低提现
            fee:'',//手续费
            code:'',//验证码
            disabled:false,//让button按钮失效
        }
    },
    // 声明组件
    components:{
        pubHead,
        'vmode':VMode,
    }, 
    /**************************注释部分与address页面有关，暂不做任何操作******************/
    // created(){
    //     //接受提现地址，并且存入本地
    //     this.$on('seAddress', add =>{
    //         localStorage.setItem('name',add.name);
    //         localStorage.setItem('address',add.address);
    //     })
    //     this.name = localStorage.getItem('name');
    //     this.address = localStorage.getItem('address')
    // },

    
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
        // 跳转到充值提现记录
        toAllRecord(){
            this.$router.push('/wallet/eassets/bill/allRecord')
        },
        // 跳转到地址历史记录
        toAddressHistory(){
            this.$router.push({
                name:'Address',
                params:{
                    coin:this.coin
                }
            })
        },
        // 获取验证码
        setCode(code){
            this.code = code;
        },
        //确定提现
        confirm(){
            if(this.address && this.amount){
                this.$api.user.getConfirm({
                    address:this.address,
                    amount:this.amount,
                    coin:this.coin,
                    name:this.addressName,
                    authCode:this.code
                }).then(res =>{
                    this.amount = '';
                    console.log(222222)
                    this.disabled = false;
                    this.$toast(this.$t('wallet.Depositsuccess'));
                }).catch(err =>{
                    this.code = '';
                    let stencil = this.$refs.vmodes;
                    this.disabled = true;
                    stencil.init(this);
                    if(err.data.authType){
                        stencil.showBounced({
                            authType:err.data.authType,
                            callback:this.confirm,
                        })
                    }
                    if(err && err.data.message){
                        this.$toast(this.$t('error.'+err.data.message))
                    }
                })
            }
        }
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
</style>
