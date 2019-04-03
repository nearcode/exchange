<template>
    <transition name="slide">
        <!-- 通知 -->
        <div class="inform">
            <!-- 头部 -->
            <pubHead 
                :title="$t('deal.Inform')" 
                :bgColor="$config.color.mainCor"
                :titleColor="$config.color.titleCor"
                :isbackShow = 'true'
                leftColor="#fff">
            </pubHead>
            <!-- 公告列表 -->
            <scroll class="notice-list">
                <div class="list">
                    <div class="notice" v-for="item in newList">
                        <div class="notice-timer">
                            <!-- 时间日期 -->
                            <div class="timer">
                                <span>{{item.date | toDate}}</span>
                            </div>
                        </div>
                        <!-- 公告内容 -->
                        <div class="notice-txt" @click="toDetail(item._id)">
                            <p v-if="item.type==1">[财报]</p>
                            <p v-if="item.type==2">[研报]</p>
                            <p v-if="item.type==3">[新闻]</p>
                            <p v-if="item.type==4">[公告]</p>
                            <p v-if="item.type==5">[声明]</p>
                            <p v-if="item.type==6">[上币]</p>
                            <p>{{item.title}}</p>
                        </div>
                    </div>
                </div>
            </scroll>
            <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
                <router-view></router-view>
            </transition>
        </div>
    </transition>
</template>

<script>
import pubHead from '@/common/head/head.vue';
import Scroll from "@/common/scroll/scroll";
export default {
    // 新闻
    name:'Inform',
    data(){
        return{
            newList:[],//新闻列表
            limit:7,//一次显示七条新闻
            page:1,//页数
            totalItems:'',//所有新闻
        }
    },
    // 声明组件
    components:{
        pubHead,
        Scroll
    },
    mounted(){
        this.getNewLists()
    },
    methods:{
        // 跳转到公告详情
        toDetail(id){
            this.$router.push({
                name:'Detail',
                params:{
                    id:id
                }
            })
        },
        // 获取新闻列表数据
        getNewLists(){
            this.$api.user.getNewList({
                limit:this.limit,
                p:this.page
            }).then(res =>{
                this.totalItems = res.totalItems;
                this.newList = this.newList.concat(res.resultList);
            })
        },
    },
}
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.inform{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: @pub-bg;
    z-index: 20;
    overflow: hidden;
    .notice-list{
        position: absolute;
        left: 0;
        bottom: 0;
        top: .88rem;
        width: 100%;
        background: @pub-bg;    
        .list{
            margin: 0.2rem;
            .notice{
                    .notice-timer{
                    width: 100%;
                    height: .72rem;
                    line-height: .72rem;
                    padding-top: .2rem;
                    .timer{
                        width: 2.8rem;
                        height: .36rem;
                        line-height: .36rem;
                        background: #fff;
                        text-align: center;
                        font-size: .2rem;
                        margin:auto;
                    }
                }
                .notice-txt{
                    height: 1.12rem;
                    background: #fff;
                    border-radius: .1rem;
                    line-height: .5rem;
                    padding-left: .2rem;
                    padding-right: 0.2rem;
                    font-size: .32rem;
                    color: #4b4b4b;
                    overflow: hidden;
                    &>p:last-child{
                        font-size: .24rem;
                        color: #636363;
                    }
                }
            }
        }
        .not{
            margin-top: .2rem;
        }
    }
}
.slide-enter-active, &.slide-leave-active{
	transition: all .3s
}
.slide-enter, &.slide-leave-to{
	transform: translate3d(-100%, 0, 0)
}
.slideInRight, .slideOutRight{
	animation-duration: 300ms;
}   
</style>
