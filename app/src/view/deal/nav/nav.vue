<template>
    <div class="nav">
        <!-- 选项导航 -->
        <div class="jus-a">
            <div class="nav-item ali-c" v-for="(tab,index) in tabs" :key="index" :style="{color:tab.title == nowIndex ? $config.color.mainCor:$config.color.botCor,borderColor:$config.color.mainCor}"
             @click="tabchange(index,tab.title)">
                <div tag="div" class="nav-link" :class="{active:tab.title == nowIndex}" @click="tabchange(index,tab.title)">
                    <span class="nav-text">{{tab.title}}</span>
                </div>
            </div>
        </div>
        <!-- 行情选项滚动列表 -->
        <scroll class="nav-menu">
            <div class="flex-wrap">
                <div class="tab-type flexc" v-for="(list, index) in orderTickers" :key="index">
                    <router-link class="makets" :to="'/deal/buy?coin='+list.name" @click.native="itemTab(list.name)">
                        <div class="img"><img :src="'static/coins/' + list.name.replace(list.name.split('_')[0]+'_','').toLowerCase() + '.png'" class="fill"></div>
                        <div class="text">{{list.name | getCoin}}/[{{list.name | getBaseCoin}}]</div>
                    </router-link>
                </div>
                <!-- <div class="null" v-if="coinList.length == 0">{{tips}}</div> -->
            </div>
        </scroll>
    </div>
</template>
    
<script>
import Scroll from "@/common/scroll/scroll";
    export default {
        data() {
            var markets = JSON.parse(localStorage.markets);
            markets.unshift('自选')
            return {
                nowIndex:'自选',//当前显示的选项名
                coins: {},//币种数据
                tickers:{},//tickers数据
                tabs:[
                    {'title':'自选','type': 0},
                ],
                //选项数组
                coinList: [],
                }
        },
        components: {
            Scroll
        },
        computed: {
            // 计算显示的数据形式
            orderTickers () {
                let _search = this.seach;
                // 如果搜索有值则返回搜索数据
                if (_search) {
                return this.seachMarket(_search);
                }else {
                    return this.coinList;
                }
            },
        },
        mounted() {
            let n = 1;
            for (let base of this.$store.state.baseCoinList){
                this.tabs.push({title:base, type:n});
                n++;
            }
            //如果路径有params参数，就给nowIndex赋值
            this.$route.query.type ? this.nowIndex = this.$route.query.type : this.nowIndex = this.$store.state.baseCoin;
            this.$store.commit('getTickers', this); //传vuex this方法
            this.load();
            const timer = setInterval(() =>{                    
                this.load();               
            }, 1000 * 3); //每3秒定时
            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer);                                    
            });//清除定时器
        },
        
        methods: {
             // 切换tab栏
            tabchange(index,tab) {
                this.nowIndex = tab;
                this.coinList = []; //切换时清空上一个  数据
                this.load();
            },
            //load加载数据
            load() {
                    this.coins = this.$common.getJsonData(localStorage.coins||'{}');//定义缓存中的coins数据
                    this.tickers = this.$common.getJsonData(localStorage.tickers || "{}"); //定义缓存数据 tickers转换JSON对象
                    let favorites = this.$common.getJsonData(localStorage.favorites || "[]");
                //循环
                this.coinList = [];
                for (var pair in this.tickers) {
                    if (!this.coins[pair.split("_")[1]]) continue; //如果循环币种名不存在则跳出
                    if (this.nowIndex != "自选" && this.nowIndex == pair.split("_")[0]) {
                        var obj = {
                            name: pair,
                            item: this.tickers[pair]
                        };
                        this.coinList.push(obj);
                    } else if (this.nowIndex == "自选" && favorites.indexOf(pair) != -1) {
                        var obj = {
                            name: pair,
                            item: this.tickers[pair]
                        };
                        this.coinList.push(obj);
                    }
                }
            },
             itemTab (pair) {
                this.$emit("itemTab",pair)
            },
        },
        destroyed: function() {
            clearInterval(this.tickerTimer);
        },
            
    }
    </script>
    
    <style lang="less" scoped>
    @import url('~@/style/mixin');
    .jus-a{
        background-color: #fff;
        height: .8rem;
        width: 100%;
        color: #999;
        
    }
    .nav-menu {
        overflow: hidden;
        width: 100%;
        height: 5.2rem;
    }
    .tab-type {
        width: 25%;
        height:1.7rem;
        .makets {
            .img {
                width: .8rem;
                height: .8rem;
                margin: 0 auto;
            }
            .text {
                font-size: .22rem;
                color: rgb(180, 179, 179);
                line-height: .6rem;
            }
            text-align: center;
        }
    }
    </style>