<template>
    <!-- 验证方式 -->
    <div class="verify">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.Manner')" 
            titleColor="#fff"
            :isbackShow = 'true'
            leftColor="#fff"
            bgColor="#3b82de">
        </pubHead>
        <!-- 验证类型 -->
        <div class="verify-type">
            <mt-radio :title="$t('personage.LMV')" v-model="select" :options='options' align="right" @change="change"></mt-radio>
        </div>

        <!-- 弹框验证 -->
       <vmode ref="vmodes" v-on:code="setCode"></vmode>
       
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
// 引入弹框验证
import vmode from '@/common/VMode/VMode'
export default {
     // 验证方式
    name:'SafetyCenter',
    data(){
        return{
            password:'',//密码
            otp:'',//谷歌
            email:'',//邮箱
            mobile:'',//手机
            select:'',//选择验证方式
            code:'',//验证码
            authType:this.$store.state.authType,//获取验证类型
            selectType:'',//切换的类型
            // 设置选项
            options:[
                {
                    label:this.$t('personage.PV'),
                    value:'password',
                },
                {
                    label:this.$t('personage.OV'),
                    value:'otp',
                },
                {
                    label:this.$t('personage.EV'),
                    value:'email',
                },
                {
                    label:this.$t('personage.MV'),
                    value:'mobile',
                }
            ]
        }
    },
    mounted(){
        if (this.authType.password) this.select = 'password';
        if (this.authType.email) this.select = 'email';
        if (this.authType.otp) this.select = 'otp';
        if (this.authType.mobile) this.select = 'mobile';
        this.selectType = this.select;
        console.log(this.select)
    },
    methods:{
        // 切换验证类型
        change(){
            if(!this.select) return;
            this.$nextTick(() =>{
                this.$api.user.getAuthType({
                    type:this.select,
                    authCode:this.code
                }).then(res =>{
                    this.selectType = this.select;
                    this.$toast(this.$t('personage.CutSuccess'))
                }).catch(err =>{
                    if(!err) return;
                    this.code = '';
                    let stencil = this.$refs.vmodes;
                    stencil.init(this);
                    if(err.data.authType){
                        stencil.showBounced({
                            authType:err.data.authType,
                            callback:this.change,
                        })
                    }
                    if(err.data.error){
                        if (err.data.error == 'unbind_otp') {
                            this.$toast(this.$t('personage.POO'));
                            setTimeout(() => {
                                this.$router.push({
                                    path: "./setOtp"
                                });
                            }, 3000);
                        }else if(err.data.error == 'unbind_mobile'){
                            this.$toast(this.$t('persomage.PBM'));
                             setTimeout(() => {
                                this.$router.push({
                                    path:'./setMobile'
                                })
                            }, 3000);
                        }else{
                            this.$toast(this.$t(err.data.error));
                        }
                    }
                })
            })
        },
        // 获取验证码
        setCode(code){
            this.code = code;
        },
    },
    // 声明组件
    components :{
        pubHead,
        vmode
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.verify{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    background: @pub-bg;
    .verify-type{
        margin: .2rem;
    }
}
</style>
