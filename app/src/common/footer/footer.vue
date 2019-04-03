<template>
    <div class="home">
        <!-- 底部导航按钮 -->
        <footer class="foot f3 border-t jus-a">
            <!-- 首页 -->
            <router-link to="/home" class="nav" :style="{color:this.$route.name == 'Home' ? $config.color.mainCor:$config.color.botCor}">
                <em class="iconfont icon-zhuanjia"></em>
                <span>{{$t('footer.Home')}}</span>
            </router-link>
            <!-- 行情 -->
            <router-link to="/market" class="nav" :style="{color:this.$route.name == 'Market' ? $config.color.mainCor:$config.color.botCor}">
                <em class="iconfont icon-hangqing"></em>
                <span>{{$t('footer.Market')}}</span>
            </router-link>
            <!-- 交易 -->
            <router-link :to="'/deal/buy'" class="nav" :style="{color:this.$route.name == 'Deal' ? $config.color.mainCor:$config.color.botCor}">
                <div class="iconfont icon-jiaoyi"></div>
                <span>{{$t('footer.Deal')}}</span>
            </router-link>
            <!-- 钱包 -->
            <router-link to="/wallet" class="nav" :style="{color:this.$route.name == 'Wallet' ? $config.color.mainCor:$config.color.botCor}">
                <em class="iconfont icon-cunqianguan"></em>
                <span>{{$t('footer.Wallet')}}</span>
            </router-link>
            <!-- 个人 -->
            <router-link to="/user" class="nav" :style="{color:this.$route.name == 'User' ? $config.color.mainCor:$config.color.botCor}">
                <em class="iconfont icon-gerenzhongxinhui"></em>
                <span>{{$t('footer.Personage')}}</span>
            </router-link>
        </footer>
    </div>  
</template>

<script>
export default {
    name:'Home',
    data () {
        return {
            coins:'',//缓存中的当前交易对
        }
    }
    
}
</script>

<style lang="less" scoped>
    /* 引用需要的的公共样式 */
    @import url('../../style/mixin');
    
    .foot {
        width:100%;
        max-width:750px !important;
        background-color: #fff;
        .fixedBottom(1rem,9);
        // .on {
        //     .iconfont {
        //         color: @main-cor;
        //     }
        //     span {
        //         color: @main-cor;
        //     }
        // }
        .iconfont {
            display: block;
            width: 100%;
            text-align: center;
            font-size: .44rem;
            margin-top: .02rem;
        }
        .ico {
            width: .47rem;
            height: .47rem;
            margin-top: .1rem;
            background-image: url('~@/assets/coins/deal-ico1.svg');
            .bg-size(100%,100%);
        }
        span {
            font-size: .24rem;
        }
    }
</style>

