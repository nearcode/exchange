<template>
    <!-- 全部提现记录 -->
    <scroll class="allRecord">
        <div class="record-list">
            <div class="list jus-b" v-for="item in allList" @click="toBillingDetail(item)">
                <!-- 币种 -->
                <div class="img-btc">
                    <img src="./images/pay.png" v-if="item.type == 1">
                    <img src="./images/withdraw.png" v-else>
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
</template>

<script>
import Scroll from '@/common/scroll/scroll'
export default {
    // 全部记录
    name:'allRecord',
    data(){
        return{
            // 所有提现/充值记录列表
            allList:[],
            coin:this.$route.query.coin
        }
    },
    mounted(){
        this.$api.user.getAllRecord(this.coin).then(res =>{
            this.allList = res.historyList
        })
        console.log(this.coin)
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
    .allRecord{
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
