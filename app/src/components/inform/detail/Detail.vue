<template>
    <!-- 公告详情 -->
    <div class="detail">
         <!-- 头部 -->
        <pubHead 
            title="公告详情" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 内容 -->
        <scroll class="detail-txt">
            <div class="txt">
                <div class="title">
                    <p>{{detailList.title}}</p>
                    <div class="timer">
                        <!-- <span>阅览：</span>
                        <span>0427次</span> -->
                        <span>时间：</span>
                        <span>{{detailList.date | toDate}}</span>
                    </div>
                </div>
                <div class="message">
                    <div class="list" v-html="detailList.content"></div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
import pubHead from '@/common/head/head.vue';
import Scroll from "@/common/scroll/scroll";
export default {
    // 公告详情
    name:'Detail',
    // 声明组件
    data(){
        return{
            id:this.$route.params.id,//获取传入的ID值
            detailList:[],//详情列表
        }
    },
    mounted(){
        this.$api.user.getShow(this.id).then(res =>{
            this.detailList = res
        })
    },
    components :{
        pubHead,
        Scroll
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.detail{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 25;
    background: @pub-bg;
    overflow: hidden;
    .detail-txt{
        position: absolute;
        left: 0;
        bottom: 0;
        top: .88rem;
        width: 100%;
        background: @pub-bg;
        .txt{
            background: #fff;
            border-radius: .1rem;
            margin: 0.2rem;
            box-shadow: 1px 1px 1px 1px @bord-col;
            .title{
                height: 1.34rem;
                padding-left: .2rem;
                padding-right: .2rem;
                line-height: .7rem;
                font-size: .32rem;
                border-bottom: 1px solid @bord-col;
                &>div{
                    font-size: .2rem;
                    color: #b5b5b5;
                }
            }
            .message{
                margin-top: .6rem;
                padding-left: .2rem;
                padding-right: .2rem;
                .topic{
                    height: .96rem;
                    line-height: .96rem;
                    font-size: .32rem; 
                    color: #535353;
                }
                .list{
                    line-height: .6rem;
                    color: #5b5b5b;
                }
            }
        }
    }
}
</style>
