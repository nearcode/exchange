<template>
    <transition name="slide">
        <!-- 充值记录 -->
        <scroll class="rechargeRecord">
            <div class="record-list">
                <div class="list jus-b" v-for="item in rechargeList" @click="toBillingDetail(item)">
                    <!-- 币种 -->
                    <div class="img-btc">
                        <img src="./images/pay.png">
                        <span>{{item.coin}}</span>
                    </div>
                    <!-- 金额 -->
                    <div class="sum">
                        <span>{{item.amount}}</span>
                    </div>
                    <!-- 状态 -->
                    <div class="state">
                        <span v-if="item.result == -1">{{$t('wallet.ToAudit')}}</span>
                        <span v-if="item.result == 0">{{$t('wallet.BeingProcessed')}}</span>
                        <span v-if="item.result == 1">{{$t('wallet.Success')}}</span>
                        <span v-if="item.result == 2">{{$t('wallet.CancellationOfOrder')}}</span>
                        <span v-if="item.result == 3">{{$t('wallet.Error')}}</span>
                    </div>
                    <!-- 时间 -->
                    <div class="timer">
                        <p>{{item.date | toYear}}</p>
                        <p>{{item.date | timer}}</p>
                    </div>
                </div>
            </div>
        </scroll>
    </transition>
</template>

<script>
import Scroll from '@/common/scroll/scroll'
export default {
    // 充值记录
    name:'RechargeRecord',
    data(){
        return{
            rechargeList:[],//充值记录
            coin:this.$route.query.coin,//币种
        }
    },
    mounted(){
        console.log(this.coin)
        this.$api.user.getDepositRecord(this.coin).then(res =>{
            this.rechargeList = res.historyList;
        })
    },
     methods:{
        //跳转到账单详情
        toBillingDetail(item){
            this.$router.push({
                name:'BillingDetail',
                params:item
            })
        }
    },
    // 声明组件
    components:{
        Scroll
    }
}
</script>

<style lang="less" scoped>
    .rechargeRecord{
        position: absolute;
		top: 1.46rem;
		bottom: 0;
		z-index: 25;
		width: 100%;
        background: #f6f6f6;
        overflow: hidden;
        .record-list{
            margin: .3rem;
            .list{
                height: .8rem;
                line-height: .8rem;
                background: #fff;
                border-radius: .1rem;
                padding-left: .2rem;
                padding-right: .2rem;
                margin-bottom: .3rem;
                // 币种
                .img-btc{
                    img{
                        width: .5rem;
                        height: .5rem;
                    }
                }
                // 状态
                .state{
                    color: #00C6B0;
                }
                // 时间
                .timer{
                    text-align: center;
                    line-height: .4rem;
                }
            }
        }
    }
.slide-enter-active, .slide-leave-active{
	transition: all .3s
}
.slide-enter, .slide-leave-to{
	transform: translate3d(100%, 0, 0)
}
</style>
