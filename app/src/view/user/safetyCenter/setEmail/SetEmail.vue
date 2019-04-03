<template>
    <!-- 邮箱验证设置 -->
    <div class="setemail">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.MailboxSettings')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 设置 -->
        <div class="email" v-if="!isEmail">
            <!-- 邮箱地址 -->
            <div class="setting cellnum jus-b">
                <div class="txt">
                    <span>{{$t('personage.EmaileAdd')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PEmaileAdd')" v-model="email">
            </div>
             <!-- 邮箱验证码 -->
            <div class="setting ecode jus-b">
                <div class="txt">
                    <span>{{$t('personage.Ecode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PEcode')" v-model="code">
                <div class="getcode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <!-- 解绑 -->
        <div class="email" v-if="isEmail">
             <!-- 邮箱验证码 -->
            <div class="setting ecode jus-b">
                <div class="txt">
                    <span>{{$t('personage.Ecode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PEcode')" v-model="code">
                <div class="getcode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <div class="submit" @click="submit()">
            <span>{{this.isEmail ? $t('personage.unbind'):$t('personage.SubmitVa')}}</span>
        </div>
    </div>
</template>

<script>
//引入头部组件 
import pubHead from '@/common/head/head.vue';
export default {
    // 邮箱验证设置
    name:'SetEmail',
    data(){
        return{
            codeTime:0,//倒计时初始值
            //验证邮箱是否规范
            RegExps: {
                email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            },
            email:"",//邮箱
            code:'',//验证码
            isEmail:false,//是否绑定了邮箱
        }
    },
    mounted(){
        //判断是否已绑定了邮箱、或者是用邮箱登录的
        this.$store.state.email || localStorage.email ? this.isEmail = true : this.isEmail = false;
        console.log(localStorage.email);
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
            if(this.email != '' && this.RegExps.email.test(this.email)){
                this.$api.user.getEbindCode({
                    email:this.email
                }).then(res =>{
                    this.endTime()
                }).catch(err =>{
                    this.$toast(this.$t('error.'+err.data.message))
                    console.log(err)
                })
            }else if(this.isEmail){
                //获取解绑验证码
                this.$api.user.getEunbindCode().then(res =>{
                    this.endTime();
                }).catch(err =>{
                    this.$toast(this.$t('error.'+err.data.message))
                    console.log(err)
                })
            }else{
                this.$toast(this.$t('personage.CorrectEmail'))
            }
        },
        //提交、解绑
        submit(){
            if(this.email == '' && this.code == ''){
                this.$toast(this.$t('personage.PEC'))
            }else if(!this.isEmail && this.email != ''  && this.code != ''){
                //绑定邮箱
                this.$api.user.getBindEmail({
                    code:this.code,
                    email:this.email
                }).then(res =>{
                    this.$toast(this.$t('personage.BindSuccess'))
                    this.isEmail = true;
                    this.code = '';
                    this.$store.commit('bindEmail',this.email);
                    localStorage.setItem('email',this.email);
                    this.codeTime = !this.codeTime;
                }).catch(err =>{
                    if(err.data.message) this.$toast(this.$t('error.'+err.data.message))
                })
            }else if(this.code != ''){
                // 解绑邮箱
                this.$api.user.getUnbindEmail({
                    code:this.code,
                }).then(res =>{
                    this.isEmail = false;
                    this.code = '';
                    this.$store.commit('bindEmail','');
                    localStorage.email = null;
                    this.codeTime = !this.codeTime;
                }).catch(err =>{
                    if(err.data.message) this.$toast(this.$t('error.'+err.data.message))
                })
            }else{
                this.$toast(this.$t('personage.PEcode'))
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
.setemail{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: @pub-bg;
    .email{
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
                width: 38%;
            }
            input{
                width: 76%;
            }
        }
        .ecode{
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
        margin-left:.2rem;
        margin-right: .2rem;
        margin-top: 1rem;
        height: .88rem;
        line-height: .88rem;
        border-radius: .1rem;
        color: #fff;
        background: @main-cor;
        text-align: center;
        font-size: .32rem;
    }
}
</style>
