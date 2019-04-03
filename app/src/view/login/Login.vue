<template>
    <!-- 登录 -->
    <div class="login">
        <!-- 跳过登录 -->
        <div class="back" @click="toHome()">
            <span class="iconfont icon-jiantou2"></span>
        </div>
        <!-- logo -->
        <div class="logo">
            <img :src="$store.state.logo" alt="">
        </div>
        <!-- 登录 -->
        <div class="login-info">
            <!-- 填写信息 -->
            <div class="input-e jus-b" :class="isActive == -1 ? 'blue' : 'gray'" @focusin="inDiv(-1)" @focusout="outDiv">
                <div class="icon">
                    <span class="iconfont icon-icon-"></span>
                </div>
                <!-- 国际区号 -->
                <div class="area" v-show="isMobile" @click="countryLists()">
                    <span>{{countryGroup}}</span>
                    <span class="iconfont icon-iconfontjiantou"></span>
                </div>
                <!-- 输入邮箱或手机号 -->
                <input type="email" :placeholder="$t('login.PEmail')" v-model="email">
                <!-- 国家区号列表 -->
                <ul class="list" v-if="countryList" >
                    <li class="li-list" v-for="item in country" @click="areaCode(item.value)">
                        <span>{{item.name}}</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </div>
            <!-- 密码 -->
            <div class="pass jus-b" :class="isActive == 1 ? 'blue' : 'gray'" @focusin="inDiv(1)" @focusout="outDiv">
                <div class="icon">
                    <span class="iconfont icon-mima"></span>
                </div>
                <input type="password" :placeholder="$t('login.PPass')" v-model="password">
            </div>
            <!-- 验证码 -->
            <div class="authcode jus-b" @focusout="outDiv" v-if="showGetCode">
                <div class="icon">
                    <span class="iconfont icon-mima"></span>
                </div>
                <input type="number" :placeholder="authType.otp?$t('login.OtpCode'):$t('login.PCode')" v-model="code">
                <!-- 获取验证码 -->
                <div class="getcode" :style="{backgroundColor:$config.color.mainCor}">
                    <span v-if="!codeTime" @click="getCode()">{{$t('login.Send')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('login.AgainSend')}}</span>
                </div>
            </div>
           
            <!-- 登录按钮 -->
            <div class="login-btn">
                <mt-button  @click="sureLogin()" class="btn" :disabled="disabled" :style="{backgroundColor:$config.color.mainCor}">
                    <span>{{$t('login.Logins')}}</span>
                </mt-button>
            </div>
            <!--注册按钮/ 忘记密码 -->
            <div class="sign-forget jus-b">
                <!-- 注册按钮 -->
                <div class="sign-btn" @click="toSign()" :style="{color:$config.color.mainCor}">
                    <span>{{$t('login.Sign')}}</span>
                </div>
                <!-- 忘记密码 -->
                <div class="forget-pass" :style="{color:$config.color.mainCor}">
                    <span @click="toForget()">{{$t('login.Forget')}}</span>
                </div>
            </div>
        </div>
        <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
            <router-view></router-view>
        </transition>
        <!-- 腾讯滑块 -->
        <!-- <tencent ref="valiDialog"></tencent>  -->
        <!-- 阿里云点击验证 -->
        <!-- <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            class="flexc">
            <div class="vali">
                <aliyun @loging="loging"></aliyun>
            </div>
        </mt-popup>
        <imgCode @imgLogin="imgLogin" v-if="imgShow"></imgCode> -->
    </div>
</template>

<script>
import {countrys} from '@/common/js/country';
import tencent from '@/common/validate/tencent';
import aliyun from '@/common/validate/aliyun';
import imgCode from '@/common/validate/imgCode';
export default {
    // 登录
    name:'Login',
    data () {
        return {
            isMobile:false,//国际区号显示隐藏
            email:'',//邮箱
            password:'',//密码
            code:'',//验证码
            codeTime:0,//倒计时起始值为0
            //正则判断邮箱、手机号码是否规范
            RegExps: {
                email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱正则
                mobile: /^(\+?0?86\-?)?1[345789]\d{9}$/,//手机号码正则
            },
            countryGroup:'',//国际区号
            countryList:false,//国际区号列表显示隐藏
            country:[],//国际区号列表
            authType:{},//登录类型
            isActive:0,//是否获取焦点变换颜色
            disabled:false,//让button按钮失效
            popupVisible:false,//显示阿里云验证弹窗
            tokens: {},
            imgShow:false,//图片验证显示
            mode:0,//虚拟自定义的验证方式  ， 0腾讯，1阿里云，2图片验证码
            showGetCode:false,//是否显示验证码框
        }
    },
    components:{
        tencent,
        aliyun,
        imgCode
    },
    mounted(){
        this.country = countrys;
    },
    methods:{
        //图片验证码登入
        imgLogin(data) {
            console.log(data);  
        },
        //阿里云验证后获取token
        // loging (token) {
        //     console.log(token);
        //     this.disabled = true;
        //     token ? this.popupVisible = false : this.popupVisible = true;
        //     this.tokens = token;
        //     this.login();
        // },
        // 跳转到注册页面
        toSign(){
            this.$router.push('/sign');
        },
        // 跳转到忘记密码页面
        toForget(){
            this.$router.push('/login/forget');
        },
        // 登录
        login(){
            this.$api.user.login({
                account: this.isMobile == false ? this.email : this.countryGroup + this.email,
                password: this.password,
                gauth: this.code,
                // token: this.tokens
            }).then(res => {
                console.log(res)
                localStorage.timestamp = new Date().getTime();//存时间戳
                localStorage.token = res.token; //存token
                this.$store.commit('getInfos', this); //传this到vuex方法中
                this.$router.push('/home');
            }).catch(err => {
                if(err && err.authType){
                    this.showGetCode = err.authType.mobile == true ? true:false;//验证码框显示
                    // return;
                }
                if(err && err.data.error){
                    this.$toast(this.$t('error.'+err.data.error));
                }
            })
        },
        // 国际区号列表显示隐藏
        countryLists(){
            this.countryList = !this.countryList;
        },
        // 获取国际区号
        areaCode(item){
            let p = /\(([^()]+)\)/g;//提取区号
            this.countryList = false;//国际区号列表
            this.countryGroup = "+86";//默认86
            for(var i = 0;i < countrys.length;i++){
                var countryItem = countrys[i]
                if(item === countryItem['value']){
                    this.countryGroup = p.exec(countryItem['value'])[1]
                }
            }
        },
        // 获取验证码倒计时
        endTime(){
            this.codeTime = 59;
            this.timer = setInterval(() => {
                if(this.codeTime > 0 && this.codeTime <= 59){
                    this.codeTime--
                }else{
                    clearInterval(this.timer)
                }
            }, 1000);
        },
        // 获取验证码
        getCode(){
            if(this.email && this.password){
                this.$api.user.getCode().then(res =>{
                    this.endTime()
                }).catch(err =>{
                    if (err.data.error) {
                        this.$toast(this.$t(err.data.error));
                    }
                })
            }
        },
        // 确认登录
        sureLogin(){
            if(!this.email && !this.password){
                this.$toast(this.$t('login.PerfectInfo'))
                this.disabled= false;
            }
            this.disabled = true;
            if(this.email && this.password){
                this.login();
                // if (this.mode == 0) {
                //     let layer = this.$refs.valiDialog;//获取腾讯滑块dom节点
                //     layer.vaptch( (tokens) => {
                //         this.disabled = false;
                //         this.tokens = tokens;
                //         this.login(tokens);
                //     });
                // }else if(this.mode == 1) {
                //     this.popupVisible = true;  //阿里云点击验证
                // }else {
                //     this.imgShow = true;
                // }
            }
        },
        // 点击输入框显示边框
        inDiv(e){
            this.isActive = e;
        },
        // 点击外部隐藏边框
        outDiv(e){
            this.isActive = e;
        },
        // 跳过登录
        toHome(){
            this.$router.push('/home')
        }
    },
    // 监听
    watch:{
        // 监听是邮箱还是手机号码登录，以及是否规范
        email(val){
            if(this.RegExps.mobile.test(this.email)){
                this.isMobile = true;
                this.countryGroup = "+86";
            }else if(this.RegExps.email.test(this.email)){
                this.isMobile = false
            }
        },
        popupVisible(val) {
            //监听阿里云弹框是否被隐藏，if隐藏 登入按钮设为可用状态
            if (val == false) {
                this.disabled = false;
            }
        }
    }
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');

    .mint-popup /deep/ {
            width: 6rem;
            .border-radius(.1rem);
            height: 3rem;
        }
        .vali {
            width: 6rem;
            height: 3rem;
        }
.login{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 15;
    background: #fff;
    // 跳过登录
    .back{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        padding-left: .2rem;
        .icon-jiantou2{
            color: #292929;
            font-size: .32rem;
        }
    }
    .logo{
        width: 100%;
        height: 3rem;
        text-align: center;
        margin-top: 1.08rem;
        margin-bottom: 1rem;
        img{
            width:3rem;
        }
    }
    // 登录
    .login-info{
        margin-left: 1rem;
        margin-right: 1rem;
        // 邮箱
        .input-e{
            height: .92rem;
            line-height: .92rem;
            margin-bottom: .2rem;
            border: 1px solid @pub-bg;
            border-radius: .1rem;
            .icon{
                width: 10%;
                text-align: center;
                .icon-icon-{
                    color: #292929;
                    font-size: .32rem;
                }
            }
            .area{
                width: 30%;
                text-align: center;
                font-size: .26rem;
            }
            input{
                width: 90%;
                outline: none;
                background: rgba(0,0, 0,0);
                border: none;
                padding-left: .2rem;
                font-size: .3rem;
                color: #292929;
                &::placeholder{
                    color: #9599a5;
                }
            }
            .list{
                position: absolute;
                left: .6rem;
                top: 6.2rem;
                background: rgba(0, 0, 0, 0.6);
                width: 6rem;
                height: 6rem;
                z-index: 20;
                border-radius: 0.3rem;
                border: 1px solid rgba(0,0,0,.15);
                box-shadow: 0 6px 12px rgba(0,0,0,.175);
                overflow: scroll;
                .li-list{
                    height: .8rem;
                    line-height: .8rem;
                    font-size: 0.26rem;
                    color: #fff;
                    &>span:nth-of-type(1){
                        padding-left: .2rem;
                        float: left;
                    }
                    &>span:nth-of-type(2){
                        padding-left: .2rem;
                        float: right;
                    }
                }
            }
        }
        // 密码
        .pass{
            height: .92rem;
            margin-bottom: .2rem;
            line-height: .92rem;
            border: 1px solid  @pub-bg;
            border-radius: .1rem;
            .icon{
                width: 10%;
                text-align: center;
                .icon-mima{
                    color: #292929;
                    font-size: .32rem;
                }
            }
            input{
                width: 90%;
                outline: none;
                background: rgba(0,0, 0,0);
                border: none;
                padding-left: .2rem;
                font-size: .3rem;
                color: #292929;
                &::placeholder{
                    color: #9599a5;
                }
            }
        }
        // 验证码
        .authcode{
            height: .92rem;
            line-height: .92rem;
            border: 1px solid @pub-bg;
            border-radius: .1rem;
            .icon{
                width: 10%;
                text-align: center;
                .icon-mima{
                    color:#292929;
                    font-size: .32rem;
                }
            }
            input{
                width: 60%;
                outline: none;
                background: rgba(0,0, 0,0);
                border: none;
                padding-left: .2rem;
                font-size: .3rem;
            }
            // 获取验证码
            .getcode{
                width: 53%;
                height: .66rem;
                border-radius: .1rem;
                text-align: center;
                line-height: .66rem;
                color: #fff;
                margin-top: .1rem;
            }
        }
        // 忘记密码
        .forget-pass,.sign-btn{
            height: .84rem;
            line-height: .84rem;
            text-align: right;
        }
        // 登录按钮
        .login-btn{
            margin-top: .64rem;
            margin-left: .2rem;
            margin-right: 0.2rem;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            font-size: .34rem;
            border-radius: .1rem;
            font-weight: bold;
            .btn{
                width: 100%;
                color:#fff;
            }
        }
        // 注册按钮/忘记密码
        .sign-forget{
            height: 0.84rem;
            line-height: .84rem;
            text-align: center;
            color: #fff;
        }
        // 跳过
        .skip{
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            margin-top: .2rem;
            color: #fff;
            font-size: .34rem;
            background: rgba(0, 0, 0, 0);
            border-radius: .1rem;
            font-weight: bold;
            border: 1px solid #dedede;
        }
    }
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}
.vaptcha-container {
    margin: 0 auto 1.3rem auto;
    width: 90%;
    border-radius: 1.5rem;
}

.vp-dark-btn.vp-default-btn {
    border-radius: 17px !important;
}
.blue{
    border: 1px solid #90c9f6 !important;
}
.gray{
    border: 1px solid  @pub-bg!important ;
}
</style>
