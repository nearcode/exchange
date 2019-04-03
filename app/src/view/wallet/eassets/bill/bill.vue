<template>
    <!-- 提现记录 -->
    <div class="bill">
        <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.RechargeAndWithdrawRecords')" 
            titleColor="#fff"
            :isbackShow = 'true'
            leftColor="#fff"
            bgColor="#3b82de">
        </pubHead>
        <!-- 记录 -->
        <div class="record">
            <div class="tab-item jus-a">
                <!-- 全部记录 -->
                <router-link :to="{path:'/wallet/eassets/bill/allRecord',query:{coin:this.coin}}" class="tab-link" replace>
                    <span>{{$t('wallet.CompleteDocumentation')}}</span>
                </router-link>
                <!-- 充值记录 -->
                <router-link :to="{path:'/wallet/eassets/bill/rechargeRecord',query:{coin:this.coin,type:1}}" class="tab-link" replace>
                    <span>{{$t('wallet.RechargeRecord')}}</span>
                </router-link>
                <!-- 提现记录 -->
                <router-link :to="{path:'/wallet/eassets/bill/withdrawalRecord',query:{coin:this.coin,type:-1}}" class="tab-link" replace>
                    <span>{{$t('wallet.WithdrawalRecord')}}</span>
                </router-link>
            </div>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import pubHead from '@/common/head/head.vue';
export default {
    // 提现记录
    name:'WithdrawalRecord',
    data(){
        return{
            coin:this.$route.query.coin,//币种
        }
    },
    // 声明组件
    components:{
        pubHead
    }
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.bill{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #f6f6f6;
    z-index: 20;
    .record{
        .tab-item{
            height: .6rem;
            line-height: .6rem;
            background: #fff;
            border-bottom: 1px solid #ccc;
            .tab-link{
                &.router-link-active{
                    border-bottom: 1px solid @main-cor;
                    color: @main-cor;
                }
            }
        }
    }
}
</style>
