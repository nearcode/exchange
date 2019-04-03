<template>
    <!-- 银行卡管理 -->
    <div class="bank">
         <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.Bmanagement')" 
           :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 添加银行卡 -->
        <div class="addCard">
            <div class="card jus-b" @click="toAddBank()" v-if="!banks.bank">
                <div class="txt">
                    <span>{{$t('wallet.AddCard')}}</span>
                </div>
                <input type="text" disabled>
                <div class="icon">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 已添加 -->
            <div class="card jus-b" @click="toAddBank(banks)" v-if="banks.bank">
                <div class="text">
                    <span>{{banks.bank}}</span>
                    <span>{{banks.address}}</span>
                </div>
                <div class="icon">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 提示 -->
            <div class="hint" v-if="!banks.bank">
                <span>{{$t('wallet.NoCard')}}</span>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import pubHead from '@/common/head/head.vue'
export default {
    name:'BankCard',
    data(){
        return{
            allBank:[],//银行卡信息
            bank:'',//银行名字
            address:'',//银行卡号
            isAdd:false,
            isCard:false,//是否添加了银行卡
            banks: {}
        }
    },
    // 声明组件
    components :{
        pubHead,
    },
    created(){
        this.banks = this.$common.getJsonData(localStorage.banks);
        console.log(this.banks)
        // if(this.banks.bank) {
        //     return;
        // }else {
        //     this.onLoad();
        // }
        this.onLoad();
        if (this.$store.state.truename || localStorage.username) {
            return;
        }else {
            this.$toast('请先实名认证');
            this.$router.replace('/user/certification');
        }
    },
    methods:{
        // 跳转到添加银行卡
        toAddBank(banks){
            this.$router.push({
                name:'AddBank',
                params: banks
            })
            console.log(this.banks)
        },
        onLoad () {
            console.log('11111')
            //获取银行卡信息
            this.$api.user.getBnakCard().then(res =>{
                this.banks = res;
                localStorage.banks = JSON.stringify(res);
                console.log(localStorage.banks)
                this.bank ? this.isAdd = true : this.isAdd = false;
                this.bank ? this.isCard = true : this.isCard = false;
            }).catch(err =>{
                if(err.data.message) this.$toast('error.'+err.data.message);
            })
        }
    }
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
@import url('~@/style/mixin');
.bank{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @pub-bg;
    z-index:15;
    .addCard{
        margin: 0.2rem;
        .card{
            height: .88rem;
            line-height: .88rem;
            background: #fff;
            border-radius: .1rem;
            box-shadow:  1px 1px 1px 1px @bord-col;
            padding-left: .2rem;
            padding-right: .2rem;
            .txt{
                width: 30%;
            }
            input{
                width: 70%;
                background: #fff;
            }
            .icon{
                .icon-arrow-right-copy-copy-copy{
                    color: #d2d2d2;
                }
            }
        }
        .hint{
            margin-top: .2rem;
            height: 2.2rem;
            line-height: 2.2rem;
            text-align: center;
            color: #9e9e9e;
            background: #fff;
            border-radius: .1rem;
            box-shadow: 1px 1px 1px 1px @bord-col;
        }
    }
}

.slideInRight, .slideOutRight{
		animation-duration: 300ms;
	}
</style>
