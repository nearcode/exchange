<template>
    <!-- 现有资产 -->
    <div class="eassets">
        <div class="bgImg" :style="{backgroundColor:$config.color.mainCor}">
            <!-- 头部 -->
            <pub-head 
                :title="$t('wallet.ExistingAssets')" 
                :titleColor="$config.color.titleCor"
                :isbackShow = 'true'
                :leftColor="$config.color.titleCor"
                bgColor="">
            </pub-head>
            <!-- 总资产 -->
            <div class="all-assets">
                <div class="all-assets-txt">
                    <span></span>
                    <span>{{$t('wallet.TotalAssets')}}</span>
                    <span></span>
                </div>
                <!-- 人民币金额 -->
                <div class="all-assets-rmb">
                    <span>￥{{valuation | toCNY(btcList.allBalance) | autoNumber}}</span>
                </div>
                <!-- 比特币金额 -->
                <!-- <div class="all-assets-btc">
                    <span>${{allPrice | range}}</span>
                </div> -->
            </div>
        </div>
        <!-- 搜索 -->
        <div class="search jus-b">
            <div class="search-txt">
                <span class="iconfont icon-sousuo"></span>
                <input type="text" :placeholder="$t('wallet.SearchForCurrencyAssets')" v-model="search">
            </div>
            <div class="hidden">
                <span>{{$t('wallet.HiddenIsLessThan')}}￥1</span>
                <input type="checkbox" v-model="filter" >
            </div>
        </div>
        <!-- 资产列表 -->
        <scroll class="assets-list">
           <div class="list">
               <div class="btc-list" v-for="(item,index) in filterData" :key="index">
                   <!-- btc名字、冻结、折合 -->
                   <div class="btc-name jus-b">
                       <div class="btc flex">
                           <!-- logo -->
                           <div class="btc-logo">
                               <img :src="'static/coins/' + item.coin.toLowerCase() + '.png'">
                           </div>
                           <!-- btc名字、冻结 -->
                           <div class="btc-frost">
                               <p>{{item.coin}}</p>
                               <div class="frost">
                                   <span>{{$t('wallet.Freeze')}}</span>
                                   <span>{{item.lock | autoNumber}}</span>
                               </div>
                           </div>
                       </div>
                       <!-- 折合 -->
                       <div class="btc-rmb">
                            <p>{{item.available | autoNumber}}</p>
                            <div class="convert">
                                <span>{{$t('wallet.ConvertInto')}}￥</span>
                                <span>{{item.coin | toCNY(item.available+item.lock) | autoNumber}}</span>
                            </div>
                        </div>
                   </div>
                   <!-- 充币、提币、账单、转账 -->
                   <div class="pay jus-b">
                       <!-- 充币 -->
                       <router-link tag="div" class="recharge coin" :to="{path:'/wallet/eassets/changeMoney',query:{coin:item.coin}}" v-if="getCoin(item.coin).deposit">
                           <span class="iconfont icon-3"></span>
                           <span>{{$t('wallet.ChargeMoney')}}</span>
                       </router-link>
                       <!-- 提币 -->
                       <router-link tag="div" class="mention coin" :to="{path:'/wallet/eassets/mentionMoney',query:{coin:item.coin}}" v-if="getCoin(item.coin).withdraw || getCoin(item.coin).transfer">
                           <span class="iconfont icon-tixian"></span>
                           <span>{{$t('wallet.MentionMoney')}}</span>
                       </router-link>
                       <!-- 账单 -->
                       <router-link tag="div" class="bill coin" :to="{path:'/wallet/eassets/bill/allRecord',query:{coin:item.coin}}" v-if="getCoin(item.coin).trade">
                           <span class="iconfont icon-zhangdan"></span>
                           <span>{{$t('wallet.Bill')}}</span>
                       </router-link>
                       <!-- 转账 -->
                       <router-link tag="div" class="bill coin" :to="{path:'/wallet/eassets/taccount',query:{coin:item.coin}}" v-if="getCoin(item.coin).alias == 'HIN'">
                           <span class="iconfont icon-zhangdan"></span>
                           <span>{{$t('wallet.taccount')}}</span>
                       </router-link>
                   </div>
               </div>
           </div>
        </scroll>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
// 引入头部
import pubHead from '@/common/head/head.vue';
import Scroll from "@/common/scroll/scroll";
export default {
    // 现有资产
    name:'Eassets',
    data(){
        return{
            btcList:[],// 资产列表
            valuation:{},//所有币种的资产
            coins: this.$common.getJsonData(localStorage.coins),//所有币种
            search:'',//搜索
            filter:'',//过滤小于1的
        }
    },
    mounted(){
        //清除储存在本地的提现地址
        try{
            this.coins = this.$common.getJsonData(localStorage.coins || "{}");
            this.btcList = this.$common.getJsonData(localStorage.btcList || "[]");
        }catch(e){
            this.coins = {};
            this.btcList = []
        }
        // //获取资产
        this.$api.user.getBalance().then(res =>{
            // 遍历资产列表
            for (var coin in res.data){
                // if (!this.coins[coin]) continue;
                this.valuation[coin] = res.data[coin].available;
                res.data[coin].valuation = this.$common.toCNY(coin,res.data[coin].available)
            }
            this.btcList = Object.values(res.data);
            localStorage.btcList = JSON.stringify(this.btcList);
        }).catch(err =>{
            console.log(err)
        })
        console.log(this.valuation)
    },
    // 声明组件
    components :{
        pubHead,
        Scroll
    },
    methods:{
        getCoin(coin){
            if (!this.coins[coin])
                return {};
            else
                return this.coins[coin];
        }
    },
    //计算
    computed:{
        balances(){
            let balances = this.$store.state.balances;
            let balanceList = [];
            for (let coin in balances){
                balanceList.push(balances[coin]);
            }
            return balanceList;
        },
        //过滤数据
        filterData(){
            var serachs = this.search.toUpperCase().trim();
            var filters = this.filter;
            var filterArr = this.$common.clone(this.balances);
            let delList = [];
            //搜索
            if(serachs){
                for (let item of filterArr){
                    if(item.coin.indexOf(serachs) == -1){
                        delList.push(item);
                    }
                }
            }
            for(let item of delList){
                this.$common.remove(filterArr, item);
            }
            delList = [];
            if(filters){
                for (let item of filterArr){
                    if(item.allValuation <= 1){
                        delList.push(item)
                    }
                }
            }
            for(let item of delList){
                this.$common.remove(filterArr, item);
            }
            //搜索数组排序
            filterArr = filterArr.sort((a,b) =>{
                return (a.index || 0) - (b.index || 0);
            });
            return filterArr;
        },
        //总资产
        allPrice(){
            let price = 0;
            this.balances.forEach(item =>{
                price += item.allBalance
            });
            return price;
        }
    }
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.eassets{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: @pub-bg;
    bottom: 0;
    z-index: 10;
    overflow: hidden;
    // 背景图
    .bgImg{
        width: 7.5rem;
        height: 3rem;
        background: @main-cor;
        // background-size: 7.5rem 3.4rem;
    }
    // 总资产
    .all-assets{
        padding-top: .2rem;
        .all-assets-txt{
            height: .4rem;
            text-align: center;
            color:#fff;
            font-size: .34rem;
            &>span:first-child{
                display: inline-block;
                border: 1px solid #fff;
                width: 1.24rem;
                margin-right: .14rem;
            }
            &>span:last-child{
                display: inline-block;
                border: 1px solid #fff;
                width: 1.24rem;
                margin-left: .14rem;
            }
        }
        // 人民币金额
        .all-assets-rmb{
            height: 0.7rem;
            line-height: 0.7rem;
            overflow: hidden;
            text-align: center;
            font-size: .5rem;
            color: #fff;
        }
        // 比特币金额
        .all-assets-btc{
            height: .5rem;
            line-height: .5rem;
            text-align: center;
            overflow: hidden;
            font-size: .3rem;
            color: #fff;
        }
    }
    // 搜索
    .search{
        position: relative;
        left: 0;
        top: -.4rem;
        height: .84rem;
        margin-left: .2rem;
        margin-right: .2rem;
        border-radius: .1rem;
        border: 1px solid @bord-col;
        background: #fff;
        padding-top: .1rem;
        padding-bottom: 0.1rem;
        // box-shadow: 0 0 1px 1px #b3dafd;
        .search-txt{
            width: 66%;
            border-right: 1px solid @bord-col;
            line-height: .6rem;
            span{
                display: inline-block;
                width: .76rem;
                text-align: center;
                .icon-sousuo{
                    color:#bababa;
                }
            }
            input{
                height: 100%;
                width: 80%;
                &::placeholder{
                    color: #bababa;
                }
            }
        }
        .hidden{
            width: 34%;
            text-align: center;
            line-height: .6rem;
            color: #bababa;
            input{
                outline: none;
            }
        }
    }
    // 资产列表
    .assets-list{
        position: absolute;
        left: 0;
        bottom: 0;
        top: 3.6rem;
        width: 100%;
        background: #f2f2f2;
        z-index: -10;
        .list{
            margin-left: .2rem;
            margin-right: .2rem;
            .btc-list{
                height:2.42rem;
                border-radius: 0.1rem;
                margin-bottom: .2rem;
                background: @main-cor;
                .btc-name{
                    height: 1.54rem;
                    border-top-left-radius:.1rem; 
                    border-top-right-radius:.1rem; 
                    background: #fff;
                    .btc{
                        width: 50%;
                        .btc-logo{
                            width: 1.12rem;
                            height: 1.54rem;
                            line-height: 1.54rem;
                            text-align: center;
                            img{
                                width: .72rem;
                                height: .72rem;
                            }
                        }
                        .btc-frost{
                            padding-top: .42rem;
                            p{
                                font-size: .26rem;
                                color: #3e3e3e;
                            }
                            .frost{
                                color: #b9b9b9;
                                font-size: .24rem;
                            }
                        }
                    }
                    .btc-rmb{
                        width: 50%;
                        padding-top: .42rem;
                        text-align: right;
                        padding-right: .2rem;
                        p{
                            height: .6rem;
                            line-height: .6rem;
                            color: #444444;
                            font-size: .26rem;
                            overflow: hidden;
                        }
                        .convert{
                            height: .4rem;
                            line-height: .4rem;
                            color: #b9b9b9;
                            font-size: .24rem;
                            overflow: hidden;
                        }
                    }
                }
                .pay{
                    height: .88rem;
                    background:#fff;
                    padding-top: .28rem;
                    padding-bottom: .2rem;
                    border-top: 1px solid @bord-col;
                    border-bottom-left-radius: .1rem;
                    border-bottom-right-radius: .1rem;
                    .coin{
                        width: 33.33%;
                        text-align: center;
                        border-right: 1px solid @bord-col;
                        font-size: .28rem;
                        color: #999;
                        &:last-child{
                            border: none;
                        }
                        .iconfont{
                            font-size: .36rem
                        }
                        .icon-zhangdan{
                            font-size: .28rem
                        }
                    }
                }
            }
        }
    }
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}
</style>