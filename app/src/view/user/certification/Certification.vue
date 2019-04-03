<template>
    <!-- 实名认证 -->
    <div class="certification">
        <!-- 头部 -->
        <pubHead 
            :title="$t('personage.Certification')"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor"
            :titleColor="$config.color.titleCor">
        </pubHead>
        <!-- 填写信息 -->
        <div class="wrapper">
            <form action="" class="content">
                <!-- 填写认证信息 -->
                <div class="write-message">
                    <!-- 状态等于0时 -->
                    <div class="info" v-if="certification.status == 0">
                        <div class="title">
                            <span>{{$t('personage.Information')}}</span>
                        </div>
                        <!-- 填写姓名和身份证号、温馨提示 -->
                        <div class="write-info">
                            <!-- 填写姓名 -->
                            <div class="write write-name jus-b">
                                <div class="icon">
                                    <span class="iconfont icon-icon-"></span>
                                </div>
                                <input type="text" :placeholder="$t('personage.Truename')" v-model="truename">
                            </div>
                            <!-- 填写身份证号 -->
                            <div class="write write-id jus-b">
                                <div class="icon">
                                    <span class="iconfont icon-webicon301"></span>
                                </div>
                                <input type="text" :placeholder="$t('personage.ValidID')" v-model="IDCard">
                            </div>
                            <!-- 温馨提示 -->
                            <div class="hint">
                                <span>*{{$t('personage.Sweet')}}</span>
                            </div>
                        </div>
                        <!-- 上传证件信息 -->
                        <div class="up-info">
                            <div class="txt">
                                <span>{{$t('personage.UpInfo')}}</span>
                            </div>
                            <!-- 上传身份证正反面 -->
                            <div class="up jus-b">
                                <!-- 上传身份证正面 -->
                                <div class="up-front face">
                                    <div class="link">
                                        <imgs auto-upload :action="api_url+'/account/upload'" :on-success="frontSuccess" :on-error="frontError" accept="image/jpg" theme="light" size="small"/>
                                    </div>
                                    <div class="text" @click="frontSamples()">
                                        <span>{{$t('personage.Front')}}</span>
                                    </div>
                                </div>
                                <!-- 上传身份证反面 -->
                                <div class="up-side face">
                                    <div class="link">
                                        <imgs auto-upload :action="api_url+'/account/upload'" :on-success="versoSuccess" :on-error="versoError" accept="image/jpg" theme="light" size="small"/>
                                    </div>
                                    <div class="text" @click="versoSamples()">
                                        <span>{{$t('personage.Verso')}}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 手持身份证 -->
                            <div class="up-handle jus-b">
                                <!-- 手持身份证 -->
                                <div class="up-front face">
                                    <div class="link">
                                        <imgs auto-upload :action="api_url+'/account/upload'" :on-success="handSuccess" :on-error="handError" accept="image/jpg" theme="light" size="small"/>
                                    </div>
                                    <div class="text" @click="handSamples()">
                                        <span>{{$t('personage.Hand')}}</span>
                                    </div>
                                </div>
                                <!-- 提示 -->
                                <div class="text-hint">
                                    <span>{{$t('personage.Thint')}}</span>
                                </div>
                            </div>
                            <!-- 提交认证 -->
                            <div class="submit" @click="submit()">
                                <span>{{$t('personage.SubmitCer')}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 状态等于1时 -->
                    <div class="info" v-if="certification.status == 1" style="font-size:.3rem">
                        <span>{{$t('personage.Pass')}}</span>
                    </div>
                    <!-- 状态等于2时 -->
                    <div class="info" v-if="certification.status == 2" style="font-size:.3rem">
                        <span>{{$t('personage.Audit')}}</span>
                    </div>
                    <!-- 状态等于-1时 -->
                    <div class="info" v-if="certification.status == -1">
                        <div class="audit one">
                            <span>{{$t('personage.NotPass')}}</span>
                        </div>
                        <div class="cause one">
                            <span>{{$t('personage.Cause')}}</span>
                            <span style="color:red">{{certification.reason}}</span>
                        </div>
                        <div class="submit one" @click="againSubmit()">
                            <span>{{$t('personage.AgainV')}}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <!-- 示例 -->
        <!-- 正面示例 -->
        <div class="frontsample sample" v-if="frontSample">
            <img src="./images/exa1.png" alt="">
            <span class="close" @click="close()">&times;</span>
        </div>
        <!-- 反面示例 -->
        <div class="versosample sample" v-if="versoSample">
            <img src="./images/exa2.png" alt="">
            <span class="close" @click="close()">&times;</span>
        </div>
        <!-- 手持身份证示例 -->
        <div class="handsample sample" v-if="handSample">
            <img :src="'/static/images/'+$config.site+'.png'" alt="">
            <span class="close" @click="close()">&times;</span>
        </div>
    </div>
</template>

<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
// 引入点击上传图片组件
import imgs from '@/common/imgInputer/imgInputer.vue';
import 'vue-img-inputer/dist/index.css'
export default {
    // 实名认证
    name:'Certification',
    data(){
        return{
            api_url: API_URL,
            truename:'',//名字
            IDCard:'',//身份证号码
            frontimg:'',//身份证正面
            versoimg:'',//身份证反面
            handimg:'',//手持身份证
            frontSample:false,//正面示例
            versoSample:false,//反面示例
            handSample:false,//手持身份证
            certification:{},//验证状态
        }
    },
    methods:{
        // 查看正面示例
        frontSamples(){
            this.frontSample = true;
        },
        //查看反面示例
        versoSamples(){
            this.versoSample = true;
        },
        //查看手持身份证示例
        handSamples(){
            this.handSample = true;
        },
        //关闭示例
        close(){
            this.frontSample = false;
            this.versoSample = false;
            this.handSample = false;
        },
        //正面上传成功
        frontSuccess(res,file){
            this.frontimg = res.attachment_url;
        },
        //正面上传失败
        frontError(){
            this.$toast(this.$t('personage.FrontErr'));
        },
        // 反面上传成功
        versoSuccess(res,file){
            this.versoimg = res.attachment_url;
        },
        // 反面上传失败
        versoError(){
             this.$toast(this.$t('personage.VersoErr'));
        },
        //手持身份证上传成功
        handSuccess(res,file){
            this.handimg = res.attachment_url;
        },
        // 手持身份证上传失败
        handError(){
             this.$toast(this.$t('personage.HandErr'));
        },
        //获取验证状态
        getCertifications(){
            this.$api.user.getCertification().then((result) =>{
                this.certification = result
            })
        },
        //提交认证
        submit(){
            if(!this.truename) return  this.$toast(this.$t('personage.PName'));
            if(!this.IDCard) return  this.$toast(this.$t('personage.PNum'));
            if(!this.frontimg || !this.versoimg || !this.handimg) return  this.$toast(this.$t('personage.Await'));
            this.$api.user.submitCertification({
                truename:this.truename,
                idcard:this.IDCard,
                imga:this.frontimg,
                imgb:this.versoimg,
                imgc:this.handimg
            }).then(res =>{
                this.getCertifications();
                this.$toast(this.$t('personage.SubmitSuccess'));
            }).catch(err =>{
                if (err){
                    let error = err.data.error || err.data.message;
                    this.$toast(error)
                }
            })
        },
        // 重新验证
        againSubmit(){
            this.certification.status = 0;
        }
    },
    mounted(){
        //获取验证状态
        this.getCertifications()
    },
    // 声明组件
    components :{
        pubHead,
        imgs
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.certification{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 15;
    background: @pub-bg;
    .wrapper{
        position: absolute;
		top:.88rem;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
        overflow: hidden;
        .content{
            width: 95%;
            margin: .2rem auto;
            .info{
                .title{
                    height: .6rem;
                    line-height: .6rem;
                    padding-left: .2rem;
                }
                // 填写姓名和身份证号、温馨提示
                .write-info{
                    border-radius: .1rem;
                    &>div:first-child{
                        border-top-left-radius: .1rem;
                        border-top-right-radius: .1rem;
                    }
                    &>div:last-child{
                        border-bottom-left-radius: .1rem;
                        border-bottom-right-radius: .1rem;
                    }
                    // 填写姓名 填写身份证号 
                    .write{
                        height: .88rem;
                        line-height: .88rem;
                        background: #fff;
                        border-bottom: 1px solid @bord-col;
                        .icon{
                            width: 10%;
                            text-align: center;
                        }
                        input{
                            width: 90%;
                            padding-left: 0.2rem;
                            &::placeholder{
                                font-size: .2rem;
                            }
                        }
                    }
                    // 温馨提示
                    .hint{
                        margin-top: .2rem;
                        line-height: .4rem;
                        font-size: .2rem;
                        color: #ccc;
                    }
                }
                // 上传证件信息
                .up-info{
                    .up{
                        // 上传身份证正反面
                        .face{
                            width: 3.4rem;
                            .link{
                                width: 3.4rem;
                                height: 2rem;
                                border-radius: .1rem;
                                background-image: url('./images/front.png');
                                background-size: 3.6rem 2rem;
                                background: #fff;
                                text-align: center;
                                line-height: .6rem;
                                input{
                                    opacity: 0;
                                    width: 3.6rem;
                                    height: 2rem;
                                    outline: none;
                                }
                            }
                            .text{
                                text-align: center;
                                height: 0.6rem;
                                line-height: .6rem;
                                color: #ffd48e;
                            }
                        }
                    }
                    .txt{
                        height: .6rem;
                        line-height: .6rem;
                        padding-left: .2rem;
                        font-weight: bold;
                        color: #ffd48e;
                    }
                    // 手持身份证
                    .up-handle{
                        .face{
                            width: 3.4rem;
                            .link{
                                width: 3.4rem;
                                height: 2rem;
                                border-radius: .1rem;
                                background-image: url('./images/front.png');
                                background-size: 3.6rem 2rem;
                                background: #fff;
                                text-align: center;
                                line-height: .6rem;
                                input{
                                    opacity: 0;
                                    width: 3.6rem;
                                    height: 2rem;
                                    outline: none;
                                }
                            }
                            .text{
                                text-align: center;
                                height: 0.6rem;
                                line-height: .6rem;
                                color: #ffd48e;
                            }
                        }
                        // 提示
                        .text-hint{
                            width: 3.4rem;
                            height: 2rem;
                            font-size: .2rem;
                            color: #ccc;
                        }
                    }
                    // 提交认证
                    .submit{
                        height: .88rem;
                        background: #201a0e;
                        border-radius: .1rem;
                        text-align: center;
                        line-height: .88rem;
                        color: #ffd48e;
                        font-size: .32rem;
                        margin-top: .6rem;
                    }
                }
                // 状态等于-1时
                .one{
                    font-size: 0.3rem;
                    height: .6rem;
                    line-height: .6rem;
                }
                .cause{
                    height: 1rem;
                    line-height: 1rem;
                }
                //重新验证
                .submit{
                    height: .88rem;
                    background: @main-cor;
                    border-radius: .1rem;
                    text-align: center;
                    line-height: .88rem;
                    color: #fff;
                    font-size: .32rem;
                    margin-top: .6rem;

                }
            }
        }
    }
    // 示例
    .sample{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        opacity: 1;
        background: rgba(7, 17, 27, 0.2);
        width: 100%;
        height: 100%;
        img{
            position: fixed;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -35%);
            width: 7rem;
            height: 4rem;
        }
        .close{
            position: fixed;
            left: 50%;
            bottom: 3.3rem;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: space-around;		
            color: #fff;
            font-size: .6rem;
            border-radius: 50%;
            width: 1rem;
            height: 1rem;
            border: 1px solid @bord-col;
        }
    }
}
.img-inputer__err{
	text-align: center;
    background: @bord-col;
    padding: 0.2rem;
	text-align: center;
}
.img-inputer--small{
	width: 100%;
}
.img-inputer__preview-img{
	width: None;
	height: 100%;
}
</style>
