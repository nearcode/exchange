<template>
    <div>
        <!-- 图片验证 -->
        <mt-popup
            v-model="isShow"
            popup-transition="popup-fade"
            class="flexc">
            <div class="vali">
                <div class="jus-b">
                    <input type="text border" placeholder="请输入图片验证" v-model="imgCode">
                    <div class="img"><img src="@/assets/coins/ada.png" alt="" class="fill"></div>
                </div>
                <div class="submit flexc" @click="sureLogin">确 认</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isShow:true,
            imgCode:'',//验证码
        }
    },
    methods: {
        sureLogin() {
            this.isShow = false;
            this.$emit('imgLogin',this.imgCode);
        }
    }
}
</script>
<style lang="less" scoped>
@import url('~@/style/mixin');
    .mint-popup /deep/ {
            width: 6rem;
            .border-radius(.1rem);
            height: 3.4rem;
        }
        .vali {
            width: 6rem;
            height: 3.4rem;
            padding:.6rem;
            .border-radius(.1rem);
            background-color: #fff;
            input {
                width: 3rem;
                height: .8rem;
                padding-left: .2rem;
                font-size: .26rem;
                
            }
            .img {
                width: 1.6rem;
                height: 1rem;
            }
            .submit {
                width: 100%;
                height: .7rem;
                font-size: .26rem;
                color:#fff;
                background-color: @main-cor;
                margin: .4rem auto;
                .border-radius(.1rem);
            }
        }
</style>

