<template>
    <div class="user">  
        <div v-if="$store.state.isLogin()">
            <!-- 头部 -->
            <header class="header" :style="{backgroundColor:$config.color.mainCor}">
                <span>{{$t('personage.PersonalCenter')}}</span>
            </header>
            <!-- logo -->
            <div class="logo" :style="{backgroundColor:$config.color.mainCor}">
                <div class="logo-big">
                    <div class="logo-small">
                        <img src="./images/timg.jpg" alt="">
                    </div>
                </div>
                <div class="user-name">
                    <span>{{$store.state.username}}({{$store.state.uid}})</span>
                </div>
            </div>
            <!-- 功能列表 -->
            <div class="all-list">
                <!-- 设置 -->
                <div class="setting">
                    <!-- 货币单位设置 -->
                    <!-- <div class="unit-setting jus-b">
                        <div class="unit-setting-txt">
                            <span class="iconfont icon-jinbi" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.MonetaryUnitSetting')}}</span>
                        </div>
                        <div class="unit-jiantou">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div> -->
                    <!-- 币种设置 -->
                    <div class="unit-setting jus-b"  @click="toCurrencySet()">
                        <div class="unit-setting-txt">
                            <span class="iconfont icon-6" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.CurrencySet')}}</span>
                        </div>
                        <div class="unit-jiantou">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div>
                    <!-- 语言设置 -->
                    <div class="unit-setting jus-b" @click="popupVisible = true">
                        <div class="unit-setting-txt">
                            <span class="iconfont icon-yuyanqiehuan" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.LangSetting')}}</span>
                        </div>
                        <div class="unit-jiantou">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                            <!-- <mt-switch class="btn" v-model="languages"></mt-switch> -->
                        </div>
                    </div>
                </div>
                <!-- 客服和安全中心 -->
                <div class="centre">
                    <!-- 客服中心 -->
                    <div class="service-centre jus-b" @click="toCallCenter()">
                        <div class="service-txt">
                            <span class="iconfont icon-kefu" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.CustomerServiceCenter')}}</span>
                        </div>
                        <div class="service-icon">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div>
                    <!-- 安全中心 -->
                    <div class="service-centre jus-b" @click="toSafetyCenter()">
                        <div class="service-txt">
                            <span class="iconfont icon-anquanzhongxinoff" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.SecurityCenter')}}</span>
                        </div>
                        <div class="service-icon">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div>
                </div>
                <!-- 实名认证、关于我们、分享我们 -->
                <div class="abous">
                    <!-- 实名认证 -->
                    <div class="versions-up jus-b" @click="toCertification()">
                        <div class="versions-up-txt">
                            <span class="iconfont icon-webicon301" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.Certification')}}</span>
                        </div>
                        <div class="versions-icon">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div>
                    <!-- 关于我们 -->
                    <!-- <div class="versions-up jus-b">
                        <div class="versions-up-txt">
                            <span class="iconfont icon-guanyuwomen" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.AboutUs')}}</span>
                        </div>
                        <div class="versions-icon">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div> -->
                    <!-- 分享我们 -->
                    <div class="versions-up jus-b" :data-clipboard-text="'https://eauni.com/r/'+$store.state.uid" @click="share()">
                        <div class="versions-up-txt">
                            <span class="iconfont icon-tuanduicankaoxian-" style="padding-right:.1rem"></span>
                            <span>{{$t('personage.Share')}}</span>
                        </div>
                        <div class="versions-icon">
                            <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
                        </div>
                    </div>
                </div>
                <!-- 注销登录 -->
                <div class="logout" @click="loginOut()" :style="{backgroundColor:$config.color.mainCor}">
                    <span>{{$t('personage.Logout')}}</span>
                </div>
            </div>
        </div>
        <!-- 没有登录时显示的页面 -->
        <div class="wallet-container" v-if="!$store.state.isLogin()">
             <!-- 头部 -->
            <header class="header" :style="{backgroundColor:$config.color.mainCor}">
                <span>{{$t('personage.PersonalCenter')}}</span>
            </header>

            <div class="toLogin">
                <img src="./images/login.png">
                <span class="tips">{{$t('personage.NoLogin')}}</span>
                <mt-button class="btn" type="primary" @click="toLogin()" :style="{backgroundColor:$config.color.mainCor}"><span class="icon iconfont icon-50"></span><span class="text">{{$t('personage.LoginRegister')}}</span></mt-button>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
        <!-- 分享二维码 -->
        <div class="toast" v-if="erpic">
            <img :src="'https://'+$config.domain+'/api/v3/qrcode?text=https://'+$config.domain+'/r/'+$store.state.uid" alt="">
            <span class="close flexc" @click="handClose">&times;</span>
        </div>
        <!-- 语言切换弹窗 -->
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="slots" @change="languageChange" class="pickers"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
import languages from "@/common/json/language.json";
export default {
    // 个人
    name:'User',
    data () {
        return {
            //username:'',//用户名
            //id:'',//用户ID
            languages:this.$store.state.language(),//获取语言
            erpic:false,//分享二维码弹窗
            popupVisible: false,//弹窗
            //语言切换
            slots: [
                {
                    flex: 1,
                    defaultIndex: parseInt(localStorage.indexItem) || 0,
                    values: languages,
                    className: "slot1",
                    textAlign: "center"
                }
            ],
        }
    },
    mounted(){
        this.$store.state.isLogin();
    },
    methods:{
        // 跳转到币种设置
        toCurrencySet(){
            this.$router.push('/user/currencySet/focusCurrency')
        },
        //跳转到客服中心
        toCallCenter(){
            this.$router.push('/user/callCenter')
        },
        // 跳转到安全中心
        toSafetyCenter(){
            this.$router.push('/user/safetyCenter')
        },
        // 跳转到实名认证
        toCertification(){
            this.$router.push('/user/certification')
        },
        //注销登录
        loginOut(){
            this.$store.commit('loginOut');
            this.$router.push({path:'/login'});
            localStorage.uid = '';
            localStorage.username = ''
        },
        // 跳转到登录页面
        toLogin(){
            this.$router.push('/login')
        },
        // 分享
        share() {
            this.erpic = true;
        },
        //关闭弹窗
        handClose(){
            this.erpic = false
        },
        // 语言切换弹窗
        languageChange(picker,values){
            picker.setSlotValues(1,languages);
            if(values[0] == '中文') {
                localStorage.setItem('indexItem','0');
                this.$i18n.locale = "chinese";
                window.localStorage.setItem("language", "chinese");
            }else if (values[0] == 'English'){
                localStorage.setItem('indexItem','1')
                this.$i18n.locale = 'english';
                window.localStorage.setItem("language","english")
            }else if(values[0] == "한국어"){
                localStorage.setItem('indexItem','2')
                this.$i18n.locale = 'korean';
                window.localStorage.setItem("language","korean")
            }
        },
    },
    // // 监听
    // watch:{
    //     // 中英文切换
    //     languages(){
    //         if(this.languages){
    //             this.$i18n.locale = 'english';
    //             window.localStorage.setItem('language','english');
    //         }else{
    //             this.$i18n.locale = 'chinese';
    //             window.localStorage.setItem('language','chinese');
    //         }
    //     }
    // },
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
    .user {
        width: 100%;
        height: 100%;
        // min-height: 100vh;
        background: @pub-bg;
        // 头部
        .header{
            width: 100%;
            height: 0.88rem;
            text-align: center;
            line-height: .88rem;
            font-size: .32rem;
            color: #fff;
            border-bottom: 1px solid #b3dafd;
        }
        // logo
        .logo{
            width: 100%;
            height: 3.56rem;
            padding-top: 0.32rem;
            // 头像
            .logo-big{
                width: 1.74rem;
                height: 1.74rem;
                border-radius: 50%;
                // border: 2px solid @bord-col;
                margin:auto;
                .logo-small{
                    width: 1.28rem;
                    height: 1.28rem;
                    background: #fff;
                    margin: .1rem auto;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .user-name{
                text-align: center;
                font-size: .26rem;
                color:#fff;
            }
        }
        // 功能列表
        .all-list{
            height: 200px;
            position: relative;
            left: 0;
            top: -.88rem;
            margin-left: .22rem;
            margin-right: .22rem;
            // 设置
            .setting{
                border-radius:.1rem;
                box-shadow: 0 0 1px 1px @bord-col;
                &>div:first-child{
                    border-top-left-radius:0.1rem;
                    border-top-right-radius:0.1rem;
                }
                &>div:last-child{
                    border-bottom-left-radius:0.1rem;
                    border-bottom-right-radius:0.1rem;
                }
                .unit-setting{
                    background: #fff;
                    height: .88rem;
                    line-height: .88rem;
                    padding-left: .32rem;
                    padding-right: 0.32rem;
                    border-bottom: 1px solid @bord-col;
                    color: #4c4c4c;
                    font-size: .32rem;
                    .unit-setting-txt{
                        .icon-jinbi{
                            font-size: .32rem;
                        }
                        .icon-6{
                            font-size: .32rem;
                        }
                    }
                    .unit-jiantou{
                        height: .88rem;
                        line-height: .88rem;
                    }
                }
            }
            // 客服和安全中心
            .centre{
                margin-top: 0.2rem;
                border-radius:.1rem;
                box-shadow: 0 0 1px 1px @bord-col;
                &>div:first-child{
                    border-top-left-radius:0.1rem;
                    border-top-right-radius:0.1rem;
                }
                &>div:last-child{
                    border-bottom-left-radius:0.1rem;
                    border-bottom-right-radius:0.1rem;
                }
                .service-centre{
                    background: #fff;
                    height: .88rem;
                    line-height: .88rem;
                    padding-left: .32rem;
                    padding-right: 0.32rem;
                    border-bottom: 1px solid @bord-col;
                    color: #4c4c4c;
                    font-size: .32rem;
                }
            }
            // 实名认证、关于我们、分享我们
            .abous{
                margin-top: 0.2rem;
                border-radius:.1rem;
                box-shadow: 0 0 1px 1px @bord-col;
                &>div:first-child{
                    border-top-left-radius:0.1rem;
                    border-top-right-radius:0.1rem;
                }
                &>div:last-child{
                    border-bottom-left-radius:0.1rem;
                    border-bottom-right-radius:0.1rem;
                }
                .versions-up{
                    background: #fff;
                    height: .88rem;
                    line-height: .88rem;
                    padding-left: .32rem;
                    padding-right: 0.32rem;
                    border-bottom: 1px solid @bord-col;
                    color: #4c4c4c;
                    font-size: .32rem;
                }
            }
            // 注销登录
            .logout{
                height: .88rem;
                border-radius: .1rem;
                margin-top: 1.2rem;
                text-align: center;
                line-height: .88rem;
                font-size: .32rem;
                color: #fff;
            }
        }
        .icon-arrow-right-copy-copy-copy{
            color: #a39887;
            font-size: .28rem
        }
    }
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}
.mint-popup {
  width: 100%;
  height: 25%;
}

.pickers {
  width: 100%;
  background: #FFFFFF;
  position: absolute;
  z-index: 13;
}
// 没有登录时显示的页面
.wallet-container {
    position: absolute;
    top: 0;
    bottom: 4rem;
    width: 100%;
    background: #fff;
     // 头部
    .header{
        width: 100%;
        height: 0.88rem;
        text-align: center;
        line-height: .88rem;
        font-size: .32rem;
        color: #fff;
    }
    .toLogin {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        img {
            width: 50%;
            height: 50%;
        }
        .tips {
            position: absolute;
            left: 50%;
            top: 6rem;
            transform: translate(-50%, 0);
            color: #d1dadc;
            font-size: .4rem;
        }
        .btn {
            position: absolute;
            bottom: 4.3rem;
            left: 50%;
            top: 7rem;
            transform: translate(-50%, 0);
            background: #f3f3f3;
            border-radius: 1rem;
            width: 3rem;
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            .text {
                font-size: .4rem;
            }
        }
    }
}
.toast{
    position: fixed;
	top: 0 ;
	left: 0;
	z-index: 100;
    background: rgba( 0, 0, 0, 0.6);
	width: 100%;
	height: 100%;
}
.toast img{
    position: fixed;
	top: 40%;
    left: 50%;
	transform: translate(-50%, -35%);
}
 
.close {
    position: absolute;
    width:1rem;
    font-size: .6rem;
    color: #fff;
    height: 1rem;
    top: .3rem;
    right: .3rem;
}
</style>
        
        