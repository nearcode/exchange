<template>
    <!-- 钱包 -->
    <div class="wallet">
        <!-- 头部 -->
        <header class="header" :style="{backgroundColor:$config.color.mainCor}">
            <span>{{$t('wallet.WalletManagement')}}</span>
        </header>
        <!-- logo -->
        <div class="logo flex" :style="{backgroundColor:$config.color.mainCor}">
            <div class="logo-big">
                <div class="logo-small">
                    <img src="./images/timg.jpg" alt="">
                </div>
            </div>
            <!-- 风险测试 -->
            <div class="user-info">
                <div class="user-name">{{$store.state.username}}({{$store.state.uid}})</div>
                <div class="risk-based">
                    <span>{{$t('wallet.SafetyFactor')}}</span>
                    <span>{{riskType}}</span>
                </div>
            </div>
        </div>
        <!-- 总资产和净资产 -->
        <div class="total-assets">
            <!-- 显示单位 -->
            <div class="show jus-b">
                <div class="show-unit">
                    <span>{{$t('wallet.AccordingUnit')}}</span>
                    <span>CNY</span>
                </div>
                <div class="look">
                    <span class="iconfont icon-eye"></span>
                </div>
            </div>
            <!-- 总资产 -->
            <div class="asset-text jus-b">
                <div class="property jus-b">
                    <div class="all">
                        <div class="property-txt">
                            <span>{{$t('wallet.TotalAssets')}}</span>
                        </div>
                        <div class="property-btc" :style="{color:$config.color.mainCor}">
                            <span>≈ ￥{{allPrice | autoFixed}}</span>
                        </div>
                    </div>
                    <!-- <div class="property-rmb">
                        <span>￥{{valuation | toRmb | range}}</span>
                    </div> -->
                </div>
                <!-- 净资产 -->
                <div class="net-asset jus-b">
                    <div class="all">
                        <div class="net-asset-txt">
                            <span>{{$t('wallet.NetAsset')}}</span>
                        </div>
                        <div class="property-btc" :style="{color:$config.color.mainCor}">
                            <span>≈ ￥{{allEstate | autoFixed}}</span>
                        </div>
                    </div>
                    <!-- <div class="property-rmb">
                        <span>￥{{valuation | toRmb | range}}</span>
                    </div> -->
                </div>
            </div>
        </div>
        <!-- 功能列表 -->
        <div class="all-list">
            <!-- 现货资产 -->
            <div class="cash jus-b" @click="toEassets()">
                <div class="cash-asset">
                    <span class="iconfont icon-qian3"></span>
                    <span>{{$t('wallet.CashAssets')}}</span>
                </div>
                <div class="cash-jianatou">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- c2c交易 -->
            <div class="cash jus-b" @click="toC2C()">
                <div class="cash-asset">
                    <span class="iconfont icon-jiaoyi"></span>
                    <span>{{$t('wallet.C2CDeal')}}</span>
                </div>
                <div class="cash-jianatou">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 银行卡 -->
            <div class="cash jus-b" @click="toBankCard()">
                <div class="cash-asset">
                    <span class="iconfont icon-yinxingqia"></span>
                    <span>{{$t('wallet.BankCard')}}</span>
                </div>
                <div class="cash-jianatou">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    // 钱包
    name:'Wallet',
    data () {
        return {
            //username:'',//用户名
            //id:'',//用户ID
            btcList:[],// 资产列表
            valuation:{},//所有币种的资产
            coins:{},//所有币种
        }
    },
    mounted(){
        //清楚存储在本地的提现地址
        try{
            this.coins = this.$common.getJsonData(localStorage.coins || '{}');
            this.btcList = this.$common.getJsonData(localStorage.btcList || "[]");
        }catch(e){
            this.coins = {};
            this.btcList = [];
        }
        // 获取资产
        this.$store.commit('getBalances', this);
    },
    methods:{
        // 跳转到现有资产
        toEassets(){
            this.$router.push('/wallet/eassets')
        },
        // 跳转到C2C交易
        toC2C(){
            this.$router.push('/wallet/c2c')
        },
        // 跳转到添加银行卡
        toBankCard(){
            this.$router.push('/wallet/bankCard')
        },
    },
    //计算
    computed:{
        //总资产
        allPrice(){
            let price = 0;
            for (let coin in this.$store.state.balances){
                price += this.$store.state.balances[coin].allValuation;
            }
            return price;
        },
         // 净资产
        allEstate(){
            let Eprice = 0;
            for (let coin in this.$store.state.balances){
                Eprice += this.$store.state.balances[coin].valuation;
            }
            return Eprice;
        },
        // 判断安全系数
        riskType(){
            if(this.$store.state.email && this.$store.state.mobile){
                return this.$t('wallet.Height')
            }else if(this.$store.state.mobile){
                return this.$t('wallet.Height')
            }
            // else if(this.$store.state.authType.otp){
            //     return this.$t('wallet.Height')
            // }else if(this.$store.state.authType.otp && this.$store.state.email){
            //     return this.$t('wallet.Height')
            // }
            else if(this.$store.state.email){
                return this.$t('wallet.Middle')
            }
        }
    }
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
    .wallet {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background: @pub-bg;
        // 头部
        .header{
            width: 100%;
            height: 0.88rem;
            background: @main-cor;
            text-align: center;
            line-height: .88rem;
            font-size: .32rem;
            color: #fff;
            border-bottom: 1px solid #b3dafd;
        }
        // logo
        .logo{
            width: 100%;
            height: 3.56rem;
            background-color:@main-cor;
            padding-top: 0.32rem;
            // 头像
            .logo-big{
                width: 2.04rem;
                height: 2.04rem;
                border-radius: 50%;
                // border: 2px solid @bord-col;
                margin-left:1.02rem;
                margin-right:1.02rem;
                .logo-small{
                    width: 1.5rem;
                    height: 1.5rem;
                    background: #fff;
                    margin: .24rem auto;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            // 用户名
            .user-info{
                height: 2.04rem;
                line-height: .4rem;
                padding-top: .56rem;
                .user-name{
                    font-size: .28rem;
                    color: #fff;
                }
                .risk-based{
                    font-size: .28rem;
                    color:#fff;
                    .icon-arrow-right-copy-copy-copy{
                        font-size: .28rem
                    }
                }
            }
            
        }
        // 总资产和净资产
        .total-assets{
            position: relative;
            left: 0;
            top: -.96rem;
            height: 2.16rem;
            background: #fff;
            margin: 0 .22rem;
            border-radius: .2rem;
            border: 1px solid @bord-col;
            box-shadow: 0px 0px 1px 1px @bord-col;
            padding-left: .32rem;
            padding-right: 0.32rem;
            .show{
                height: .78rem;
                line-height: .78rem;
                font-size: .28rem;
                color: #7a7265;
            }
            // 总资产
            .asset-text{
                height: 1.34rem;
                padding-top: 0.14rem;
                padding-bottom: 0.14rem;
                .property{
                    width: 50%;
                    border-right: 1px solid #ccc;
                    .all{
                        line-height: .6rem;
                        color: #7a7265;
                        font-size: .28rem;
                        overflow: hidden;
                    }
                    .property-rmb{  
        
                        line-height: 1.2rem;
                        color: @main-cor;
                        font-size: .48rem;
                        overflow: hidden;
                    }
                }
                // 净资产
                .net-asset{
                    width: 50%;
                    padding-left: .3rem;
                    .all{
         
                        line-height: .6rem;
                        color: #7a7265;
                        font-size: .28rem;
                        overflow: hidden;
                    }
                    .property-rmb{  
             
                        line-height: 1.2rem;
                        color: @main-cor;
                        font-size: .48rem;
                        overflow: hidden;
                    }
                }
            }
        }
        //功能列表
        .all-list{
            position: relative;
            left: 0;
            top: -.7rem;
            margin: 0 .32rem;
            background: #f2eee9;
            border: 1px solid @bord-col;
            &>div:first-child{
                border-top-left-radius:0.1rem;
                border-top-right-radius:0.1rem;
            }
            &>div:last-child{
                border-bottom-left-radius:0.1rem;
                border-bottom-right-radius:0.1rem;
            }
            .cash{
                height: 1.06rem;
                background: #fff;
                line-height: 1.06rem;
                padding-left: .3rem;
                padding-right: 0.3rem;
                margin-bottom: 1px;
                .cash-asset{
                    color: #4c4c4c;
                    font-size: .32rem;
                    .iconfont{
                        color: #4c4c4c;
                        font-size: .4rem;
                        padding-right:.2rem ;
                    }
                    .icon-jiaoyi{
                        font-size: .48rem;
                    }
                    .icon-qian3{
                        font-size: .44rem;
                    }
                }
            }
            .icon-arrow-right-copy-copy-copy{
                color: #cccccc;
            }
        }
        .icon-arrow-right-copy-copy-copy{
            font-size: .32rem
        }
    }
    .slideInRight, .slideOutRight{
		animation-duration: 300ms;
	}
</style>
    
    