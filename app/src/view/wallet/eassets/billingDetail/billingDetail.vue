<template>
    <div class="detail">
        <!-- 头部 -->
        <pub-head 
            title="账单详情" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pub-head>
        <!-- 详情 -->
        <div class="pay-detail">
            <div class="check">
                <!-- 数量 -->
                <div class="amount">
                    <div class="name">
                        <span>{{datas.coin}}</span>
                        <span v-if="datas.type == 1">{{$t('wallet.Recharge')}}:</span>
                        <span v-if="datas.type == -1">{{$t('wallet.WithdrawDeposit')}}:</span>
                    </div>
                    <div class="num">
                        <span>{{datas.amount}}</span>
                    </div> 
                </div>
                <!-- 操作方式 -->
                <div class="mode comon">
                    <span>{{$t('wallet.OperatingMode')}}</span>
                    <span v-if="datas.type == 1">{{$t('wallet.Recharge')}}</span>
                    <span v-if="datas.type == -1">{{$t('wallet.WithdrawDeposit')}}</span>
                </div>
                <!-- 交易单号 -->
                <!-- <div class="seat">
                    <span>交易单号:</span>
                    <input type="text" readonly v-model="datas._id" ref="code">
                    <span @click="copys()">复制</span>
                </div> -->
                <!-- 交易ID -->
                <div class="seat-id comon jus-b">
                    <span>{{$t('wallet.DealID')}}</span>
                    <input type="text" readonly v-model="datas.tx_hash" ref="cid">
                    <span @click="copy()">{{$t('wallet.Copy')}}</span>
                </div>
                <!-- 到账地址 -->
                <div class="address comon">
                    <span>{{$t('wallet.ToAddress')}}</span>
                    <input type="text" readonly v-model='datas.address'>
                </div>
                <!-- 操作时间 -->
                <div class="timer comon">
                    <span>{{$t('wallet.OperationTime')}}</span>
                    <span style="color:#ccc">{{datas.date | date}}</span>
                    <span style="color:#ccc">{{datas.date | time}}</span>
                </div>
                <!-- 实际到账 -->
                <div class="account comon">
                    <span>{{$t('wallet.ToAccount')}}</span>
                    <span style="color:#358270;font-weight:bold">{{datas.actual}}</span>
                    <span style="color:#358270;font-weight:bold">{{datas.coin}}</span>
                </div>
                <!-- 手续费 -->
                <div class="charge comon">
                    <span>{{$t('wallet.CommissionCharges')}}</span>
                    <span style="color:#358270;font-weight:bold">{{datas.fee}}</span>
                    <span style="color:#358270;font-weight:bold">{{datas.coin}}</span>
                </div>
                <!-- 提现状态 -->
                <div class="state comon">
                    <span v-if="datas.type == 1">{{$t('wallet.WithdrawalState')}}</span>
                    <span v-if="datas.type == -1">{{$t('wallet.RechargeState')}}</span>
                    <span v-if="datas.result == -1" style="color:#358270;">待审核</span>
                    <span v-if="datas.result == 0" style="color:#358270;">处理中</span>
                    <span v-if="datas.result == 1" style="color:#358270;">成功</span>
                    <span v-if="datas.result == 2" style="color:#358270;">取消订单</span>
                    <span v-if="datas.result == 3" style="color:#358270;">错误</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 引入头部
import pubHead from '@/common/head/head.vue';
export default {
    name:'BillingDetail',
    data(){
        return{
            datas:this.$route.params
        }
    },
    mounted(){
        console.log(this.datas)
    },
    methods:{
        // 复制
        copy(){
            this.$refs.cid.select();
            document.execCommand("Copy");
        }
    },
    // 过滤
    filters:{
        date(val) {
            var date = new Date(val)
            return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
        },
        time(val) {
            var date = new Date(val)
            return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()			
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
.detail{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: @pub-bg;
    z-index: 25;
    .pay-detail{
        .check{
            padding-left: .4rem;
            padding-right: .4rem;
            background: #fff;
            .amount{
                height: 1.4rem;
                line-height: .7rem;
                border-bottom: 1px solid @bord-col;
                font-weight: bold;
                font-size: .3rem;
                .num{
                    font-size: .4rem;
                }
            }
            .comon{
                height: 1rem;
                line-height: 1rem;
                border-bottom: 1px solid @bord-col;
                input{
                    width: 68%;
                    background: #fff;
                    padding-left: .4rem;
                    color: #ccc;
                    &>input::placeholder{
                        color: #ccc;
                    }
                }
            }
            .seat-id span:nth-of-type(2){
                display: inline-block;
                width: 1rem;
                height: .5rem;
                border: 1px solid @bord-col;
                border-radius: .3rem;
                line-height: .5rem;
                text-align: center;
                margin-top: .2rem;
                color: #e25744;
            }
        }
    }
}
</style>
