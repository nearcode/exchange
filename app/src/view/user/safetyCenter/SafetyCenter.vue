<template>
    <!-- 安全中心 -->
    <div class="safetyCenter">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.SecurityCenter')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <div class="safety">
            <!-- 登录密码设置 -->
            <div class="setting setpass jus-b" @click="toSetPass()">
                <div class="set-txt">
                    <span class="iconfont icon-mima"></span>
                    <span>{{$t('personage.LoginSetting')}}</span>
                </div>
                <div class="arrows">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div> 
            </div>
            <!-- 谷歌验证设置 -->
            <div class="setting setpass jus-b" @click="toSetOtp()">
                <div class="set-txt">
                    <span class="iconfont icon-iconset0284"></span>
                    <span>{{$t('personage.GoogleSettings')}}</span>
                </div>
                <div class="arrows">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 手机验证设置 -->
            <div class="setting setpass jus-b" @click="toSetMobile()">
                <div class="set-txt">
                    <span class="iconfont icon-shouji"></span>
                    <span>{{$t('personage.MobileSettings')}}</span>
                </div>
                <div class="arrows">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 邮箱验证设置 -->
            <div class="setting setpass jus-b" @click="toSetEmail()">
                <div class="set-txt">
                    <span class="iconfont icon-youxiang"></span>
                    <span>{{$t('personage.MailboxSettings')}}</span>
                </div>
                <div class="arrows">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
            <!-- 验证方式设置 -->
            <div class="setting setpass jus-b" @click="toVerify()">
                <div class="set-txt">
                    <span class="iconfont icon-yanzhengma"></span>
                    <span>{{$t('personage.VerificationMode')}}</span>
                </div>
                <div class="arrows">
                    <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                </div>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
export default {
    // 安全中心
    name:'SafetyCenter',
    // 声明组件
    components :{
        pubHead,
    },
    methods:{
        // 跳转到登录密码设置
        toSetPass(){
            this.$router.push('/user/safetyCenter/setPass')
        },
        // 跳转到谷歌验证设置
        toSetOtp(){
            this.$router.push('/user/safetyCenter/setOtp')
        },
        // 跳转到手机验证设置
        toSetMobile(){
            this.$router.push('/user/safetyCenter/setMobile')
        },
        // 跳转到邮箱验证设置
        toSetEmail(){
            this.$router.push('/user/safetyCenter/setEmail')
        },
        // 跳转到验证方式设置
        toVerify(){
            this.$router.push('/user/safetyCenter/verify')
        }
    }
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.safetyCenter{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 15;
    background: @pub-bg;
    .safety{
        margin: .2rem;
        box-shadow: 1px 1px 1px 1px @bord-col;
        border-radius: .1rem;
        &>div:first-child{
            border-top-left-radius: .1rem;
            border-top-right-radius: .1rem;
        }
        &>div:last-child{
            border-bottom-left-radius: .1rem;
            border-bottom-right-radius: .1rem;
        }
        // 设置
        .setting{
            height: .88rem;
            line-height: .88rem;
            background: #fff;
            padding: 0 .2rem;
            border-bottom: 1px solid @bord-col;
            .set-txt{
                font-size: .28rem;
                color: #575757;
                .iconfont{
                    font-size: .32rem;
                    color: #4d4d4d;
                }
            }
        }
        .icon-arrow-right-copy-copy-copy{
            color: #d8d8d8;
            font-size: .28rem;
        }
    }
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}
</style>
