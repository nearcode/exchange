<template>
    <header class="pub-head">
        <div class="head-box" v-bind:style="{backgroundColor: bgColor}" :class="{'head-red':themeColor=='true'}">
            <div class="left ali-c" @click="back" v-if="isbackShow">
                <span class="line line1" :style="{backgroundColor: leftColor}"></span>
                <span class="line line2" :style="{backgroundColor: leftColor}"></span>
                <div class="back-text ali-c" :style="{color: leftColor}">{{$t('wallet.back')}}</div>
            </div>
            <div class="left ali-c left-ico" v-if="leftSolt">
                <slot name="left"></slot>
            </div>
            <div class="title" :style="{color: titleColor}" @click="deal">{{title}}</div>
            <div class="right flexc" :style="{color: rightColor, fontSize: rightSize}">
                <slot></slot>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data () {
        return {
            bgcor: this.bgColor,
        }
    },
    
    props: {
        // 头部标题
        title: {
            type: String,
            default: '标题'
        },
        // 左侧自定义图标
        leftSolt: {
            type:Boolean,
            default:false
        },
        titleColor: {
            type: String,
            default: '#333'
        },
        //左侧返回图标
        isbackShow: {
            type:Boolean,
            default:false
        },
        // 头部背景色
        bgColor: {
            type: String,
            default: '#fff'
        },

        // 头部主题色
        themeColor: {
            type: String,
            default: 'false'
        },
        // 左边图标颜色
        leftColor: { 
            type: String,
            default: '#333'
        },
        // 右边文字尺寸
        rightSize: {
            type: String,
            default: '0.26rem'
        },
        // 右边文字颜色
        rightColor: {
            type: String,
            default: '#333'
        },
        
    },

    methods: {
        // 返回上一页
        back() {
            this.$router.go(-1);
        },
        deal() {
            this.$emit('deal');
        }
    }
}
</script>

<style lang="less" scoped>
 @import url('../../style/mixin');
    .pub-head {
        width: 100%;
        height: 0.88rem;
        .head-box {
            position: fixed;
            top: 0;
            width: 100%;
            max-width: 750px;
            height: 0.88rem;
            z-index: 10;
            .left-ico {
                padding-left: .28rem;
            }
            .left {
                width: 1.2rem;
                position: absolute;
                left: 0;
                top: 0;
                height: 0.88rem;
                .line {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 0.12rem;
                    width: 0.24rem;
                    height: 1px;
                    background-color: #333;
                }
                .line1 {
                    margin-top: -0.08rem;
                     -moz-transform: rotate(-45deg);
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg);
                }
                .line2 {
                    margin-top: 0.08rem;
                    -moz-transform: rotate(45deg);
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
                .back-text {
                    font-size: .3rem;
                    margin-left: .42rem;
                    color: #f7c574;
                }
            }
            .title {
                width: 100%;
                height: 100%;
                line-height: 0.88rem;
                text-align: center;
                font-size: 0.34rem;
            }
            .right {
                position: absolute;
                right: 0;
                top: 0;
                height: 0.88rem;
                padding: 0 .25rem;
            }
        }
        /* 主题色 */
        .head-red {
            .bg-cor-ltr(#f1981b, #fd6050);
        }
        .seat {
            height: 0.88rem;
        }    
    }
</style>
