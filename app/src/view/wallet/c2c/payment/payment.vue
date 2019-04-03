<template>
<transition name="slide">
    <!-- 付款信息 -->
    <div class="payment">
        <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.paymentInformation')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 付款信息详情 -->
        <div class="payment-info">
            <div class="detail" v-if="datas.type == 1">
                <!-- 汇款单 -->
                <div class="money-order">
                    <span>{{$t('wallet.moneyOrder')}}</span>
                </div>
                <!-- 金额 -->
                <div class="sum">
                    <span>￥{{datas.amount*datas.price}}</span>
                </div>
                <!-- 状态 -->
                <div class="state">
                    <span v-if="datas.result == 0">{{$t('wallet.pending')}}</span>
                    <span v-if="datas.result == 1">{{$t('wallet.success')}}</span>
                    <span v-if="datas.result == 2">{{$t('wallet.CancelWithdrawal')}}</span>
                    <span v-if="datas.result == 4">{{$t('wallet.inhand')}}</span>
                    <span v-if="datas.result == 5">{{$t('wallet.overdue')}}</span>
                    <span v-if="datas.result == 7">{{$t('wallet.ToTransfer')}}</span>
                    <span v-if="datas.result == -1">{{$t('wallet.audit')}}</span>
                </div>
            </div>
            <!-- 买入详情 -->
            <div class="in-detail jus-b" v-if="datas.type == 1">
                <div class="detail-txt">
                    <!-- 收款方户名 -->
                    <div class="payee-name payee">
                        <span>{{$t('wallet.name')}}</span>
                    </div>
                    <!-- 收款方开户行 -->
                    <div class="payee-obank payee">
                        <span>{{$t('wallet.oBnak')}}</span>
                    </div>
                     <!-- 收款方手机号 -->
                    <div class="payee-obank payee">
                        <span>{{$t('wallet.mobile')}}</span>
                    </div>
                    <!-- 收款方账号 -->
                    <div class="payee-num payee">
                        <span>{{$t('wallet.number')}}</span>
                    </div>
                    <!-- 汇款时备注内容 -->
                    <div class="remark payee">
                        <span>{{$t('wallet.txt')}}</span>
                    </div>
                </div>
                <div class="detail-name">
                    <!-- 收款方户名 -->
                    <div class="pname payees">
                        <span>{{datas.merchant.truename}}</span>
                    </div>
                    <!-- 收款方开户行 -->
                    <div class="pobank payees">
                        <span>{{datas.merchant.bankCard.bank}}</span>
                    </div>
                    <!-- 收款方手机号 -->
                    <div class="pobank payees">
                        <span>{{datas.merchant.mobile}}</span>
                    </div>
                    <!-- 收款方账号 -->
                    <div class="pnum payees">
                        <span>{{datas.merchant.bankCard.address}}</span>
                    </div>
                    <!-- 汇款时备注内容 -->
                    <div class="remark-txt payees">
                        <span style="color:#dd2926">{{datas.id}}</span>
                        <span>{{$t('wallet.must')}}</span>
                    </div>
                </div>
            </div>
            <!-- 卖出详情 -->
            <div class="sellDetail in-detail jus-b" v-if="datas.type == -1">
                <div class="detail-txt">
                    <!-- 服务商户名 -->
                    <div class="payee-name payee">
                        <span>{{$t('wallet.service')}}</span>
                    </div>
                    <!-- 服务商手机号 -->
                    <div class="payee-obank payee">
                        <span>{{$t('wallet.snum')}}</span>
                    </div>
                    <!-- 转账金额 -->
                    <div class="payee-num payee">
                        <span>{{$t('wallet.tacount')}}</span>
                    </div>
                    <!-- 状态 -->
                    <div class="payee-num payee">
                        <span>{{$t('wallet.state')}}</span>
                    </div>
                </div>
                <div class="detail-name">
                    <!-- 服务商户名 -->
                    <div class="pname payees">
                        <span>{{datas.merchant.truename}}</span>
                    </div>
                    <!-- 服务商手机号 -->
                    <div class="pobank payees">
                        <span>{{datas.merchant.mobile}}</span>
                    </div>
                    <!-- 转账金额 -->
                    <div class="pnum payees">
                        <span style="color:red">{{datas.amount*datas.price}}</span>
                    </div>
                    <!-- 状态 -->
                    <div class="payee-num payees" style="color:#f4d46f">
                        <span v-if="datas.result == 0">{{$t('wallet.pending')}}</span>
                        <span v-if="datas.result == 1">{{$t('wallet.success')}}</span>
                        <span v-if="datas.result == 2">{{$t('wallet.canceledCanc')}}</span>
                        <span v-if="datas.result == 4">{{$t('wallet.inhand')}}</span>
                        <span v-if="datas.result == 5">{{$t('wallet.overdue')}}</span>
                        <!-- <span v-if="datas.result == 7">{{$t('wallet.ToTransfer')}}</span> -->
                        <span v-if="datas.result == -1">{{$t('wallet.audit')}}</span>
                    </div>
                </div>
            </div>
            <div >
                <!-- 取消订单 -->
                <div class="cancel" v-if="datas.result==-1">
                    <mt-button  @click="cancel()" class="btn" :disabled="disabled">
                        <span>{{$t('wallet.cancel')}}</span>
                    </mt-button>
                </div>
                <!-- 已转账 -->
                <div class="transfer" v-if="datas.result == 7">
                    <mt-button  @click="transfer()" class="btn" :disabled="disabled">
                        <span>{{$t('wallet.HaveTransfer')}}</span>
                    </mt-button>
                </div>
                <!-- 返回 -->
                <div class="back" @click="back">
                    <mt-button  @click="back()" class="btn" :disabled="disabled">
                        <span>{{$t('wallet.back')}}</span>
                    </mt-button>
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import pubHead from '@/common/head/head.vue';
export default {
    // 付款信息
    name:'Payment',
    data(){
        return{
            datas:this.$route.query,
            disabled:false,//让button按钮失效
            is:true,
        }
    },
     // 声明组件
    components :{
        pubHead,
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        //取消订单
        cancel(){
            this.disabled = false;
            this.$api.user.getCancel({
                id:this.$route.query._id
            }).then(res =>{
                this.disabled = true;
                this.datas.result = 2;
                this.$toast('订单已取消')
            }).catch(err =>{
                if(err.data.error) this.$toast('5分钟内不允许取消')
                this.disabled = false;
            })
        },
        //已转账
        transfer(){
            this.disabled = false;
            this.$api.user.getTransfer({
                id:this.$route.query._id
            }).then(res =>{
                this.disabled = true;
                this.datas.result = 4;
                this.$toast('订单已提交处理');
            }).catch(err =>{
                if(err.data.message) this.$toast(this.$t(err.data.message));
                this.disabled = false;
            })
        }
    }
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.payment{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @pub-bg;
    z-index: 20;
    // 付款信息详情
    .payment-info{
        margin-left: .2rem;
        margin-right: .2rem;
        border-bottom: 1px solid #f1f1f1;
        .detail{
            height: 2.26rem;
            text-align: center;
            padding-top: .2rem;
            line-height: .66rem;
            // 汇款单
            .money-order{
                font-size: .34rem;
                color: #2e2e2e;
            }
            // 金额
            .sum{
                color: #e8000a;
                font-size: .3rem;
            }
            // 状态
            .state{
                color: @main-cor;
                font-size: .34rem;
            }
        }
        // 详情
        .in-detail{
            border-bottom: 1px solid #f1f1f1;
            .detail-txt{
                width: 50%;
                height: 100%;
                .payee{
                    height: 1rem;
                    line-height: 1rem;
                    color: #b5b5b5;
                }
            }
            .detail-name{
                width: 50%;
                height: 100%;
                .payees{
                    height: 1rem;
                    text-align: right;
                    line-height: 1rem;
                    color: #222;
                    font-weight: bold;
                }
            }
        }
        .back,.cancel,.transfer{
            height: .88rem;
            margin: .3rem .2rem;
            border-radius: .1rem;
            text-align: center;
            line-height: .88rem;
            color: #656b79;
            font-size: .4rem;
            .btn{
                width: 100%;
                background: @main-cor;
                color:#fff;
            }
        }
        .cancel{
            .btn{
                width: 100%;
                background: red;
                color:#fff;
            }
        }
        .transfer{
            .btn{
                width: 100%;
                background: #32cd32;
                color:#fff;
            }
        }
    }
}
.slide-enter-active, &.slide-leave-active{
	transition: all .3s
}
.slide-enter, &.slide-leave-to{
	transform: translate3d(-100%, 0, 0)
}
</style>
