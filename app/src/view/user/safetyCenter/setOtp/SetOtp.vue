<template>
    <!-- 谷歌验证设置 -->
    <div class="setOtp">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.GoogleSettings')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 设置 -->
        <div class="otp" v-if="!approve">
            <!-- 密钥 -->
            <div class="setting secretkey jus-b">
                <div class="txt">
                    <span>{{$t('personage.SecretKey')}}</span>
                </div>
                <input type="text" readonly v-model="secretKey">
                <div class="copy">
                    <span>{{$t('wallet.Copy')}}</span>
                </div>
            </div>
            <!-- 谷歌验证码 -->
            <div class="setting otpcode jus-b">
                <div class="txt" style="width:30%">
                    <span>{{$t('personage.GoogleVCode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PleaseGoogleVCode')" v-model="otpCode">
            </div>
        </div>
        <!-- 取消谷歌验证 -->
        <div class="otp" v-if="approve">
            <div class="cancell-google setting jus-b">
                <div class="txt">
                    <span>{{$t('personage.GoogleVCode')}}</span>
                </div>
                <input type="text" :placeholder="$t('personage.PleaseGoogleVCode')" v-model="otpCode">
            </div>
        </div>
        <!-- 提示 -->
        <div class="text">
			<p>1、{{$t('personage.hint')}}</p>
			<p>2、{{$t('personage.pasteKey')}}</p>
			<p>3、{{$t('personage.CopyOtp')}}</p>
			<p style="color:#808080">{{$t('personage.warn')}}</p>
		</div>
        <div class="open" @click="openApprove()" v-if="!approve">
            <mt-button  @click="openApprove()" class="btn" :disabled="disabled">
                <span>{{$t('personage.open')}}</span>
            </mt-button>
        </div>
        <div class="open" @click="cancelApprove()" v-if="approve">
            <mt-button  @click="cancelApprove()" class="btn" :disabled="disabled">
                <span>{{$t('personage.cancel')}}</span>
            </mt-button>
        </div>
        <!-- 弹框 -->
        <div class="verify" v-show="showDialog">
            <!-- 身份验证 -->
            <div class="identity">
                <span>{{$t('personage.authentication')}}</span>
            </div>
            <!-- 密码验证 -->
            <div class="mode">
                <div class="txt">
                    <span>{{$t('personage.Pauthentication')}}</span>
                </div>
                <div class="codes">
                    <input type="password" :placeholder="$t('personage.PleasePass')" v-model="pass">
                </div>
            </div>
            <!-- 确定、取消 -->
            <div class="footer jus-b">
                <mt-button class="confirm" @click="confirm()">{{$t('personage.confirm')}}</mt-button>
                <mt-button class="cancel" @click="cancel()">{{$t('personage.cancels')}}</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
export default {
    // 谷歌验证设置
    name:'SetOtp',
    data(){
        return{
            secretKey:'',//密钥
            showDialog:false,//验证方式是否显示
            pass:'',//密码
            otpCode:'',//谷歌验证码
            approve:false,//开启或取消认证
            disabled:false,//让button按钮失效
        }
    },
    mounted(){
        this.getSecret()
    },
    methods:{
        //获取密钥
        getSecret(){
            this.$api.user.getSecretKey().then(res =>{
                this.secretKey = res.secret;
                console.log(this.secretKey )
                if(!this.secretKey){
                    this.approve = true;
                }else{
                    this.approve = false;
                }
            }).catch(err =>{
                if(err.data.error) this.$toast('error.'+err.data.error);
            })
        },
        //开启谷歌认证
        openApprove(){
            if(this.otpCode){
                this.disabled = true;
                this.$api.user.openGoogle().then(res =>{
                    if(res.verify || res.password){
                        this.showDialog = true;
                    }
                }).catch(err =>{
                    this.disabled = false;
                    if(err.data.message) this.$toast(this.$t('error.'+err.data.message))
                })
            }else{
                this.$toast(this.$t('personage.GoogleNull'))
            }
        },
        //取消谷歌认证
        cancelApprove(){
            if(this.otpCode){
                this.disabled = true;
                this.$api.user.setOtp({
                    code:this.otpCode,
                    open:false
                }).then(res =>{
                    this.approve = false;
                    this.otpCode = '';
                    this.getSecret();
                }).catch(err =>{
                    this.disabled = false;
                    if(err.data.error) this.$toast('error.'+err.data.error);
                })
            }else{
                this.$toast(this.$t('personage.GoogleNull'))
            }
        },
        //弹框确定开启
        confirm(){
            if(!this.pass){
               this.$toast(this.$t('personage.ThePasswordEmpty'))
                this.showDialog = false;
                return
            }
            this.$api.user.setOtp({
                code:this.otpCode,
                open:true
            }).then(res =>{
                this.showDialog = false;
                this.approve = true;
                this.otpCode = '';
            }).catch(err =>{
                if(err.data.message) this.$toast(this.$t('error.'+err.data.message))    
                console.log(err)
            })
        },
        //关闭弹框
        cancel(){
            this.showDialog = false;
            this.otpCode = '';
            this.disabled = false;
        },
        //复制
        copy(){
            
        }
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
.setOtp{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: @pub-bg;
    .otp{
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
                width: 24%;
                overflow: hidden;
            }
            input{
                width: 66%;
                background: #fff;
            }
            .copy{
                width: 20%;
                height: .6rem;
                background: @main-cor;
                color: #fff;
                line-height: .6rem;
                border-radius: .1rem;
                text-align: center;
                margin-top: .16rem;
            }
        }
        .otpcode{
            input{
                width: 76%;
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

    .text{
        margin: 0.2rem;
        line-height: .5rem;
    }
    .open{
        margin: 2rem .2rem;
        height: .88rem;
        line-height: .88rem;
        border-radius: .1rem;
        text-align: center;
        font-size: .32rem;
        .btn{
            width: 100%;
            background: @main-cor;
            color:#fff;
        }
    }
    .verify{
        width: 90%;
        position: absolute;
        left: 50%;
        top: 46%;
        z-index: 25;
        transform: translate(-50%,-50%);
        background: #fff;
        font-size: .32rem;
        border-radius: .2rem;
        box-shadow: 0 0 2px @bord-col;
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
                border: 1px solid @bord-col;
                input{
                    width: 60%;
                    border: none;
                    outline: none;
                    padding-left: .3rem;
                }
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
}
</style>
