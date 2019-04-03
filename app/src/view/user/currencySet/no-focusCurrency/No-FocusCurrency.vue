<template>
    <!-- 未关注币种 -->
    <div class="focusCurrency">
        <!-- 搜索 -->
        <div class="seach">
            <span class="iconfont icon-sousuo"></span>
            <input type="text" :placeholder="$t('personage.EnterFiltering')" v-model="search">
        </div>
        <!-- 未关注 -->
        <div class="attention">
            <span>{{$t('personage.NoCurrencyConcerns')}}</span>
            <span>({{nofocusList.length}}{{$t('personage.Seed')}})</span>
        </div>
        <!-- 未关注列表 -->
        <scroll class="focusCurrency-list">
            <draggable class="focus-list" v-model="nofocusList" :move="onMove" :option="dragOptions">
                <div class="list jus-b" v-for="(item,index) in filterData" :key="index">
                    <div class="coin">
                        <span class="iconfont icon-jia1" @click.once="addConcern(item,index)"></span>
                        <img :src="'static/coins/' + item.split('_')[1].toLowerCase() + '.png'">
                        <span @click="toDeal(item)">{{item}}</span>
                    </div>
                    <div class="font" @touchstart="touch">
                        <span class="iconfont icon-caidan1"></span>
                    </div>
                </div>
            </draggable>
        </scroll>
    </div>
</template>

<script>
    import Scroll from "@/common/scroll/scroll";//引入滚动组件
    import draggable from 'vuedraggable';//引入拖动排序组件
export default {
    // 未关注币种
    name:'No-FocusCurrency',
    data(){
        return{
            // 未关注币种列表
            nofocusList:[],
            favorites:[],//已关注的币种
            search:'',//搜索
        }
    },
    mounted(){
        this.$api.user.getAllCoin().then(res =>{
            for(var coin in res){
                this.nofocusList.push(coin)
            }
            this.$api.user.getConcern().then(res =>{
                this.favorites = res.favorites;
                for(var i = 0; i < this.favorites.length;i++){
                    var index = this.nofocusList.indexOf(this.favorites[i])
                    if(index > -1){
                        this.nofocusList.splice(index,1);
                    }
                }
            })
        })
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
        // 过滤后禁止拖拽
        onMove () {
	        return !this.search
        },
        // 关注
        addConcern(item,index){
            if(this.favorites.indexOf(item) == -1){
                this.favorites.push(item);
            }
            this.$api.user.getDelConcern({
                pair: this.favorites
            }).then(res =>{
                this.nofocusList.splice(index,1);
            })
        },
         // 跳转到交易页面
        toDeal(val){
            this.$router.push('/deal/buy?coin='+val)
        }
    },
    computed:{
        //过滤
       filterData() {
           //搜索
            var searchs = this.search
            if (searchs) {
                return this.nofocusList.filter(function(obj) {
                    return obj.indexOf(searchs.toUpperCase().trim()) > -1
                })
            } else {
                return this.nofocusList
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
    // 未关注
    .attention{
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        text-align: center;
    }
    // 未关注列表
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
                        color: green;
                    }
                }
            }
        }
    }
}
</style>
