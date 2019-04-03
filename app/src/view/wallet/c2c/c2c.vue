<template>
    <!-- C2C -->
    <div class="c2c">
        <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.C2CDeal')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor"
            >
            <div class="rights" style="color:#fff;font-size:.32rem" @click="toRecord()">
                <span>{{$t('wallet.tradingRecord')}}</span>
            </div>
        </pubHead>

        <div class="buySell">
            <!-- 买入、卖出 -->
            <div class="allBuySell jus-b">
                <!-- 买入 -->
                <div class="buy">
                    <div class="but-QC">
                        <span>{{$t('deal.Buy')}}{{baseCoin}}</span>
                    </div>
                    <!-- 单价 -->
                    <div class="unit-price jus-b">
                        <input type="text" :placeholder='buyPrice' v-model.number="buyPrice" readonly>
                        <div class="unit">
                            <span>CNY</span>
                        </div>
                    </div>
                    <!-- 买入量 -->
                    <div class="unit-price purchases jus-b">
                        <input type="text" :placeholder="$t('wallet.purchases')" v-model.number="buyNum">
                        <div class="unit">
                            <span>{{baseCoin}}</span>
                        </div>
                    </div>
                    <!-- 总价 -->
                    <div class="total-price">
                        <span>{{$t('wallet.need')}} <i>{{number}}</i> CNY</span>
                    </div>
                    <!-- 立即买入 -->
                    <div class="promptly" @click="trade(1)" v-if="!isBuy">
                        <span>{{$t('wallet.ToBuyImmediately')}}</span>
                    </div>
                    <!-- 立即买入 -->
                    <div class="promptly" v-if="isBuy">
                        <span>{{$t('wallet.ToBuyImmediately')}}</span>
                    </div>
                </div>
                <!-- 卖出 -->
                <div class="sell">
                    <div class="sell-QC">
                        <span>{{$t('deal.Sale')}}{{baseCoin}}</span>
                    </div>
                    <!-- 单价 -->
                    <div class="sell-unit jus-b">
                        <input type="text" :placeholder="sellPrice" v-model.number="sellPrice" readonly>
                        <div class="units">
                            <span>CNY</span>
                        </div>
                    </div>
                    <!-- 卖入量 -->
                    <div class="sell-unit inThe jus-b">
                        <input type="text" :placeholder="$t('wallet.SellQuantity')" v-model.number="sellNum">
                        <div class="units">
                            <span>{{baseCoin}}</span>
                        </div>
                    </div>
                    <!-- 总价 -->
                    <div class="all-price">
                        <span>{{$t('wallet.need')}} <i>{{count}}</i> CNY</span>
                    </div>
                    <!-- 立即卖出 -->
                    <div class="promptly" @click="trade(-1)" v-if="!isSell">
                        <span>{{$t('wallet.ImmediatelySell')}}</span>
                    </div>
                    <!-- 立即卖出 -->
                    <div class="promptly" v-if="isSell">
                        <span>{{$t('wallet.ImmediatelySell')}}</span>
                    </div>
                </div>
            </div>
            <!-- 温馨提示 -->
            <div class="warm-prompt">
                <div class="warm">
                    <span>{{$t('wallet.clue')}}</span>
                </div>
                <p>1、{{$t('wallet.buying')}}</p>
                <p>2、{{$t('wallet.cashDeposit')}}</p>
                <p>3、{{$t('wallet.alipay')}}</p>
                <p>4、{{$t('wallet.processingTime')}}</p>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
export default {
    // c2c
    name:'C2C',
    data(){
        return{
            baseCoin:localStorage.baseCoin,//钱
            buyPrice: 0,//买入的价格
            sellPrice: 0,
            buyNum:'',//买入的数量
            sellPrice:1-localStorage.merchantFee,//卖出的价格
            sellNum:'',//卖出的数量
            isSell:false,//是否点击卖出
            isBuy:false,//是否点击买入
        }
    },
    // 声明组件
    components :{
        pubHead,
    },
    created() {
        this.$api.user.getC2CInfo().then(res=>{
            if (res.data){
                this.buyPrice = res.data.buyPrice;
                this.sellPrice = res.data.sellPrice;
            }
        })
    },
    methods:{
        // 跳转到交易记录
        toRecord(){
            this.$router.push('/wallet/c2c/record')
        },
        trade(type){
            //type类型等于1为买入，-1为卖出
            if(type == 1){
                this.isBuy = true;
            }else{
                this.isSell = true;
            }
            this.$api.user.getC2C({
                coin: 'CNY',
                price: type == 1?this.buyPrice:this.sellPrice,
                amount:type == 1?this.buyNum:this.sellNum,
                type:type
            }).then(res =>{
                if(type == 1){
                    this.isBuy = false;
                    this.$router.push({
                        path:'/wallet/c2c/record',
                        query:res
                    })
                }else{
                    this.$toast(this.$t('wallet.depositsuccess'));
                    this.isSell = false;
                }
            }).catch(err =>{
                if(err && err.data.message) this.$toast(this.$t('error.'+err.data.message));
                this.isBuy = false;
                this.isSell = false;
            })
        }
    },
    //计算
    computed:{
        //买入时需要多少CNY
        number(){
            var num = this.buyPrice * this.buyNum
			return num
        },
        //卖出时需要多少CNY
       count(){
            var res = this.sellPrice * this.sellNum
            return res
		},
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
    .c2c{
        width: 100%;
        height: 100%;
        background: @pub-bg;
        z-index: 10;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        .buySell{
            margin: 0.2rem;
            // 买入、卖出
            .allBuySell{
                height: 4.78rem;
                background: #fff;
                border-radius: .1rem;
                box-shadow: 1px 1px 2px 2px @bord-col;
                // 买入
                .buy{
                    width: 50%;
                    height: 100%;
                    border-right: 1px solid @bord-col;
                    margin-left: .24rem;
                    padding-right: .14rem;
                    .but-QC{
                        height: .9rem;
                        line-height: .9rem;
                        font-size: .28rem;
                        color: #535353;
                    }
                    // 单价
                    .unit-price{
                        height: .74rem;
                        border-radius: .1rem;
                        border: 1px solid @bord-col;
                        margin-bottom: .2rem;
                        background: #fffdfa;
                        input{
                            height: .62rem;
                            width: 70%;
                            background: #fff;
                            border-radius: .1rem;
                            padding-left: .24rem;
                            &::placeholder{
                                color: #ff433f;
                                font-size: .24rem;
                            }
                        }
                        .unit{
                            width: 30%;
                            height: .74rem;
                            line-height: .76rem;
                            text-align: center;
                            color: #b8b7b7;
                        }
                    }
                    // 买入量
                    .purchases{
                        margin-bottom: 0;
                        input{
                            &::placeholder{
                                color: #b8b7b7;
                            }
                        }
                    }
                    // 总价
                    .total-price{
                        height: 1.2rem;
                        line-height: 1.2rem;
                        font-size: .26rem;
                        overflow: hidden;
                        span{
                            i{
                                color: #ff433f;
                            }
                        }
                    }
                    // 立即买入
                    .promptly{
                        height: .74rem;
                        border-radius: .1rem;
                        border: 1px solid #ff433f;
                        text-align: center;
                        line-height: .76rem;
                        color: #ff433f;
                        background: #fffdfa;
                    }
                }
                // 卖出
                .sell{
                    width: 50%;
                    height: 100%;
                    margin-left: .24rem;
                    padding-right: .14rem;
                    .sell-QC{
                        height: .9rem;
                        line-height: .9rem;
                        font-size: .28rem;
                        color: #535353;
                    }
                    // 卖出单价
                    .sell-unit{
                        height: .74rem;
                        border-radius: .1rem;
                        border: 1px solid @bord-col;
                        margin-bottom: .2rem;
                        background: #fffdfa;
                        input{
                            height: .62rem;
                            width: 70%;
                            background: #fff;
                            border-radius: .1rem;
                            padding-left: .24rem;
                            &::placeholder{
                                color: #49c223;
                                font-size: .24rem;
                            }
                        }
                        .units{
                            width: 30%;
                            height: .74rem;
                            line-height: .76rem;
                            text-align: center;
                            color: #b8b7b7;
                        }
                    }
                    // 卖入量
                    .inThe{
                        margin-bottom: 0;
                        input{
                            &::placeholder{
                                color: #b8b7b7;
                            }
                        }
                    }
                    // 总价
                    .all-price{
                        height: 1.2rem;
                        line-height: 1.2rem;
                        font-size: .26rem;
                        overflow: hidden;
                        span{
                            i{
                                color: #49c223;
                            }
                        }
                    }
                    // 立即卖出
                    .promptly{
                        height: .74rem;
                        border-radius: .1rem;
                        border: 1px solid #49c223;
                        text-align: center;
                        line-height: .76rem;
                        color: #49c223;
                        background: #fffdfa;
                    }
                }
            }
            // 温馨提示
            .warm-prompt{
                height:5.52rem;
                border-radius: .1rem;
                background: #fff;
                box-shadow: 1px 1px 2px 2px @bord-col;
                margin-top: .2rem;
                padding-left: .26rem;
                padding-right: 0.26rem;
                line-height: .4rem;
                color: #999;
                font-size: .28rem;
                overflow: scroll;
                .warm{
                    height: .84rem;
                    line-height: .84rem;
                }
            }
        }
    }
    .slideInRight, .slideOutRight{
		animation-duration: 300ms;
	}
</style>
