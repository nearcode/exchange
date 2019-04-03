<template>
    <!-- 行情 -->
    <div class="market">
            <!-- head -->
             <!-- 头部 -->
            <pub-head
             :title="$t('market.Market')"
             :bgColor="$config.color.mainCor"
             :titleColor="$config.color.titleCor"
            >
             <!-- 左侧图标 -->
             <!-- <em slot="left" class="iconfont icon-chongbitibi"></em> -->
             <!-- 右侧图标 -->
             <em class="iconfont icon-guzhongtixing" @click="toInform()"></em>
            </pub-head>
            <div class="bg-top" :style="{backgroundColor:$config.color.mainCor}"></div>

            <div class="main box-s">
                <!-- 币种选项 -->
                <div class="tab jus-a">
                    <div class="coins" v-for="(tab,index) in tabs" :key="index" :style="{color:tab.title == nowIndex ? $config.color.mainCor:$config.color.botCor,borderColor:$config.color.mainCor}"
                     :class="{active:tab.title == nowIndex}" @click="tabchange(index,tab.title)">
                        {{tab.title}}
                    </div>
                </div>
                <!-- 搜索 -->
                <div class="seach ali-c">
                    <em class="iconfont icon-sousuo"></em>
                    <input type="text" v-model="seach" :placeholder="$t('market.SearchTheCurrency')">
                </div>
                <!-- 币种信息 -->
                <div class="coin-info jus-a ali-c">
                    <div class="coins">{{$t('market.Currency')}}</div>
                    <div class="coins">{{$t('market.Turnover')}}</div>
                    <div class="coins">{{$t('market.RealTimePrice')}}</div>
                    <div class="coins">{{$t('market.FallOr')}}</div>
                </div>
                <!-- 滚动行情列表 -->
                <scroll class="market-list">
                    <div>
                        <div class="coin jus-b ali-c border-b" v-for="(list,index) in orderTickers" :key="index" @click="coinDeal(list.name)">
                            <div class="item ali-c">
                                <div class="img"><img :src="'static/coins/' + (list.name.split('_')[0].toLowerCase()) + '.png'" class="fill"></div>
                                <div class="coin-name">
                                    <div class="top">{{list.name | getCoin}}</div>
                                    <span>[{{list.name | getBaseCoin}}]</span>
                                </div>
                            </div>
                            <div class="vol item ali-c">{{list.item.baseVol|estimate}}</div>
                            <div class="item new-price">
                            <div class="top">{{list.name | getBaseCoin | getSymbol}} {{list.item.last | autoFixed}}</div>
                            <div class="rmb">￥{{list.name | getBaseCoin | toCNY(list.item.last)}}</div>
                            </div>
                            <div class="item increase flexc" :style="{backgroundColor:list.item.change>=0? $config.color.marketRise:$config.color.marketFall}">
                                {{list.item.change | toFixedEx(2)}}%
                            </div>
                        </div>
                    </div>
                </scroll>
            </div>
            
    </div>
    
</template>
    
    <script>
    import pubHead from '@/common/head/head.vue';
    import Scroll from "@/common/scroll/scroll";
    export default {
        // 行情
        name:'Market',
        // 声明组件
        components :{
            pubHead,
            Scroll
        },
        data () {
            return {
                seach:'',//搜索内容
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
        computed: {
            // 计算显示的数据形式
            orderTickers () {
                let _search = this.seach;
                // 如果搜索有值则返回搜索数据
                if (_search) {
                   return this.seachMarket(_search);
                }else {
                    console.log(this.coinList)
                    return this.coinList;
                }
            },
        },  
        methods: {
             // 切换tab栏
            tabchange(index,tab) {
                this.nowIndex = tab;
                this.$router.replace('/market?type='+this.nowIndex); //选择币种跳入对应的路径
                this.coinList = []; //切换时清空上一个  数据
                this.load();
            },
            // 点击去交易
            coinDeal (name) {
                 this.$router.push('/deal/buy?coin='+name);
            },
            // 跳转到通知
            toInform(){
                this.$router.push('/inform');
            },
            //load加载数据
            load () {
                    this.coins = this.$common.getJsonData(localStorage.coins||'{}');//定义缓存中的coins数据
                    this.tickers = this.$common.getJsonData(localStorage.tickers || "{}"); //定义缓存数据 tickers转换JSON对象
                    let favorites = this.$common.getJsonData(localStorage.favorites || "[]");
                //循环
                this.coinList = [];
                for (var pair in this.tickers) {
                    // if (!this.coins[pair.split("_")[0]]) continue; //如果循环币种名不存在则跳出
                    if (this.nowIndex != "自选" && this.nowIndex == pair.split("_")[1]) {
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
            // 搜素数据
            seachMarket (str) {
                let newObj = [];
                for (var key in this.tickers) {
                    if (key.split('_')[1].indexOf(str.toUpperCase().trim()) > -1) {
                        var seachObj = {
                            name: key,
                            item: this.tickers[key]
                        };
                        newObj.push(seachObj);
                    }
                }
                return newObj;
            }
        },
        destroyed: function() {
            clearInterval(this.tickerTimer);
        },
    }
    </script>
    
    <style lang="less" scoped>
        @import url('~@/style/mixin');
        .iconfont {
            font-size: .44rem;
            color: #fff;
        }
        .market {
            height: 100%;
            min-height: 100vh;
            background-color: #f3f3f3;
            .bg-top {
                width: 100%;
                height: .3rem;
            }
        }
        .main {
            position: fixed;
            overflow: hidden;
            top: .9rem;
            width: 6.94rem;
            margin: 0 .28rem; 
            // min-height: 11rem;
            height: 85%;
            background-color: @pub-bg;
            .border-radius(.1rem);
            //币种选项
            .tab {
                color: #bbb;
                margin-top: .1rem;
                font-size: .24rem;
                .coins {
                    width: .8rem;
                    height: .5rem;
                    line-height: .5rem;
                    text-align: center;
                    &.active {
                        color: @main-cor;
                        border-bottom: 1px solid @main-cor;
                        font-weight: bold;
                    }
                }
            }
            //搜索
            .seach {
                width: 6.38rem;
                height: .76rem;
                background: #fffdfa;
                border: 1px solid #f4e9d5;
                .border-radius(.1rem);
                margin: .28rem;
                padding: 0 .2rem;
                .iconfont {
                    font-size: .34rem;
                    color: #d6d6d4;
                }
                input {
                    height: 100%;
                    background: #fffdfa;
                    width: 100%;
                    margin-left: .3rem;
                    font-size: .26rem;
                }
            }
            //币种信息
            .coin-info {
                height: .6rem;
                font-size: .26rem;
                background-color: #f6f6f6;
                color: #818181;
            }
            .market-list {
                width: 100%;
                height: 80%;
                overflow: hidden;
            }
            .coin {
                width: 100%;
                height: 1rem;
                padding: 0 .2rem;
                font-size: .28rem;
                background-color: @pub-bg;
                .vol {
                    color: #777;
                }
                .item {
                    // width: 25%;
                    height: .8rem;
                    .img {
                        width: .5rem;
                        height: .5rem;
                    }
                    .coin-name {
                        height: .6rem;
                        margin-left: .16rem;
                        .top {
                            font-size: .3rem;
                            font-weight: 600;
                            line-height: .3rem;
                            color: #444;
                        }
                        span {
                            color: #e8e8e8;
                            font-size: .24rem;
                            line-height: .24rem;
                        }
                    }
                    &.ali-c {
                        width: 25%;
                    }
                    &.new-price {
                        width: 30%;
                        font-size: .24rem;
                        .top {
                            font-size: .26rem;
                            line-height: .4rem;
                            height: .4rem;
                            overflow: hidden;
                            color: #ff6f6c;
                        }
                        .rmb {
                            color: #616161;
                        }
                    }
                    &.increase {
                        width: 1.3rem;
                        height: .54rem;
                        color: #fff;
                        font-size: .26rem;
                    }
                }
                
            }
        }
       
       
    </style>
    
    