<template>
    <!-- 币种设置 -->
    <div class="currencySet">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.CurrencySet')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 关注、未关注 -->
        <div class="setting">
            <div class="attention-currency jus-a">
                <router-link to="/user/currencySet/focusCurrency" class="tab-link" replace>
                    <span>{{$t('personage.FocusOnTheCurrency')}}</span>
                </router-link>
                <router-link to="/user/currencySet/no-focusCurrency"  class="tab-link" replace>
                    <span>{{$t('personage.NoCurrencyConcerns')}}</span>
                </router-link>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import pubHead from '@/common/head/head.vue';
    import Scroll from "@/common/scroll/scroll";
export default {
    // 币种设置
    name:'CurrencySet',
    // 声明组件
    components :{
        pubHead,
        Scroll
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
@import url('~@/style/mixin');
.currencySet{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 15;
    background: @pub-bg;
    .setting{
        .attention-currency{
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
