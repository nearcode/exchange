<template>
    <transition name="slide">
    <!-- 注册 -->
    <div class="sign">
        <div class="back" @click="back()">
            <span class="iconfont icon-jiantou2"></span>
        </div>
         <!-- logo -->
        <div class="logo">
            <img :src="$store.state.logo" alt="">
        </div>
        <!-- 注册 -->
        <div class="sign-info">
             <!-- 填写信息 -->
             <!-- 用户名 -->
             <div class="user jus-b" :class="isActive == -1 ? 'blue' : 'gray'" @focusin="inDiv(-1)" @focusout="outDiv">
                 <div class="icon">
                    <span class="iconfont icon-icon-"></span>
                </div>
                <input type="text" :placeholder="$t('login.PUN')" v-model="username">
            </div>
            <!-- 用户名错误提示 -->
            <div class="user-hint hint">
                <span v-show="usernamenull">{{$t('login.PUN')}}</span>
            </div>
             <!-- 邮箱 -->
            <div class="input-e jus-b" :class="isActive == 1 ? 'blue' : 'gray'" @focusin="inDiv(1)" @focusout="outDiv">
                <div class="icon">
                    <span class="iconfont icon-icon-"></span>
                </div>
                <!-- 国际区号 -->
                <div class="area" v-if="isMobile" @click="countryLists()">
                    <span>{{countryGroup}}</span>
                    <span class="iconfont icon-iconfontjiantou"></span>
                </div>
                <!-- 输入邮箱或手机号 -->
                <input type="email" :placeholder="$t('login.PEM')" v-model="email">
                <!-- 国家区号列表 -->
                <ul class="list" v-if="countryList">
                    <li class="li-list" v-for="item in country" @click="areaCode(item.value)">
                        <span>{{item.name}}</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </div>
            <!-- 邮箱错误提示 -->
            <div class="email-hint hint">
                <span v-show="emailerr">{{$t('login.PSEM')}}</span>
                <span v-show="emailnull">{{$t('login.Blank')}}</span>
            </div>
             <!-- 密码 -->
            <div class="pass jus-b" :class="isActive == 2 ? 'blue' : 'gray'" @focusin="inDiv(2)" @focusout="outDiv">
                <div class="icon">
                    <span class="iconfont icon-mima"></span>
                </div>
                <input type="password" :placeholder="$t('login.PPass')" v-model="password">
            </div>
            <!-- 密码错误提示 -->
            <div class="pass-hint hint">
                <span v-show="passnull">{{$t('personage.ThePasswordEmpty')}}</span>
                <span v-show="character">{{$t('login.Blank')}}</span>
            </div>
            <!-- 验证码 -->
            <div class="authcode jus-b" :class="isActive == 3 ? 'blue' : 'gray'" @focusin="inDiv(3)" @focusout="outDiv" v-if="!showGetCode">
                <div class="icon">
                    <span class="iconfont icon-mima"></span>
                </div>
                <input type="number" :placeholder="$t('login.PCode')" v-model="code">
                <!-- 获取验证码 -->
                <div class="getcode" v-if="!codeTime" @click="getCodeMethod()">
                    <span>{{$t('login.Send')}}</span>
                </div>
                <!-- 获取验证码 -->
                <div class="getcode" v-if="codeTime">
                    <span>{{codeTime}}{{$t('login.AgainSend')}}</span>
                </div>
            </div>
            <!-- 验证码错误提示 -->
            <div class="vcode-hint hint">
                <span v-show="codenull">{{$t('login.PCode')}}</span>
            </div>
            <!-- 注册按钮 -->
            <div class="sign-btn">
                 <mt-button  @click="sign()" class="btn" :disabled="disabled">
                    <span>{{$t('login.Sign')}}</span>
                </mt-button>
            </div>
        </div>

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
    </transition>
</template>

<script>
import {countrys} from '@/common/js/country';
import tencent from '@/common/validate/tencent';
import aliyun from '@/common/validate/aliyun';
import imgCode from '@/common/validate/imgCode';
export default {
    // 注册
    name:'Sign',
    data(){
        return{
            username:'',//用户名
            email:'',//邮箱
            password:'',//密码
            code:'',//验证码
            codeTime:0,//倒计时起始值为0
            //正则判断邮箱、手机号码是否规范
            RegExps: {
                email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱正则
                mobile: /^(\+?0?86\-?)?1[345789]\d{9}$/,//手机号码正则
            },
            isMobile:false,//国际区号显示隐藏
            countryGroup:'',//国际区号
            countryList:false,//国际区号列表显示隐藏
            country:[],//国际区号列表
            usernamenull:false,//用户名为空时
            emailerr:false,//邮箱不规范时
            emailnull:false,//邮箱为空时
            passnull:false,//密码为空时
            character:false,//非空白字符
            codenull:false,//验证码为空时
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
        loging (token) {
            console.log(token);
            this.disabled = true;
            token ? this.popupVisible = false : this.popupVisible = true;
            this.tokens = token;
            this.getCodeMethod();
        },
        // 返回
        back(){
            this.$router.go(-1);
        },
        // 国际区号列表显示隐藏
        countryLists(){
            this.countryList = !this.countryList;
        },
        //获取国际区号
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
                    clearInterval(this.timer);
                }
            }, 1000);
        },

        //获取验证码
        getCodeMethod() {
            this.$api.user.getSignCode({
                account:this.isMobile == false ? this.email : this.countryGroup + this.email
            }).then(res =>{
                this.endTime()
            }).catch(err =>{
                if(err.data.error){
                    this.$toast(this.$t('error.'+err.data.error));
                }
            })
        },
        // getCode(){
        //     if(this.username && this.password && this.email){
        //         if (this.mode == 0) {
        //             let layer = this.$refs.valiDialog;//获取腾讯滑块dom节点
        //             layer.vaptch( (tokens) => {
        //                 this.tokens = tokens;
        //                 this.getCodeMethod();
        //             });
        //         }else if(this.mode == 1) {
        //             this.popupVisible = true;  //阿里云点击验证
        //         }else {
        //             this.imgShow = true;
        //         }
            
        //     }
        // },
        // 注册
        sign(){
            if(this.username && this.email && this.password){
                this.disabled = true;
                this.$api.user.signs({
                    username:this.username,
                    account: this.isMobile == false ? this.email : this.countryGroup + this.email,
                    password:this.password,
                    code:this.code,
                }).then(res =>{
                    localStorage.token = res.token;
                    this.$store.commit('getInfos',this);
                    this.$router.push({path:'/home'})
                }).catch(err =>{
                    if(err.authType){//验证类型
                        this.showGetCode = err.authType.mobile == true ? true:false;//验证码框显示
                    }
                    if(err && err.error){
                        this.$toast(this.$t('error.'+err.data.error))
                    }
                    if(this.username == '') this.usernamenull = true;
                    if(this.email == '') this.emailnull = true;
                    if(this.password == '') this.passnull = true;
                    if(this.code == '') this.codenull = true;
                    this.disabled = false;
                    
                })
            }else{
                this.$toast('请完善信息');
            }
        },
        // 点击输入框显示边框
        inDiv(e){
            this.isActive = e;
        },
        // 点击外部隐藏边框
        outDiv(e){
            this.isActive = e;
        }
    },
    // 监听
    watch:{
        //监听用户名是否为空
        username(val){
            if(val == ''){
                this.usernamenull = true;
            }else{
                this.usernamenull = false;
            }
        },
        // 监听是邮箱还是手机号码登录，以及是否规范
        email(val){
            if(this.RegExps.mobile.test(this.email)){
                this.isMobile = true;
                this.emailerr = false;
                this.countryGroup = "+86";
            }else if(this.RegExps.email.test(this.email)){
                this.isMobile = false;
                this.emailerr = false;
            }else if(val != this.RegExps.mobile.test(this.email) || this.RegExps.email.test(this.email)){
                this.emailerr = true;
                this.emailnull = false;
            }else if(val == ''){
                this.emailnull = true;
                this.emailerr = false;
            }
        },
        // 监听密码是否符合规范
        password(val){
            if(val == ''){
                this.passnull = true;
                this.character = false;
            }else if(!/^[0-9A-Za-z]{8,16}$/.test(val)){
                this.character = true;
                this.passnull = false;
            }else if(/^[0-9A-Za-z]{8,16}$/.test(val)){
                this.passnull = false;
                this.character = false
            }
        },
        //监听验证码
        code(val){
            if(val == ''){
                this.codenull = true;
            }else{
                this.codenull = false;
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
.sign{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: #fff;
    // background-image: url('../images/bg.png');
    // background-size: 100% 100%;
    // 返回
    .back{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        padding-left: .2rem;
        .icon-jiantou2{
            color: @main-cor;
            font-size: .32rem;
        }
    }
    // logo
    .logo{
        width: 100%;
        height:3rem;
        text-align: center;
        margin-top: .8rem;
        margin-bottom: 1rem;
        img{
            width: 3rem;
        }
    }
    // 注册
    .sign-info{
        margin-left: 1rem;
        margin-right: 1rem;
        // 用户名 邮箱 密码 验证码
        .user,.input-e,.pass,.authcode{
            height: .92rem;
            line-height: .92rem;
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
        // 用户名错误提示
        .hint{
            height: .34rem;
            line-height: .34rem;
            text-align: right;
            color: red;
            overflow: hidden;
        }
        // 邮箱
        .input-e{
            .area{
                width: 30%;
                text-align: center;
                font-size: .26rem;
                color: #292929;
            }
            .list{
                position: absolute;
                left: .6rem;
                top: 7.3rem;
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
            .icon{
                .icon-mima{
                    color: #292929;
                    font-size: .32rem;
                }
            }
        }
        // 验证码
        .authcode{
            .icon{
                .icon-mima{
                    color: #292929;
                    font-size: .32rem;
                }
            }
            input{
                width: 52%;
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
            // 获取验证码
            .getcode{
                width: 38%;
                height: .66rem;
                background: @main-cor;
                border-radius: .1rem;
                text-align: center;
                line-height: .66rem;
                color: #fff;
                margin-top: .1rem;
            }
        }
        // 注册按钮
        .sign-btn{
            margin-top: 1rem;
            margin-bottom: .36rem;
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
                background: @main-cor;
                color:#fff;
            }
        }
    }
}
.blue{
    border: 1px solid #90c9f6 !important;
}
.gray{
    border: 1px solid  @pub-bg!important ;
}
.slide-enter-active, &.slide-leave-active{
	transition: all .3s
}
.slide-enter, &.slide-leave-to{
	transform: translate3d(-100%, 0, 0)
}
</style>
