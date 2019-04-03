<template>
    <!-- 登录密码设置 -->
    <div class="setPass">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.LoginSetting')" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 设置 -->
        <div class="pass">
            <!-- 新登录密码 -->
            <div class="setting newPass jus-b">
                <div class="txt">
                    <span>{{$t('personage.NewLoginPassword')}}</span>
                </div>
                <input type="password" :placeholder="$t('personage.PleaseNewPassword')" v-model="password"> 
            </div>
            <!-- 再次输入登录密码 -->
            <div class="setting newPass jus-b">
                <div class="txt">
                    <span>{{$t('personage.NewLoginPassword')}}</span>
                </div>
                <input type="password" :placeholder="$t('personage.PasswordAgain')" v-model="newPass"> 
            </div>
            <div class="message" style="color:red">
                <span>{{message}}</span>
            </div>
        </div>
        <!-- 提交验证 -->
        <div class="submit">
             <mt-button  @click="submit()" class="btn" :disabled="disabled">
                <span>{{$t('personage.SubmitTheValidation')}}</span>
            </mt-button>
            
        </div>
        <!-- 弹出框 -->
        <vmode ref="vmodes" v-on:code="setCode"></vmode>

    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
//引入验证方式组件
import VMode from '@/common/VMode/VMode';
export default {
     // 登录密码设置
    name:'SetPass',
    data(){
        return{
            password:'',//密码
            newPass:'',//确认密码
            message:'',//提示
            code:'',//验证码
            disabled:false,//让button按钮失效
        }
    },
    methods:{
        // 提交验证
        submit(){
            if(!this.password || !this.newPass){
                this.message = this.$t('personage.ThePasswordEmpty')
            }else if(this.password.length < 8 || this.newPass.length < 8){
                this.message = this.$t('personage.ThePassword8Bits')
            }else if(this.password != this.newPass){
                this.message = this.$t('personage.PasswordsDiffer')
            }else if(this.password == this.newPass){
                this.disabled = true;
                this.$api.user.changePassword({
                    newPassword:this.newPass,
                    authCode:this.code
                }).then(res =>{
                    this.$store.commit('loginOut');
                    this.$router.push({path:'/login'})
                }).catch(err =>{
                    if(!err) return;
                    let stencil = this.$refs.vmodes;
                    stencil.init(this);
                    if(err.data.authType){
                        stencil.showBounced({
                            authType:err.data.authType,
                            callback:this.submit
                        })
                    }
                    if(err.data.message){
                        if(err.data.message) this.$toast(this.$t('error.'+err.data.message))
                    }
                })
            }
        },
        //验证码
        setCode(code){
            this.code = code;
            console.log(this.code)
        }
    },
    //监听
    watch: {
        // 密码
        password() {
            if (this.password.length < 8) {
                this.message = this.$t('personage.ThePassword8Bits')
            } else {
                this.message = ''
            }
        },
        // 二次输入密码
        newPass() {
            if (this.newPass != this.password) {
                this.message = this.$t('personage.PasswordsDiffer')
            } else {
                this.message = ''
            }
        }
    },
    // 声明组件
    components :{
        pubHead,
        'vmode':VMode,
    },
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.setPass{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: @pub-bg;
    .pass{
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
                width: 36%;
            }
            input{
                width: 74%;
                height: .86rem;
                line-height: .86rem;
                border: none;
                outline: none;
                &::placeholder{
                    font-size: .28rem;
                    color: #9b9b9b;
                }
            }
        }
    }
    .submit{
        margin: 2rem .2rem;
        height:.88rem;
        line-height: .88rem;
        text-align: center;
        border-radius: .1rem;
        font-size: .32rem;
        .btn{
            width: 100%;
            background: @main-cor;
            color:#fff;
        }
    }
}
</style>
