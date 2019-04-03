<template>
    <!-- 充币 -->
    <div class="changeMoney">
        <!-- 头部 -->
        <pub-head 
            :title="$t('wallet.RechargeToTheQRCodeAddress')"
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor"
        >
            <router-link tag="div" class="menu" style="color:#fff" :to="{path:'/wallet/eassets/bill/allRecord',query:{coin:this.coin}}">
                <span class="iconfont icon-zhangdan"></span>
            </router-link>
        </pub-head>
        <!-- 复制、扫描二维码 -->
        <div class="matter">
            <!-- 复制串码 -->
            <div class="copy-txt jus-b">
                <!-- 定位icon -->
                <div class="location">
                    <span class="iconfont icon-dingwei"></span>
                </div>
                <!-- 串码 -->
                <input type="text" v-model="address" readonly ref="code">
                <!-- 复制按钮 -->
                <div class="copy" @click="copy()">
                    <span>{{$t('wallet.Copy')}}</span>
                </div>
            </div>
            <!-- 二维码 -->
            <div class="qrcode">
                <img :src="qrcode">
                <p>{{$t('wallet.ScanQRCode')}}</p>
                <p>{{$t('wallet.GetsTheRechargeAddress')}}</p>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import pubHead from '@/common/head/head.vue';
export default {
    // 充币
    name:'ChangeMoney',
    data(){
        return{
            address:'',//地址码
            coin:this.$route.query.coin,//币种
            qrcode:'',//二维码
        }
    },
    // 声明组件
    components:{
        pubHead
    },
    methods:{
        //复制
        copy(){
            this.$refs.code.select();
            document.execCommand('Copy');
        }
    },
    mounted(){
        this.$api.user.getCreateWalletAddress({
            coin:this.coin
        }).then(res =>{
            this.address = res.address;
            this.qrcode = this.$api.user.getQrcodeAddress(this.address)
        }).catch(err =>{
            if(err && err.data.message){
                this.$toast(this.$t('error.'+err.data.message))
            }
        })
    }
}
</script>
<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.changeMoney{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #f6f6f6;
    z-index: 15;
    // 复制、扫描二维码
    .matter{
        background: #fff;
        padding-bottom: .6rem;
        // 复制串码
        .copy-txt{
            height: 1rem;
            line-height: 1rem;
            padding-left: .4rem;
            padding-right: 0.4rem;
            border-bottom: 1px solid #ccc;
            input{
                width: 76%;
                background: #fff;
            }
            .copy{
                width: 1rem;
                height: .6rem;
                text-align: center;
                line-height: .6rem;
                border-radius: .3rem;
                border: 1px solid @main-cor;
                margin-top: .2rem;
                color: @main-cor;
            }
        }
        // 二维码
        .qrcode{
            text-align: center;
            margin-top: .6rem;
            img{
                width: 2rem;
                height: 2rem;
            }
        }
    }
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}
</style>
