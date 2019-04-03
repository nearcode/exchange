<template>
    <!-- 验证方式 -->
    <div class="verify" v-show="showDialog">
        <!-- 身份验证 -->
        <div class="identity">
            <span>{{$t('pop.Authentication')}}</span>
        </div>
        <!-- 谷歌验证码 -->
        <div class="otp mode" v-if="authType.otp">
            <div class="txt">
                <span>{{$t('persoange.GoogleVCode')}}</span>
            </div>
            <div class="codes jus-b">
                <input type="password" :placeholder="$t('personage.PleaseGoogleVCode')" v-model="param">
                <div class="getCode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <!-- 邮箱验证 -->
        <div class="email mode" v-else-if="authType.email">
            <div class="txt">
                <span>{{$t('personage.Ecode')}}</span>
            </div>
            <div class="codes jus-b">
                <input type="password" :placeholder="$t('personage.PEcode')" v-model="param">
                <div class="getCode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <!-- 短信验证 -->
        <div class="message mode" v-else-if="authType.mobile">
            <div class="txt">
                <span>{{$t('pop.MAC')}}</span>
            </div>
            <div class="codes jus-b">
                <input type="password" :placeholder="$t('pop.PMAC')" v-model="param">
                <div class="getCode">
                    <span v-if="!codeTime" @click="getCodes()">{{$t('personage.getCode')}}</span>
                    <span v-if="codeTime">{{codeTime}}{{$t('personage.Second')}}</span>
                </div>
            </div>
        </div>
        <!-- 密码验证 --> 
        <div class="pass mode" v-else-if="authType.password">
            <div class="txt">
                <span>{{$t('personage.PV')}}</span>
            </div>
            <div class="codes">
                <input type="password" :placeholder="$t('personage.PleasePass')" v-model="param">
            </div>
        </div>
        <!-- 确定、取消 -->
        <div class="footer jus-b">
            <mt-button :disabled="disabled" class="confirm" @click="confirm()">{{$t('personage.confirm')}}</mt-button>
            <mt-button class="cancel" @click="cancel()">{{$t('personage.cancels')}}</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    // 验证方式
    name:'VMode',
    data(){
        return{
            codeTime:0,//倒计时开始时间
            param:'',//验证码
            authType:{},//验证方式
            disabled:false,//失效
            initial:null,//初始值为空
            callback:'',//回调
            cancels:'',//取消
            showDialog: false,//验证方式是否显示
        }
    },
    mounted(){
        console.log(this.authType)
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
            this.$api.user.getPopCode().then(res =>{
                this.endTime()
            }).catch(err =>{
               if(err.data.error) this.$toast('error.'+err.data.error);
            })
        },
        //初始值
        init(parent){
            this.disabled = false;
            this.param = '';
            this.initial = parent;
        },
        //显示弹框
        showBounced(datas){
            console.log(datas)
            this.authType = datas.authType;
            this.showDialog = true;
            this.callback = datas.callback;
            this.cancels = datas.cancel;
        },
        // 确定
        confirm(){
            if(!this.param){
                this.$toast(this.$t('login.PCode'))
            }else{
                this.disabled = true;
                this.$emit('code',this.param);
                this.callback && this.callback();
                this.showDialog = false;
            }
        },
        // 取消
        cancel(){
            this.showDialog = false;
            this.cancels && this.cancel();
        }
    }
}
</script>

<style lang="less" scoped>
.verify{
    width: 90%;
    height: 4rem;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 30;
    transform: translate(-50%,-50%);
    background: #fff;
    font-size: .32rem;
    border-radius: .3rem;
    .identity{
        text-align: center;
        height: .8rem;
        line-height: .8rem;
    }
    .mode{
        .txt{
            height: .8rem;
            line-height: .8rem;
            padding-left: .3rem;
        }
        .codes{
            height: 1rem;
            line-height: 1rem;
            margin-left: .3rem;
            margin-right: .3rem;
            border: 1px solid #ccc;
            input{
                width: 60%;
                border: none;
                outline: none;
                padding-left: .3rem;
            }
            .getCode{
                width: 44%;
                text-align: center;
                border-left: 1px solid #ccc;
            }
        }
    }
    .pass{
        input{
            width: 90%;
            border: none;
            outline: none;
            padding-left: .3rem;
        }
    }
    .footer{
        height: .88rem;
        margin-top: .3rem;
        .confirm,.cancel{
            bottom: 0;
            width: 50%;
            height: .88rem;
        }
    }
}
</style>
