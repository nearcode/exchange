<template>
    <!-- 交易 -->
    <div class="deal">
        <!-- head -->
        <pub-head
            :title="coin | toString"
            :bgColor="$config.color.mainCor"
            :titleColor="$config.color.titleCor"
            :leftSolt="true"
            @deal="isShowTitleNav"
        >
        <!-- 左侧图标 -->
        <div slot="left" class="kline_ico" @click="toTrading"><i class="iconfont icon-shuju1" :style="{color:$config.color.titleCor}"></i></div>
            
            <!-- 右侧图标 -->
            <em class="iconfont icon-guzhongtixing" @click="toInform()" :style="{color:$config.color.titleCor}"></em>
        </pub-head>
        <div class="bg-top" :style="{backgroundColor:$config.color.mainCor}"></div>

        <div class="main box-s">
            <!-- 币种选项 -->
            <div class="tab jus-a border-b">
                <div class="coins" v-for="(tab, index) in tabs" :key="index" :class="{active:tab.type == nowIndex}"
                :style="{color:tab.type == nowIndex ? $config.color.mainCor:$config.color.botCor,borderColor:$config.color.mainCor}"
                    @click="tabchange(index,tab.type)">
                    {{tab.title}}
                </div>
            </div>
               <!-- 交易对 -->
                <div class="deal-info flex" v-if="nowIndex == 'buy' || nowIndex == 'sell'">
                    <div class="left flex1 border-r">
                        <!-- 当前价格 -->
                        <div class="price"><span>{{coinSym}}</span> {{tickers.last | autoNumber}}</div>
                        <div class="rmb-price">￥{{coin | getBaseCoin | toCNY(tickers.last) | autoNumber}}</div>
                        <!-- 委托价格 -->
                        <div class="entrust ali-c jus-b">
                            <input type="text" :placeholder="$t('deal.EntrustPrice')" v-model="entrustPrice">
                            <div class="coin">{{coin | getBaseCoin}}</div>
                        </div>
                        <!-- 折合 -->
                        <div class="conversion jus-b">
                            <div class="coins">{{$t('deal.ConvertInto')}}CNY</div>
                            <div class="c-price">{{coin | getBaseCoin | toCNY(entrustPrice)|autoFixed}}</div>
                        </div>
                        <!-- 委托数量 -->
                        <div class="entrust ali-c jus-b">
                            <input type="text" :placeholder="$t('deal.EntrustAmount')" v-model="entrustNum">
                            <div class="coin">{{coin | getCoin}}</div>
                        </div>
                        <!-- 交易额 -->
                        <div class="conversion jus-b">
                            <div class="coins">{{$t('deal.TradingVolume')}}</div>
                            <div class="c-price">{{entrustPrice * entrustNum | autoNumber}}</div>
                        </div>
                        <!-- 买入按钮 -->
                        <div class="buy-btn flexc" @click="trade(nowIndex)" v-if="nowIndex == 'buy'">{{$t('deal.Buy')}}{{coin | getCoin}}</div>
                        <!-- 卖出按钮 -->
                        <div class="sell-btn flexc" @click="trade(nowIndex)"  v-if="nowIndex == 'sell'">{{$t('deal.Sale')}}{{coin | getBaseCoin}}</div>
                         <!-- 百分比按钮 -->
                        <div class="percent flex border">
                            <div class="flex1 flexc border-l" v-for="(item,index) in per" :key="index" :class="{on:perIndex == index}" @click="changePercent(item,index)">{{item}}%</div>
                        </div>
                        <!-- 可买数量 -->
                        <div class="entrust ali-c jus-b canBuyNum" v-if="nowIndex == 'buy'">
                            <div>{{$t('deal.CanBuy')}}{{coin | getCoin}}</div>
                            <div class="coin">{{coinTop | autoFixed}}</div>
                        </div>
                        <!-- 可用数量 -->
                        <div class="entrust ali-c jus-b canBuyNum" v-if="nowIndex == 'buy'">
                            <div>{{$t('deal.CanUse')}}{{coin | getBaseCoin}}</div>
                            <div class="coin">{{canUse}}</div>
                        </div>
                        <!-- 可卖数量 -->
                        <div class="entrust ali-c jus-b canBuyNum" v-if="nowIndex == 'sell'">
                            <div>{{$t('deal.CanSell')}}{{coin | getCoin}}</div>
                            <div class="coin">{{coinsale | autoFixed}}</div>
                        </div>
                        <!-- 可兑数量 -->
                        <div class="entrust ali-c jus-b canBuyNum" v-if="nowIndex == 'sell'">
                            <div>{{$t('deal.CanExchange')}}{{coin | getBaseCoin}}</div>
                            <div class="coin">{{canChange | autoFixed}}</div>
                        </div>
                        
                    </div>
                    <!-- 右侧实时币种信息 -->
                    <div class="right flex1">
                        <div class="coin-tab ali-c">
                            <div class="pankou r-mar" >{{$t('deal.Handicap')}}</div>
                            <div class="right-price r-mar">{{$t('deal.Price')}}</div>
                            <div class="number r-mar">{{$t('deal.Amount')}}</div>
                        </div>
                        <!-- 币种列表 -->
                        <scroll class="coin-list" :scrollToEndFlag="true">
                            <div>
                                <div class="list ali-c" @click="toBuy(item.price, item.amount)" v-for="(item,index) in saleMenu" :key="index">
                                    <img v-if="$config=='eauni'" class="img" :src="require('@/assets/site/'+(item.from||'eauni')+'.png')" alt="">
                                    <div v-if="$config!='eauni'" class="sortNum flexc red">{{saleMenu.length-index}}</div>
                                    <div class="new-price">{{item.price | autoNumber}}</div>
                                    <div class="num">{{item.amount | autoFixed}}</div>
                                    <!-- 数量背景色 -->
                                    <div class="bg-color-red" :style="{width:(item.amount/max)*100+'%'}"></div>
                                </div>
                            </div>
                        </scroll>

                        <div class="seat"></div>

                        <scroll class="coin-list">
                            <div>
                                <div class="list ali-c" @click="toBuy(item.price, item.amount)" v-for="(item,index) in buyMenu" :key="index">
                                    <img v-if="$config=='eauni'" class="img" :src="require('@/assets/site/'+(item.from||'eauni')+'.png')" alt="">
                                    <div v-if="$config!='eauni'" class="sortNum flexc green">{{index+1}}</div>
                                    <div class="new-price">{{item.price | autoNumber}}</div>
                                    <div class="num">{{item.amount | autoFixed}}</div>
                                    <!-- 数量背景色 -->
                                    <div class="bg-color-green" :style="{width:(item.amount/max)*100+'%'}"></div>
                                </div>
                            </div>
                        </scroll>
                    </div>
                    
                </div>
            <!-- 委托 -->
            <scroll class="market-list" v-if="nowIndex == 'order'">
                <div>
                    <div class="loading" v-if="isLoading"><mt-spinner type="fading-circle" :size="20" color="#3b82de"></mt-spinner></div>
                    <div class="coin jus-b ali-c border-b" v-for="(item, index) in coinList" :key="index">
                        <div class="item ali-c">
                            <div class="img" v-if="item.type != -1"><img src="@/assets/coins/buy.png" class="fill"></div>
                            <div class="img" v-if="item.type == -1"><img src="@/assets/coins/sale.png" class="fill"></div>
                            <div class="coin-name">
                                <div class="top">{{item.market | getCoin}}</div>
                                <span>[{{item.market | getBaseCoin}}]</span>
                            </div>
                        </div>
                        <!-- 价格 -->
                        <div class="vol item ali-c">{{item.price | autoNumber}}</div>
                        <!-- 数量 -->
                        <div class="item new-price flexc">
                            {{(item.amount) | autoFixed}}
                        </div>
                        <div class="item increase flexc red white" @click="cancelOrder(item.id, index)">取消</div>
                    </div>
                    <div class="tips">{{tips}}</div>
                </div>
            </scroll>
            <!-- 成交记录 -->
            <scroll class="market-list" v-if="nowIndex == 'history'">
                <div>
                    <div class="loading" v-if="isLoading"><mt-spinner type="fading-circle" :size="20" color="#3b82de"></mt-spinner></div>
                    <div class="coin jus-b ali-c border-b" v-for="(item, index) in history" :key="index">
                        <div class="item ali-c">
                            <div class="img" v-if="item.type != -1"><img src="@/assets/coins/buy.png" class="fill"></div>
                            <div class="img" v-if="item.type == -1"><img src="@/assets/coins/sale.png" class="fill"></div>
                            <div class="coin-name">
                                <div class="top">{{item.market | getCoin}}</div>
                                <span>[{{item.market | getBaseCoin}}]</span>
                            </div>
                        </div>
                        <!-- 价格 -->
                        <div class="vol item ali-c">{{item.price | autoNumber}}</div>
                        <!-- 数量 -->
                        <div class="item new-price flexc">
                            {{item.amount | autoFixed}}
                        </div>
                        <div class="item increase flexc">{{item.date | timer}}</div>
                    </div>
                    <div class="tips" v-if="history.length == 0">{{rTips}}</div>
                </div>
            </scroll>
        </div>
        <!-- 头部弹出层 -->
        <mt-popup
        v-model="titleNav"
        popup-transition="popup-fade">
            <div class="tabsPop">
                <d-nav @itemTab="eventChild"></d-nav>
            </div>
        </mt-popup>
    </div>
</template>
    
    <script>
    import io from "socket.io-client";
    import pubHead from '@/common/head/head.vue';
    import Scroll from "@/common/scroll/scroll";
    import {MessageBox} from 'mint-ui';
    import DNav from "@/view/deal/nav/nav.vue";
    export default {
        inject: ['reload'],//注入reload方法
        name:'Deal',    
        components :{
            pubHead,
            Scroll,
            DNav
        },
        data () {
            return {
                titleNav:false,//头部弹框选择是否弹出
                seachContent:'',//搜索内容
                nowIndex:0,//当前显示的选项下标
                coin:this.$route.query.coin || localStorage.pair,//头部标题
                entrustPrice:'',//委托价格
                entrustNum:'',//委托数量
                data:{},//买入或卖出提交的数据
                socket: null,
                coins: {},//币种数据
                tickers:{},//tickers数据
                coinList: [],//委托数组
                history: [],//成交记录
                tips:'',//提示
                rTips:'',//成交记录提示
                nowDel:0,//当前点击取消胡下标
                canBuy:'',//可买数量
                bitCoin:'',//当前币种名
                dealHistory:{},//浏览器缓存数据
                canUseCoin:'',//可用余额
                coinsb:'',
                isLoading:true,//显示加载loading
                lastPrice: 0,
                balances: {},
                buyMenu: [],
                saleMenu: [],
                color:'#fff',
                max:'',//交易对最大值
                per:[
                    25,50,75,100
                ],//百分比仓口
                perIndex:5,//百分比下标
                tabs:[
                    {'title': this.$t('deal.Buy'),'type': 'buy'},
                    {'title': this.$t('deal.Sale'),'type': 'sell'},
                    {'title': this.$t('deal.CommissionedBTCurrent'),'type': 'order'},
                    {'title': this.$t('deal.BidHistory'),'type': 'history'},
                ],//选项数组
                //币种符号
                coinSym:'',
            }
        },
        computed: {
            //折合
            // totalPrice() {
            //     return autoNumber(this.entrustPrice * this.entrustNum);
            // },
            con () {
                return this.coinList;
            },
            // 计算钱包可买数量
            coinTop () {
                let canBuy = 0,//可买数量
                    coins = this.$common.getCoin(this.coin),
                    balance = this.balances[coins]?this.balances[coins].available:0;//可买币种余额
                return canBuy = balance/this.lastPrice || 0;

            },
            // 计算可用数量
            canUse () {
                let coins = this.$common.getBaseCoin(this.coin);
                this.canUseCoin = this.balances[coins]?this.balances[coins].available:0;
                return this.canUseCoin;
            },
            // 计算可卖数量
            coinsale () {
                let coins = this.$common.getCoin(this.coin),
                balance = this.balances[coins]?this.balances[coins].available:0;//币种数量
                return balance || 0;
            },
            // 计算可兑数量
            canChange () {
                let coins = this.$common.getCoin(this.coin),
                balance = this.balances[coins]?this.balances[coins].available:0;//币种数量
                return balance*this.lastPrice || 0;
            },
            //计算数量所占百分比
            maxNum () {
                return this.allNumFun;
            },
            
        },
        created() {
            this.coinsb = this.$common.getCoin(this.coin);//交易币种
            let bitCoin = this.$common.getBaseCoin(this.coin);//主币种
            // 币种符号
            this.coinSym = this.$common.getSymbol(bitCoin); 

            if (!this.$route.params.pair){
                try{
                    this.pair = Object.keys(this.$common.getJsonData(localStorage.lastPrices||'{}'))[0];
                }catch(e){
                    this.pair = '';
                }
            }else{
                this.pair = this.$route.params.pair;
            }
            /***取出localStorage缓存中列表数据，进去前先加载缓存中数据，
             后在mounted中更新页面数据***/
            this.saleMenu = this.$common.getJsonData(localStorage.getItem('sell'+this.coin) || '[]') ;
            this.buyMenu = this.$common.getJsonData(localStorage.getItem('buy'+this.coin) || '[]');
            this.dealHistory = this.$common.getJsonData(localStorage.getItem('history'+this.coin) || '[]');
        },
        mounted(){
            this.tickers = this.$common.getTicker(this.coin, {});
            this.lastPrice = this.$common.lastPrice(this.coin);
            //如果路径有params参数，就给nowIndex赋值
            this.$route.params.pair ? this.nowIndex = this.$route.params.pair : this.nowIndex = 'buy';
            //刷新请求对应数据
            if (this.nowIndex == 'order') {
                this.getList();
            }else if(this.nowIndex == 'history'){
                this.record();
            }
            // 定义socket库
            var socket = (this.socket = io.connect(window.SOCKET_URL, {
                query: "token=" + localStorage.getItem("token"),
                "force new connection": true,
                reconnect: true
            }));
            localStorage.setItem("pair", this.coin);
            var pair = this.coin;
            socket.on("connect", res => {
                setTimeout(function() {
                    socket.emit("subscibe:market", document.domain);
                    socket.emit("subscibe:market-trade", pair);
                }, 300);
            });
            socket.on("market:balances", res => {
                this.balances = res;
            });
            socket.on("market:depth", res => {
                this.saleMenu = res.asks?res.asks.sort(this.compare("price")):{};
                this.buyMenu = res.bids||{};
                //  console.log(this.saleMenu);
                // 存交易页面数据到本地  //用做首次进入缓存
                localStorage.setItem('buy'+pair,JSON.stringify(this.buyMenu));
                localStorage.setItem('sell'+pair,JSON.stringify(this.saleMenu));
            });
            socket.on("market:orderHistory", res => {
                this.dealHistory = res.resultList;
                // 存交易页面数据到本地 
                localStorage.setItem('history'+pair,JSON.stringify(this.dealHistory));
                if (res.resultList[0]) this.tickers.last = res.resultList[0].price;
            });
            socket.on("error", res => {
                this.message = res;
                this.$toast(this.$t('error.'+res));
            });
            this.allNumFun();
        },
        methods: {
             // 切换tab栏
            tabchange(index,tab) {
                this.nowIndex = tab;
                this.entrustPrice = '';//清空价格
                this.entrustNum = '';//清空数量
                this.isLoading = true;//loading加载为true
                this.tips = '';//提示为空
                this.rTips = '';//提示为空
                if(tab == 'order') {
                    this.getList();
                }else if (tab == 'history') {
                    this.record();
                }
                //选择跳入对应的路径
                this.$router.replace({
                    name:'Deal',
                    params:{pair:this.nowIndex},
                    query:{coin:this.coin}
                });
            },
            //点击买单
            toBuy(price, amount) {
                this.entrustPrice = this.$common.toNumber(price);
                var baseCoin = this.coin.split("_")[0];
                var tradeCoin = this.coin.split("_")[1];
                // var count;
                // if (this.balances[baseCoin]) {
                //     if (this.nowIndex == "buy") {
                //         count = this.$common.toNumber(this.balances[baseCoin] / this.price)
                //             .autoFixed(false);
                //     } else {
                //         count = this.$common.toNumber(this.balances[tradeCoin]).autoFixed(false);
                //     }
                //     if (amount > count) amount = count;
                // }
                this.entrustNum = this.$common.toNumber(amount);
            },
            //买入或卖出
            trade(type) {
                // 操作前，若未登录跳转去登录
                if (!this.$store.state.isLogin()) {
                    this.$router.push({
                        path: "/login"
                    });
                    return;
                }
                if (!this.entrustPrice || !this.entrustNum){
                    return;
                }
                //提交的数据
                this.data = {
                    type: this.coin,
                    price: this.entrustPrice,
                    count: this.entrustNum
                };
                let Tips = '',
                    num =1;
                if (type =='buy') {
                    Tips = '确定买入?'
                    num = 1;
                }else {
                    num = -1;
                    Tips = '确定卖出?';
                }
                MessageBox.confirm(Tips).then(action => {
                    this.trades(this.data, num);
                });
                // this.showDialog = true;
                // this.mask = !this.mask;
            },
            // 确认买入\卖出操作 /* typeNum = -1  卖出  / 1买入 */
            trades(data, typeNum) {
                console.log(data);
                this.socket.emit("market:trade", {
                    type: typeNum,
                    amount: data.count,
                    price: data.price,
                    market: this.coin
                });                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            },
            // 请求当前委托数据
            getList() { 
                this.$api.home.getOrder({
                        market: this.coin,
                        limit: 20,
                }).then((res) => {
                    this.coinList = [];
                    this.isLoading = false; 
                    if (this.coinList.concat(res.data).length !=0) {
                        // this.p++;
                        // this.pagesize += this.limit;
                       this.coinList = this.coinList.concat(res.data);
                       this.tips = "";
                    } else {
                        this.tips = this.$t('deal.NoData');
                    }   
                })
            },
            //取消委托订单
            cancelOrder (ids,index) {
                this.nowDel = index;
                this.$api.home.cancelOrder({
                    id:ids
                }).then(res => {
                    this.coinList.splice(this.nowDel,1);
                    this.$toast('删除成功');
                    if(this.coinList.length == 0) {
                        this.tips = this.$t('deal.NoData');
                    }
                })
            },
            //请求成交数据
            record () {
                // this.$loading.open(this.$t('deal.loading'));
                this.$api.home.getHistory({
                        pair: this.coin,
                        limit: 20,
                }).then((res) => {
                    this.history =[];
                    this.isLoading = false; 
                    // this.$loading.close();
                    if (this.history.concat(res.resultList).length !=0) {
                        // this.p++;
                        // this.pagesize += this.limit;
                       this.history = this.history.concat(res.resultList);
                       this.tips = "";
                    } else {
                        this.rTips = this.$t('deal.record');
                    }
                })
            },
            //去股票视图
            toTrading () {
               this.$router.push(
                {
                    name:'TradingView',
                    query:{coin:this.coin,sym:this.coinSym}
                },
               );
            },
            //排序方法
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
                // console.log(this.buyMenu)
            },
             // 跳转到通知
            toInform(){
                this.$router.push('/inform')
            },
            //切换百分比
            changePercent (val,index) {
                
                if (this.nowIndex == 'buy') {
                    if (this.entrustPrice == '') {
                        this.$toast('请先填写价格');
                        return;
                    }
                    this.perIndex = index;
                    let price = this.entrustPrice,//价格
                        balance = this.canUseCoin;//可用余额
                        this.entrustNum =  this.$common.toNumber(balance/price*val/100)|| 0;
                }else if(this.nowIndex == 'sell') {
                    console.log(this.$common.getCoin(this.coin));
                    this.perIndex = index;
                    var coins = this.$common.getCoin(this.coin);
                    var balan = this.balances[coins].available;
                    this.entrustNum = this.$common.toNumber((balan*val)/100);
                }
            },
            //选择币种
            eventChild () {
                this.reload();
            },
            // 点击头部显示弹框
            isShowTitleNav() {
                this.titleNav = true;
            }
        },
        destroyed() {
            if (this.socket) this.socket.close();
        },
        watch: {
            //监听输入价格的变化
            entrustPrice(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.entrustNum = '';
                    this.perIndex = 5;
                }
            }
        },
        
    }
    </script>
    
    <style lang="less" scoped>
        @import url('~@/style/mixin');
        .iconfont {
            font-size: .44rem;
        }
        // k线图标
        .kline_ico {
            width: .4rem;
            height: .4rem;
        }
        // .border-r {
        //     padding-left: 0.2rem;
        // }
        .deal {
            height: 100%;
            min-height: 100vh;
            background-color: #f3f3f3;
            .bg-top {
                /* position: relative; */
                width: 100%;
                height: .3rem;
            }
        }
        .main {
            position: fixed;
            overflow: hidden;
            top: .9rem;
            width: 7.12rem;
            margin: 0 .17rem; 
            height: 85%;
            background-color: @pub-bg;
            .border-radius(.1rem);
            //币种选项
            .tab {
                color: #bbb;
                margin-top: .1rem;
                font-size: .26rem;
                .coins {
                    width: 1.4rem;
                    height: .58rem;
                    line-height: .58rem;
                    text-align: center;
                    &.active {
                        color: @main-cor;   
                        border-bottom: 1px solid @main-cor;
                    }
                }
            }
            //交易信息主体
            .deal-info {
                width: 100%;
                height: 88%;
                margin-top: .2rem;
                padding:0 .16rem;
                .flex1 {
                    height: 100%;
                    overflow: hidden;
                }
                .left,.right {
                    width: 50%;
                }
                .price {
                    font-size: .36rem;
                    font-weight: bold;
                    span {
                        font-size: .4rem;
                    }
                }
                .rmb-price {
                    font-size: .3rem;
                    color: #555;
                    margin-bottom: .4rem;
                }
                .entrust {
                    width: 2.94rem;
                    height: .76rem;
                    font-size: .26rem;
                    color: #d2d0cf;
                    border: 1px solid #b3dafd;
                    .border-radius(.1rem);
                    background-color: #fffdfa;
                    input {
                        width: 1.6rem;
                        height: .6rem;;
                        margin-left: .2rem;
                    }
                    .coin {
                        padding-right: .1rem;
                    }
                }
                /* 折合 */
                .conversion {
                    width: 2.94rem;
                    height: .9rem;
                    line-height: .9rem;
                    font-size: .26rem;
                    color: #555;
                    .c-price {
                        color: @main-cor;
                    }
                }
                /* 买入按钮 */
                .buy-btn {
                    width: 2.94rem;
                    height: .8rem;
                    font-size: .32rem;
                    color: #fff;
                    background: @main-cor;
                    border-radius: .1rem;
                }
                .sell-btn {
                    width: 2.94rem;
                    height: .8rem;
                    font-size: .32rem;
                    color: #fff;
                    background: #f76464;
                    border-radius: .1rem;
                }
                /*百分比按钮*/
                .percent {
                    width: 2.94rem;
                    height: .5rem;
                    .border-radius(.06rem);
                    font-size: .24rem;
                    margin: .36rem 0;
                    .flex1 {
                        color: #c7c5bf;
                        &.flex1:first-child {
                            border-left: none!important;
                        }
                        &.on {
                            color: #fff;
                            background-color: #3b82de;
                        }
                    }
                }
                .canBuyNum {
                    padding: 0 .1rem; 
                    margin-top: .4rem;
                }
                /* 右侧实时币种信息 */
                .right {
                    // margin-left: .2rem;
                    .coin-tab {
                       height: .5rem;
                       color: #d2d0cf;
                        font-size: .24rem;
                        .r-mar {
                            // margin-left: .8rem;
                            width: 33.33%;
                        }
                    }
                    .seat {
                        width: 100%;
                        height: .5rem;
                    }
                    .coin-list {
                        width: 100%;
                        height: 3.8rem;
                        overflow: hidden;
                        font-size: .24rem;
                        img {
                            display: block;
                            width: .3rem;
                            height: .3rem;
                        }
                        .list {
                            position: relative;
                            width: 100%;
                            .new-price, .sortNum, .num {
                                height: .38rem;
                                line-height: .38rem;
                                overflow: hidden;
                            }
                            .bg-color-green {
                                position: absolute;
                                top: 0;
                                right: 0;
                                height: .36rem;
                                background-color: rgba(0, 198, 176, 0.2);
                            }
                            .bg-color-red {
                                position: absolute;
                                top: 0;
                                right: 0;
                                height: .36rem;
                                background-color: rgba(255, 101, 123, 0.2);
                            }
                        }
                        .sortNum {
                            // display: none;
                            width: .4rem;
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
                            width: 1.7rem;
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
                }
                
            }
            
        }
        //当前委托
        .market-list {
            width: 100%;
            height: 9rem;
            overflow: hidden;
            margin-top: .3rem;
            .loading {
                width:.4rem;
                height: .4rem;
                margin: 0 auto;
            }
            .tips {
                text-align: center;
                color: #666;
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
                    width: 25%;
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
                    &.new-price {
                        font-size: .24rem;
                        .top {
                            font-size: .26rem;
                            line-height: .4rem;
                            color: #ff6f6c;
                        }
                        .rmb {
                            color: #616161;
                        }
                    }
                    &.white {
                        color: #fff !important;
                    }
                    &.increase {
                        width: 1.3rem;
                        height: .54rem;
                        color: #777;
                        font-size: .24rem;
                        &.green {
                            background-color: #3ebf17;
                        }
                        &.red {
                            background-color: #ff433f;
                        }
                    }
                }
                
            }
        }
    /* 弹出层 */
    .mint-popup /deep/ {
        top: 3.8rem !important;
        .border-radius(.1rem);

    }
  .tabsPop {
    width: 7rem;
    height: 6rem;
    .border-radius(.1rem);
    overflow: hidden;
  }
    </style>
    
    