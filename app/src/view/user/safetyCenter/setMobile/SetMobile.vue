<template>
    <!-- 手机验证设置 -->
    <div class="setmobile">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.MobileSettings')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 设置 -->
        <div class="mobile" v-if="!isBindMobile">
            <!-- 输入手机号码 -->
            <div class="setting cellnum jus-b" >
                <div class="txt">
                    <span>{{$t('personage.MobilePhone')}}</span>
                </div>
                <!-- 国际区号 -->
                <div class="area" v-show="isMobile" @click="countryLists()">
                    <span>{{countryGroup}}</span>
                    <span class="iconfont icon-iconfontjiantou"></span>
                </div>
                <input type="text" :placeholder="$t('personage.PNumber')" v-model="mobile">
                <!-- 国家区号列表 -->
                <ul class="list" v-if="countryList" >
                    <li class="li-list" v-for="item in country" @click="areaCode(item.value)">
                        <span>{{item.name}}</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </div>
            <!-- 手机验证码 -->
            <div class="setting mcode jus-b">
                <div class="txt">
                    <span>{{$t('personage.Mcode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PCode')" v-model="code">
                <div class="getcode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <!-- 解绑 -->
        <div class="mobile" v-if="isBindMobile">
             <!-- 手机验证码 -->
            <div class="setting mcode jus-b">
                <div class="txt">
                    <span>{{$t('personage.Mcode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PCode')" v-model="code">
                <div class="getcode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <div class="submit">
            <mt-button  @click="submit()" class="btn" :disabled="disabled">
                <span>{{this.isBindMobile ? $t('personage.unbind'):$t('personage.SubmitVa')}}</span>
            </mt-button>
        </div>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
// 引入国际区号
import {countrys} from '@/common/js/country';

export default {
    // 手机验证设置
    name:'SetMobile',
    data(){
        return{
            codeTime:0,//倒计时初始值
            //手机号码验证
            RegExps: {
                mobile: /^(\+?0?86\-?)?1[345789]\d{9}$/
            },
            mobile:'',//手机号码
            code:'',//验证码
            isBindMobile:false,//是否绑定了手机号码
            disabled:false,//让button按钮失效
            country:[],//国际区号列表
            countryGroup:'',//国际区号
            countryList:false,//国际区号列表显示隐藏
            isMobile:false,//国际区号显示隐藏
            //正则判断手机号码是否规范
            RegExps: {
                mobile: /^(\+?0?86\-?)?1[345789]\d{9}$/,//手机号码正则
            },
        }
    },
    mounted(){
        this.country = countrys;
        //判断是否绑定了手机号码
        (this.$store.state.mobile || localStorage.getItem('mobile')) ? this.isBindMobile = true : this.isBindMobile = false;
    },
    methods:{
        //倒计时
        endTime() {
            this.codeTime = 59;
            this.timers = setInterval(() => {
                if (this.codeTime > 0 && this.codeTime < 60) {
                    this.codeTime--;
                } else {
                    clearInterval(this.timers);
                }
            }, 1000);
        },
        //获取验证码
        getCodes(){
            //获取绑定验证码
            if(this.mobile != '' && this.RegExps.mobile.test(this.mobile)){
                this.$api.user.getBindCode({
                    mobile:this.mobile
                }).then(res =>{
                    this.endTime()
                }).catch(err =>{
                    if(err.data.error) this.$toast('error.'+err.data.error);
                })
            }else if(this.isBindMobile){
                //获取解绑验证码
                this.$api.user.getUnbindCode().then(res =>{
                    this.endTime();
                }).catch(err =>{
                    if(err.data.error) this.$toast('error.'+err.data.error);
                })
            }else{
                this.$toast(this.$t('personage.CorrectMobile'))
            }
        },
        //提交、解绑
        submit(){
            if(this.mobile == '' && this.code == ''){
                this.$toast(this.$t('personage.PMC'))
            }else if(!this.isBindMobile && this.mobile != ''  && this.code != ''){
                // 绑定
                this.disabled = true;
                this.$api.user.getBindMobile({
                    code:this.code,
                    mobile:this.countryGroup + this.mobile
                }).then(res =>{
                   this.$toast(this.$t('personage.BindSuccess'))
                    this.isBindMobile = true;
                    this.code = '';
                    this.$store.commit('bindSuccess',this.mobile);
                    localStorage.setItem('mobile',this.mobile);
                    this.codeTime = !this.codeTime;
                }).catch(err =>{
                    if(err.data.message) this.$toast(this.$t('error.'+err.data.message));
                    this.disabled = false;
                })
            }else if(this.code != ''){
                //解绑
                this.disabled = true;
                this.$api.user.getUnbindMobile({
                    code:this.code,
                }).then(res =>{
                    this.$toast(this.$t('personage.UnbindSuccess'))
                    this.isBindMobile = false;
                    this.code = '';
                    this.$store.commit('bindSuccess','');
                    localStorage.mobile = '';
                    this.codeTime = !this.codeTime;
                }).catch(err =>{
                    if(err.data.message) this.$toast(this.$t('error.'+err.data.message));
                    this.disabled = false;
                })
            }else{
                this.$toast(this.$t('personage.PMC'))
            }
        },
        // 国际区号列表显示隐藏
        countryLists(){
            this.countryList = !this.countryList
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
    },
    // 监听
    watch:{
        mobile(val){
            if(this.RegExps.mobile.test(this.mobile)){
                this.isMobile = true;
                this.countryGroup = "+86";
            }else{
                this.isMobile = false;
            }
        },
    },
    // 声明组件
    components :{
        pubHead,
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.setmobile{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: @pub-bg;
    .mobile{
        margin: 0.2rem;
        border-radius: .1rem;
        box-shadow: 1px 1px 1px 1px @bord-col;
        &>div:first-child{
            border-top-left-radius: .1rem;
            border-top-right-radius: .1rem;
        }
        &>div:last-child{
            border-bottom-left-radius: .1rem;
            border-bottom-right-radius: .1rem;
        }
        .setting{
            height: .88rem;
            line-height: .88rem;
            background: #fff;
            padding-left: .2rem;
            padding-right: 0.2rem;
            border-bottom: 1px solid @bord-col;
            font-size: .28rem;
            color: #4b4b4b;
            .txt{
                width: 30%;
            }
            .area{
                width: 30%;
                text-align: center;
                font-size: .26rem;
            }
            input{
                width: 76%;
            }
            .list{
                position: absolute;
                left: .6rem;
                top: 2rem;
                background: rgba(36, 125, 210, 0.6);
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
        .mcode{
            input{
                width: 40%;
            }
            .getcode{
                width: 33%;
                height: .6rem;
                line-height: .6rem;
                border-radius: .1rem;
                text-align: center;
                color: #fff;
                background: @main-cor;
                margin-top: .14rem;
            }
        }
    }
    .submit{
        height: .88rem;
        line-height: .88rem;
        text-align: center;
        font-size: .32rem;
        margin: 1.6rem .2rem;
        border-radius: .1rem;
        .btn{
            width: 100%;
            background: @main-cor;
            color:#fff;
        }
    }
}
</style>
