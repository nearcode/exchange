<template>
	<div class="trading-view">
         <!-- 头部 -->
            <pub-head 
                :title="title | toString" 
               :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
            </pub-head>
        <!-- 视图主体 -->
        <div class="view-main">
            <!-- 现价 -->
            <div class="now-price flex">
                <div class="title">{{pairName}}现价</div>
                <div class="btb price">{{sym}}{{ticker.last | autoNumber}}</div>
                <div class="rmb price">￥{{title | getBaseCoin | toCNY(ticker.last) | autoNumber}}</div>
            </div>
            <!-- 信息 -->
            <div class="flex info top">
                <div class="item">
                    <div>{{$t('trading.Gain')}}:   <span class="green"> {{ticker.change}}%</span></div>
                </div>
                <div class="item">
                    <div>{{$t('trading.Highest')}}:   <span>{{ticker.hight}}</span></div>
                </div>
            </div>
            <div class="flex info">
                <div class="item">
                    <div>{{$t('trading.Volume')}}:   <span>{{ticker.vol|autoNumber}}</span></div>
                </div>
                <div class="item">
                    <div>{{$t('trading.Lowest')}}:   <span>{{ticker.low}}</span></div>
                </div>
            </div>
        </div>
        <div class="k_line clearfix">
            <!--<div id="trade_main" style="width: 100%;height: 100%;"></div>-->
            <div id="trade_main" class="candle-container"></div>
        </div>
        <!-- 买\卖交易对 -->
        <div class="deal-list">
            <div class="flex title">
                <div class="pub-g flex1">{{$t('trading.Buy')}}</div>
                <div class="pub-g flex1">{{$t('trading.Sell')}}</div>
            </div>
            <div class="list flex">
                <div class="flex1 buy">
                    <scroll class="coin-list">
                        <div>
                            <div class="list ali-c" v-for="(item,index) in buyMenu" :key="index">
                                <div class="sortNum flexc green">{{index+1}}</div>
                                <div class="new-price">{{item.price | autoNumber}}</div>
                                <div class="num">{{item.amount | autoFixed}}</div>
                                <!-- 数量背景色 -->
                                <div class="bg-color-green" :style="{width:(item.amount/max)*100+'%'}"></div>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="flex1 sell">
                    <scroll class="coin-list" :scrollToEndFlag="false">
                        <div>
                            <div class="list ali-c" v-for="(item,index) in saleMenu" :key="index">
                                <div class="sortNum flexc red">{{index+1}}</div>
                                <div class="new-price">{{item.price | autoNumber}}</div>
                                    <div class="num">{{item.amount | autoFixed}}</div>
                                <!-- 数量背景色 -->
                                <div class="bg-color-red" :style="{width:(item.amount/max)*100+'%'}"></div>
                            </div>
                        </div>
                    </scroll>
                </div>
            </div>
            
        </div>
        <!-- 底部 -->
        <div class="seat-bottom"></div>
        <footer class="foot flex">
            <div class="btn flexc" @click="buyOrSell">{{$t('trading.SpotBuy')}}</div>
            <div class="btn flexc red" @click="buyOrSell">{{$t('trading.SpotSale')}}</div>
        </footer>
    </div>
   </template>

<script>
    import pubHead from '@/common/head/head.vue';
    import io from "socket.io-client";
    import Scroll from "@/common/scroll/scroll";
    import chart from '@/common/js/charting_library.min.js'
    import datafeed from '@/common/js/datafeed.js'
	export default {
        name:'TradingView',
        data() {
            return {
                title: this.$route.query.coin,//头部名字
                buyMenu: [],
                saleMenu: [],
                pair: "",
                pairName:'',//现价比特币名称
                socket: null,
                info:{},//信息
                coinsb:'',//币种名
                price:'', //比特币价格
                sym:this.$route.query.sym, //比特币符号
                page:1,//当前页码
                max:'',//交易对最大值
                ticker: {}
            };
        },
        components: {
            pubHead,
            Scroll
        },
        mounted() {
            this.ticker = this.$common.getTicker(this.title, {});
            let lastPrice = this.price = this.ticker.last; 
            let length = this.$common.getAutoNumber(lastPrice);
            this.coinsb = this.$common.getCoin(this.title);//截取交易对币种名
            /***取出localStorage缓存中列表数据**/
            this.saleMenu = this.$common.getJsonData(localStorage['sell'+this.title], []).reverse();
            this.buyMenu = this.$common.getJsonData(localStorage['buy'+this.title], []);
            /** 
            下列代码为k线图代码
             **/
            // 定义datas数据
            var datas = {};
            datas.symbol = this.title;
            datas.pair = this.title;
            // datas.base = 'LTC';
            // datas.quote = 'BTC';
            // datas.instId = 1;
            datas.restAPIURL =  API_URL+'/market/kline'
            datas.wsURL = {"url": "wss://localhost", "protocol": "beta"};
            datas.mode = 'desktop';
            datas.theme = 'dark';
            datas.timezone = 'Asia/Shanghai';
            datas.symbolInfo = {
                name: datas.symbol,
                description: datas.symbol,
                exchange: this.title, //标题
                volume_precision: 8,
                session: '24x7',
                has_intraday: true,
                has_daily: true,
                has_empty_bars: true,
                fractional: true,
                pricescale: Math.pow(10, length),
                minmov: 1,
                timezone: datas.timezone
            };
            // k线颜色配置
            var exports = {
                defaultThemes: {
                    "sum_day": {
                        url: "sum-day.css",
                        up: "#03c087",//横虚线
                        vert: "#7d7d7d",
                        down: "#ff657b",
                        wickUp: "",
                        wickDown: "",
                        borderUp: "#00c6b0",
                        borderDown: "#7d7d7d",
                        bg: "#fff",//背景色
                        grid: "#f7f8fa",
                        cross: "#f0f0f0",
                        border: "#7d7d7d",
                        text: "#fff",
                        line: "#7d7d7d",
                        backgroundColor: "#7d7d7d"
                    },
                    "night": {
                        url: "dark.css",
                        up: "#00c6b0",
                        vert: "#607591",
                        down: "#ae4e54",
                        wickUp: "#00c6b0",
                        wickDown: "#ff657b",
                        borderUp: "#00c6b0",
                        borderDown: "#ff657b",
                        bg: "#374a62",
                        grid: "#1f2943",
                        cross: "#9194A3",
                        border: "#4e5b85",
                        text: "#ced6e0",
                        line: '#607591',
                        backgroundColor: "#4b617b"
                    }
                }
            };
            window.marketKlineColor = {};
            window.marketKlineColor = exports.defaultThemes.sum_day;
            datafeed.init(datas,window.marketKlineColor)
            this.allNumFun();
        },
        computed: {
            //计算数量所占百分比
            maxNum () {
                return this.allNumFun;
            },
        },
        methods: {
            // // 历史资金流向
            // historyList () {
            //     this.$api.home.historyList(this.page).then(res => {
            //         // 更新列表数据
            //         this.historyData = res.resultList;
            //     })
            // },
            // history () {
            //     this.historyList();
            // },
            back(){
                this.$router.back()
            },
            compare(property) {
                return function(a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value2 - value1;
                };
            },
            // 数量百分比函数
            allNumFun () {
                // 常量数据
                const b = this.buyMenu,
                    k = this.saleMenu;
                // 变量数组，升降数量
                let saleArr = [],
                    buyArr = [];
                // 循环数据长度，去除每条数据的数量值
                for (var i=0; i<b.length; i++){
                    // console.log(this.saleMenu[i].amount);
                    saleArr.push(this.buyMenu[i].amount);
                }
                for (var i=0; i<k.length; i++){
                    saleArr.push(this.saleMenu[i].amount);
                }
                    buyArr = [];
                // 连接两个数组，concat()方法用于连接数组
                this.allNumArr = saleArr.concat(buyArr);
                // 数组最大值
                return this.max = Math.max.apply(null,this.allNumArr);
                // console.log(Math.max.apply(null,this.allNumArr));
            },
            //现货卖出、买入
            buyOrSell () {
                this.$router.go(-1);
            },
        },
       
    }
</script>

<style lang="less" scoped>
    @import url('~@/style/mixin');
    .trading-view {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 16;
        min-height: 100vh;
        background-color: #f3f3f3;
    }
    .flex {
        display: flex;
        align-items: center;
    }
    .seat {
        height: .88rem;
    }


	.menu, .search {
	.icon {
        margin: 0 0.3rem;
        color: #fff;
        font-size: .3rem;
		}
	}
    .icon.icon-back{
        font-size:.3rem;
    }
	.search {
		.icon {
			font-size: .32rem;
		}
	}

/* 视图主体 */
.view-main {
    
    overflow: hidden;
    
    .now-price {
        color: #555;
        padding:0 .2rem;
        margin-top: .3rem;
        font-size: .3rem;
        height: .6rem;
        .price {
            margin-left: .28rem;
            color: #009944;
        }
    }
    /* 信息 */
    .info {
        height: .36rem;
        padding:0 .24rem;
        color: #555;
        justify-content: space-between;
        font-size: .26rem;
        &.top {
            margin-top: 0.1rem;
        }
        .item {
            width: 5rem;
            text-align: left;
            span {
                margin-left: 0.1rem;
            }
            .green {
                color: #009944;
            }
        }
        
    }
}
.k_line {
    margin-top: .3rem;
}
/* 交易对信息 */
.deal-list {
    padding: .2rem;
    .title {
        height: .4rem;
        font-size: .3rem;
        color: #666;
    }
    .coin-list {
        width: 100%;
        height: 3.8rem;
        overflow: hidden;
        font-size: .24rem;
        
    .list {
            position: relative;
            width: 100%;
            height: .38rem;
            .bg-color-green {
                position: absolute;
                top: .06rem;
                right: 0;
                height: .36rem;
                background-color: rgba(0, 198, 176, 0.2);
            }
            .bg-color-red {
                position: absolute;
                top: .06rem;
                right: 0;
                height: .36rem;
                background-color: rgba(255, 101, 123, 0.2);
            }
        }
        
    }
    .sortNum {
        width: .3rem;
        height: .3rem;
        font-size: .24rem;
        color: #fff;
        &.green {
            color: #4fd68b;
        }
        &.red {
            color: #f76464;
        }
    }
    .new-price {
        width: 1.4rem;
        margin-left: .2rem;
        color: #555;
        text-align: left;
    }
    .num {
        width: 1.4rem;
        margin-left: .1rem;
        color: #555;
        text-align: right;
    }

    
}
// 底部
.foot {
    width:100%;
    max-width:750px !important;
    background-color: #2e3d48;
    z-index: 9999;
    .fixedBottom(1rem,9);
    .btn {
        width: 3.2rem;
        height: .66rem;
        font-size: .26rem;
        color: #fff;
        background-color: #4fd68b;
        margin: 0 .2rem;
        .border-radius(.1rem);
        &.red {
            background-color: #f76464;
        }
    }
}

</style>