<template>
    <!-- 关注币种 -->
    <div class="focusCurrency">
        <!-- 搜索 -->
        <div class="seach">
            <span class="iconfont icon-sousuo"></span> 
            <input type="text" :placeholder="$t('personage.EnterFiltering')" v-model="search">
        </div>
        <!-- 关注 -->
        <div class="attention">
            <span>{{$t('personage.FocusOnTheCurrency')}}</span>
            <span>({{focusList.length}}{{$t('personage.Seed')}})</span>
        </div>
        <!-- 关注列表 -->
        <scroll class="focusCurrency-list">
            <draggable class="focus-list" v-model="focusList" :option="dragOptions" :move="onMove">
                <div class="list jus-b" v-for="(item,index) in filterData" :key="index" @click="toDeal(item)">
                    <div class="coin" @click.stop="stopPropagation">
                        <span class="iconfont icon-jian" @click.once="delConcern(index)"></span>
                        <img :src="'static/coins/' + item.split('_')[1].toLowerCase() + '.png'">
                        <span>{{item}}</span>
                    </div>
                    <div class="font">
                        <span class="iconfont icon-caidan1" @touchstart="touch"></span>
                    </div>
                </div>
            </draggable>
        </scroll>
    </div>
</template>

<script>
    import Scroll from "@/common/scroll/scroll";//引入滚动组件
    import draggable from 'vuedraggable';//引入拖拽组件
export default {
    // 关注币种
    name:'FocusCurrency',
    data(){
        return{
            // 关注币种列表
            focusList:[],
            search:'',//搜索
        }
    },
    mounted(){
        this.$api.user.getFocus().then(res =>{
            this.focusList = res.favorites
        })
        console.log(this.focusList)
    },
    methods:{
        //阻止时间冒泡
        stopPropagation(){
            return 
        },
        touch(event){
            // 当拖动排序时，阻止better-scroll滚动
            event.stopPropagation()
        },
        // 删除关注的币种
        delConcern(index,e){
            this.focusList.splice(index,1);
            this.$api.user.getDelConcern({
                pair:this.focusList
            }).then(res =>{
                console.log(res)
            })
        },
        onMove () {
	    // 过滤后禁止拖拽
	      return !this.search
        },
        // 跳转到交易页面
        toDeal(val){
            this.$router.push('/deal/buy?coin='+val)
        }
    },
    computed:{
        // 过滤
        filterData(){
            var searchs = this.search;
            if(searchs){
                return this.focusList.filter(function(obj){
                    return obj.indexOf(searchs.toUpperCase().trim()) > -1
                })
            }else{
                return this.focusList
            }
        },
        dragOptions() {
            return  {
                handle: '.drag',
                ghostClass: 'ghost'
            }
        }
    },
     // 声明组件
    components :{
        Scroll,
        draggable
    },
}
</script>

<style lang="less" scoped>
.focusCurrency{
    position: absolute;
	top: 1.46rem;
	bottom: 0;
	z-index: 20;
	width: 100%;
    background: #f6f6f6;
    // 搜索
    .seach{
        margin: 0.3rem;
        height: .6rem;
        line-height: .6rem;
        border-radius: .3rem;
        background: #fff;
        span{
            display: inline-block;
            width: .8rem;
            height: .6rem;
            text-align: center;
        }
        input{
            width: 80%;
            height: .5rem;
            line-height: .5rem;
        }
    }
    // 关注
    .attention{
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
    }
    // 关注列表
    .focusCurrency-list{
        width: 95%;
        position: absolute;
        left:50%;
        top: 2rem;
        bottom: 0;
        overflow: hidden;
        transform: translateX(-50%);
        .focus-list{
            width: 100%;
            .list{
                height: 0.8rem;
                line-height: 0.8rem;
                background: #fff;
                padding-left: .2rem;
                padding-right: 0.2rem;
                border-bottom: 1px solid #f6f6f6;
                .coin{
                    img{
                        width: .6rem;
                        padding-bottom: .1rem;
                        padding-left: .2rem;
                    }
                    .iconfont{
                        color: red;
                    }
                }
                .font{
                    width: 10%;
                    text-align: center;
                }
            }
        }
    }
}
</style>
