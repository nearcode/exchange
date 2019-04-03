<template>
<transition name="slide">
    <!-- 交易记录 -->
    <div class="record">
        <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.tradingRecord')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 交易列表 -->
        <scroll class="record-list">
            <div class="allList">
                <div class="list" v-for="item in recordList" :key="item">
                    <div class="record-txt jus-b">
                        <div class="record-c2c">
                            <div class="bas">
                                <span :class="{red:item.type==1, green:item.type==-1}">{{item.type==1?$t("deal.Buy"):$t("deal.Sale")}}C2C</span>
                            </div>
                            <div class="time">
                                <span>{{item.date|toDate}}</span>
                            </div>
                        </div>
                        <div class="record-message">
                            <div class="record-price">
                                <span>￥{{item.price * item.amount}}</span>
                            </div>
                            <div class="detail">
                                <span>{{$t('deal.Amount')}}</span>
                                <span>{{item.amount}}</span>
                                <span>{{$t('wallet.unitPrice')}}</span>
                                <span>{{item.type==1?'1':'0.99'}}</span>
                            </div>
                            <div class="payment-info">
                                <span @click="toPayment(item)">{{$t('wallet.paymentInformation')}}</span>
                                <span style="color:#b4b4b4" v-if="item.result != -1">|</span>
                                <span v-if="item.result == 0">{{$t('wallet.pending')}}</span>
                                <span v-if="item.result == 1">{{$t('wallet.success')}}</span>
                                <span v-if="item.result == 2">{{$t('wallet.canceledCanc')}}</span>
                                <span v-if="item.result == 4">{{$t('wallet.inhand')}}</span>
                                <span v-if="item.result == 5">{{$t('wallet.overdue')}}</span>
                                <span v-if="item.result == 7">{{$t('wallet.ToTransfer')}}</span>
                                <span v-if="item.result == -1">{{$t('wallet.waitConfirm')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</transition>
</template>

<script>
    import pubHead from '@/common/head/head.vue';
    import Scroll from "@/common/scroll/scroll";
export default {
    // 交易记录
    name:'Record',
    data(){
        return{
            // 交易记录列表
            recordList:[],
            page:1,//页数
            limit:6,
        }
    },
     // 声明组件
    components :{
        pubHead,
        Scroll
    },
    
    activated() {
        // isUseCache为false时才重新刷新获取数据
        // 因为对record使用keep-alive来缓存组件，所以默认是会使用缓存数据的         
        if(!this.$route.meta.isUseCache){
            this.getRecords();// 获取数据的函数
        }
        // 通过这个控制刷新
        this.$route.meta.isUseCache = false;
    },
    beforeRouteEnter (to, from, next) {
        if (from.name == 'Payment') {
            to.meta.isUseCache = true;
        }
        next();
    },

    methods:{
        // 跳转到付款信息
        toPayment(item){
            // if(item.result != -1){
                this.$router.push({
                    path:'/wallet/c2c/record/payment',
                    query:item
                })
            // }
        },
        // 获取记录
        getRecords(){
            this.$api.user.getRecord({
                p:1,
                result:'all'
            }).then(res =>{
                this.recordList = res.data;
            })
        }
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */  
@import url('~@/style/mixin');
.record{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @pub-bg;
    z-index: 15;
    overflow: hidden;
    .record-list{
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0.88rem;
        width: 100%;
        background: @pub-bg;
        .list{
            margin-left: .2rem;
            margin-right: .2rem;
            margin-top: .2rem;
            .record-txt{
                height: 2.26rem;
                border-radius: .1rem;
                border: 1px solid @bord-col;
                box-shadow: 0 0 1px 1px @bord-col;
                padding-left: 0.2rem;
                padding-right: 0.2rem;
                background: #fff;
                .record-c2c{
                    width: 50%;
                    height: 100%;
                    .bas{
                        height: .86rem;
                        line-height: .86rem;
                        color: #e10b13;
                        font-weight: bold;
                    }
                    .time{
                        color: #b8b8b8;
                    }
                }
                .record-message{
                    width: 50%;
                    height: 100%;
                    text-align: right;
                    .record-price{
                        height: .86rem;
                        line-height: .86rem;
                        color: #222222;
                        font-weight: bold;
                    }
                    .detail{
                        color: #d4cec4;
                    }
                    .payment-info{
                        height: .86rem;
                        line-height: .86rem;
                        &>span:first-child{
                            color: #e10b13;
                            font-weight: bold;
                        }
                        &>span:last-child{
                            color: #1ebd5b;
                            font-weight: bold;
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
.slide-enter-active, &.slide-leave-active{
	transition: all .3s
}
.slide-enter, &.slide-leave-to{
	transform: translate3d(-100%, 0, 0)
}
</style>
