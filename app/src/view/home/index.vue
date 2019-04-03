    <template>
        <!-- 首页 -->
        <div class="home">
            <div class="swiper">
                <mt-swipe :auto="4000" :showIndicators="false">
                    <mt-swipe-item v-for="(img,index) in bannerList" :key="index">
                        <img :src="img" class="fill-auto">
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!-- 主体信息 -->
            <div class="main">
                <!-- 通知栏 -->
                <div class="message flex">
                    <div class="left ali-c">{{$t('home.Notification')}}</div>
                    <div class="rule ali-c">|</div>
                    <div class="right-info" ref="con1" :class="{anim:animate==true}">
                        <div class="oneline" v-for="(item,index) in newsList" :key="index">
                            <div>{{item.title}}</div>
                        </div>
                    </div>
                </div>

                <!-- 币种 -->
                <div class="coin flex">
                    <div class="pairs one" v-for="(item, index) in topList" :key="index">
                        <div class="jus-b">
                            <div class="left">
                                <div class="coin-name">{{item.name}}</div>
                                <div class="Ranger" :class="{red: item.change < 0}">
                                    {{item.change|autoNumber(2)}}%
                                    <em class="iconfont icon-zhixiangshangshangjiantou"></em>
                                </div>
                            </div>
                            <div class="right-img"><img :src="require('@/assets/coins/'+item.name.split('/')[0].toLowerCase()+'.png')" alt="" class="fill"></div>
                        </div>
                        <div class="price">${{item.last|autoNumber}}</div>
                    </div>
                    
                </div>

                <!-- 菜单分类 -->
                <div v-if="$config.site=='eauni'" class="menu flex-wrap">
                    <!-- 转账 -->
                    <div class="item" @click="Tips">
                        <!-- <img src="@/assets/Page 11.svg" alt=""> -->
                        <i class="iconfont icon-jinbiduihuan"></i>
                        <div class="text">{{$t("home.Transfer")}}</div>
                    </div>
                    <!-- 专家分享 -->
                    <div class="item" @click="Tips">
                        <i class="iconfont icon-expert-library"></i>
                        <div class="text">{{$t("home.ExpertsToShare")}}</div>
                    </div>
                    <!-- 客服 -->
                    <div class="item" @click="toSever()">
                        <i class="iconfont icon-kefu1"></i>
                        <div class="text">{{$t("home.Service")}}</div>
                    </div>
                    <!-- 分享 -->
                    <div class="item" :data-clipboard-text="'https://eauni.com/r/'+$store.state.uid" @click="share()">
                        <i class="iconfont icon-tuanduicankaoxian-"></i>
                        <div class="text">{{$t("home.Share")}}</div>    
                    </div>
                    <!-- 存比升息 -->
                    <div class="item" @click="Tips">
                        <i class="iconfont icon-meiyuanqianbao"></i>
                        <div class="text">{{$t("home.SaveMoneyLive")}}</div>
                    </div>
                    <!-- 币商 -->
                    <div class="item" @click="Tips">
                        <i class="iconfont icon-jiebishangcheng"></i>
                        <div class="text">{{$t("home.CurrencyTraders")}}</div>
                    </div>
                </div>
            </div>
            <!-- 涨跌幅榜 -->
            <div class="home-list">
                <div class="tab flex">
                    <div class="flex1 flexc" :class="{active:action == 'up'}" @click="switchList('up')">
                        <span class="afters" :style="{backgroundColor: $config.color.mainCor}"></span>{{$t("home.Performer")}}
                    </div>
                    <div class="flex1 flexc" :class="{active:action == 'down'}" @click="switchList('down')">
                        <span class="afters" :style="{backgroundColor: $config.color.mainCor}"></span>
                        {{$t("home.DropList")}}
                    </div>
                </div>
                <!-- 列表信息 -->
                <div class="classify jus-b ali-c">
                    <div>{{$t("home.Currency")}}</div>
                    <div>{{$t("home.TheLatestPrice")}}</div>
                    <div>{{$t("home.FallOr")}}</div>
                </div>
                <div class="coin jus-b ali-c border-t" v-for="(point,index) in list.slice(0, 10)" :key="index" @click="coinDeal(point.name)">
                    <!-- 货币 -->
                    <div class="item ali-c">
                        <div class="img"><img :src="require('@/assets/coins/'+point.coin.toLowerCase()+'.png')" alt="" class="fill"></div>
                        <div class="coin-name">
                            <div class="top">{{point.name | getCoin}}</div>
                            <span>[{{point.name | getCoin}}]</span>
                        </div>
                    </div>
                    <!-- 最新价 -->
                    <div class="item new-price">
                        <div class="top">{{point.name | getBaseCoin | getSymbol}} {{point.item.last|autoNumber}}</div>
                        <div class="rmb">￥{{point.name | getBaseCoin | toCNY(point.item.last)}}</div>
                    </div>
                    <!-- 涨跌幅% -->
                    <div class="item increase flexc" :style="{backgroundColor:action == 'up'? $config.color.homeRise:$config.color.homeFall}">
                        {{point.item.change|toFixedEx(2)}}%
                    </div>
                </div>
                
            </div>
            <!-- 底部占位符 -->
            <div class="seat-bottom"></div>

            <!-- 分享二维码 -->
            <div class="toast" v-if="erpic">
                <img :src="'https://eauni.com/api/v3/qrcode?text=https://eauni.com/r/'+$store.state.uid" alt="">
                <span class="close flexc" @click="handClose">&times;</span>
            </div>
           
        </div>
    </template>
    
    <script>
    import Clipboard from 'clipboard';
    import pubHead from '@/common/head/head.vue';
    import { mapMutations } from 'vuex';
    export default {
        name:'Home',
        components :{
            pubHead
        },
        data () {
            return {
                baseCoin: localStorage.baseCoin,//币种
                animate:false,//过渡动画，默认false
                newsList:[],//公告数组
                tickers:{},//tickers数组
                erpic:false,//分享二维码弹窗
                action: 'up',//涨/跌幅榜显示，‘down’显示跌幅榜
            }
        },
        created() {
            // 公告栏新闻定时器
            const scrollTimer = setInterval(() =>{                    
                this.scroll();               
            }, 1000 * 2); //每2秒定时
            this.$once('hook:beforeDestroy', () => {            
                clearInterval(scrollTimer);                                    
            });//清除定时器
        },
        mounted() {
            this.getNews();//调用公告函数
            this.getTickers (this); //传vuex this方法
            //this.load(); //加载tickers函数
            this.getBanner();
        },
        computed: {
            // 币种
            topList(){
                let tickers = this.$common.getJsonData(localStorage.tickers);//读取缓存，数据变化时自动刷新
                for (let pair in tickers){
                    tickers[pair].pair = pair;
                    tickers[pair].name = pair.split('_')[0] + '/' + pair.split('_')[1];
                }
                let topList = this.$common.sortBy(tickers, function(item){
                    return -item.change;
                }).slice(0, 3);
                return topList;
            },
            // 轮播图
            bannerList(){
                let banners = this.$common.getJsonData(localStorage.banners);
                return banners;
            },
            list(){
                let tickers = this.$common.getJsonData(localStorage.tickers);
                let list = [];
                for (var pair in tickers) {
                    // if (pair.split('_')[1] != localStorage.baseCoin) continue;
                    var obj = {
                        pair: pair,
                        name: pair.split('_')[0] + '/' + pair.split('_')[1],
                        coin: pair.split('_')[0],
                        base: pair.split('_')[1],
                        item: tickers[pair]
                    };
                    // var balances = {};
                    // balances[pair.split('_')[1]] = obj.item.last;
                    // obj.valuation = this.$common.toCNY(balances);
                    list.push(obj);
                }
                return list;
            }
        },
        methods: {
            ...mapMutations([
				'getTickers'
			]),
            // 公告滚动
            scroll() {
                this.animate=true;    //向上滚动的时候需要添加css3过渡动画，所以设置true
                setTimeout(()=>{      //使用es6的箭头函数，省去了处理this指向偏移问题
                    this.newsList.push(this.newsList[0]); // 将数组的第一个元素添加到数组的
                    this.newsList.shift(); //删除数组的第一个元素
                    this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
                },500)
            },
            // 获取公告
            getNews() {
                this.$api.home.getNews({
                    limit: 10,
                    p: 1
                }).then(res => {
                    this.newsList = res.data;
                })
            },
            //获取banner图
            getBanner() {
                this.$api.home.getBanner().then(res => {
                    localStorage.banners = JSON.stringify(res.data);
                }).catch(error => {
                    console.log(error)
                })
            },
            //提示，未开通功能
            Tips () {
                this.$toast('暂未开通此项功能，敬请期待')
            },
            // copy(node) {
            //     // console.error(node)
            //     var clipboard = new Clipboard(node);
            //     clipboard.on('success', e => {
            //         this.$toast(this.$t('home.copysuc'));
            //         // 释放内存
            //         clipboard.destroy();
            //     })
            //     clipboard.on('error', e => {
            //         // 不支持复制
            //         this.$toast(this.$t('home.nonsupport'))
            //         // 释放内存
            //         clipboard.destroy()
            //     })
            // },
            // 分享
            share() {
                // if (!this.$store.state.isLogin()){
                //     this.$toast(this.$t('home.shares'));
                //     return;
                // }
                // this.copy('#shareurl');
                this.erpic = true;
            },
            //关闭弹窗
            handClose(){
                this.erpic = false
            },
            //去客服页
            toSever(){
                this.$router.push('/user/callCenter/addOur');
            },
            // 切换幅榜
            switchList (action) {
                if (action == 'up') {
                    this.up();
                };
                if (action == 'down'){
                    this.down();
                } 
            },
            // 点击去交易
            coinDeal (name) {
                let coin = this.$common.getPair(name);
                this.$router.push('/deal/buy?coin='+coin);
            },
            // 数组排序sort函数1
            compare(property) {
                return function (a, b) {
                    var value1 = a.item[property];
                    var value2 = b.item[property];
                    return value2 - value1;
                };
            },
            // 数组排序sort函数2
            compare2(property) {
                return function (a, b) {
                    var value1 = a.item[property];
                    var value2 = b.item[property];
                    return value1 - value2;
                };
            },
            // 涨幅榜排序
            up() {
                this.list.sort(this.compare("change"));
                this.action = 'up';
            },
            // 跌幅榜排序
            down() {
                this.list.sort(this.compare2("change"));
                this.action = 'down';
            },
        }
    }
    </script>
    
    <style lang="less" scoped>
        /* 引用需要的的公共样式 */
        @import url('~@/style/mixin');
         .pub-head {
             position: absolute;
         }
        /* head */
        .home {
            width: 100%;
            height: 100%;
            min-height: 100vh;
            background-color: @pub-bg;
            /* 滚动banner */
            .swiper {
                width: 100%;
                height: 2.3rem;
            }
            /* 主体 */
            .main {
                position: relative;
                padding: .44rem .28rem .28rem .28rem;
                /* 通知栏 */
                .message {
                    position: absolute;
                    width: 6.94rem;
                    height:.6rem;
                    font-size: .26rem;
                    background-color: @pub-bg;
                    left: .28rem;
                    top:-.3rem;
                    .border-radius(.1rem);
                    padding: 0 .2rem;
                    overflow: hidden;
                    .left {
                        width: 1.6rem;
                        color: #555;
                    }
                    .rule {
                        margin: 0 .3rem;
                        color: #f3f3f3;
                    }
                    .right-info {
                        position: relative;
                        width: 100%;
                        color: #c0c0c0;
                        &.anim{
                            transition: all 0.5s;
                            margin-top: -30px;
                        }
                        .oneline {
                            height: .6rem;
                            line-height:.6rem;
                        }
                    }
                }
                /* 币种 */
                .coin {
                    height: 1.4rem;
                    .pairs {
                        width: 3rem;
                        height:100%;
                        padding: .1rem .12rem;
                        margin-left: .2rem;
                        .border-radius(.12rem);
                        background-color: @pub-bg;
                        box-shadow: 0px 1px 8px 1px #d0cdcd;
                        margin-right: 0.1rem;
                        &.one {
                            margin-left:0;
                            position: relative;
                        }
                    }
                    .pairs:last-child{
                        margin-right: 0;
                    }
                    .left {
                        // width: 1.44rem;
                    }
                    .coin-name {
                        font-size: 0.2rem;
                        line-height: 0.4rem;
                        font-weight: bold;
                    }
                    .Ranger {
                        font-size: .24rem;
                        color: #68bd68;
                        line-height: .4rem;
                        &.red {
                            color: #ff6f6c;
                        }
                        .iconfont {
                            font-size: .2rem;
                        }
                    }
                    .price {
                        font-size: .26rem;
                        color: #bdbdbd;
                    }
                    .right-img {
                        width: .5rem;
                        height: .5rem;
                        margin-top: .1rem;
                    }
                }

                /* 菜单分类 */
                .menu {
                    height: 3rem;
                    background-color: #fff;
                    .border-radius(.12rem);
                    margin-top: .2rem;
                    box-shadow: 0px 1px 8px 1px #d0cdcd;
                    .item {
                        width: 2.3rem;
                        text-align: center;
                        padding: .16rem 0;
                        .iconfont {
                            font-size: .6rem;
                            color: @main-cor;
                        }
                    }
                    .text {
                        margin-top: .08rem;
                        font-size: .26rem;
                    }
                }

            }
            
      }
.toast{
    position: fixed;
	top: 0 ;
	left: 0;
	z-index: 100;
    background: rgba( 0, 0, 0, 0.6);
	width: 100%;
	height: 100%;
}
.toast img{
    position: fixed;
	top: 40%;
    left: 50%;
	transform: translate(-50%, -35%);
}
 
.close {
    position: absolute;
    width:1rem;
    font-size: .6rem;
    color: #fff;
    height: 1rem;
    top: .3rem;
    right: .3rem;
}
.home-list {
            margin: 0 .28rem;
            .border-radius(.12rem);
            box-shadow: 0px 1px 8px 1px #d0cdcd;
            overflow: hidden;
            .tab {
                height: .88rem;
                background-color: @pub-bg;
                .flex1 {
                    position: relative;
                    font-size: .3rem;
                    color: #b7b7b7;
                    &.active {
                        color: #333;
                        .afters {
                            position: absolute;
                            content: '';
                            width: .16rem;
                            height: .16rem;
                            .border-radius(50%);
                            left: 1rem;
                            top: .36rem;
                        }
                    }
                }

            }
            /* 列表信息 */
            .classify {
                height: .5rem;
                background-color: #e8e8e8;
                padding: 0 .3rem;
                font-size: .24rem;
            }
            .coin {
                height: .7rem;
                padding: 0 .1rem 0 .3rem;
                font-size: .24rem;
                background-color: @pub-bg;
                .item {
                    height: .5rem;
                    .img {
                        width: .36rem;
                        height: .36rem;
                    }
                    .coin-name {
                        height: 100%;
                        margin-left: .16rem;
                        width: 1.5rem;
                        .top {
                            font-size: .24rem;
                            font-weight: 600;
                            line-height: .24rem;
                            color: #444;
                        }
                        span {
                            display: block;
                            color: #e8e8e8;
                            font-size: .2rem;
                            line-height: .24rem;
                        }
                    }
                    &.new-price {
                        font-size: .22rem;
                        width: 2.1rem;
                        text-align: left;
                        .top {
                            padding-left: .04rem;
                            color: #ff6f6c;
                        }
                        .rmb {
                            color: #616161;
                        }
                    }
                    &.increase {
                        width: 1.4rem;
                        height: .44rem;
                        color: #fff;
                        font-size: .24rem;
                    }
                }
                
            }
        }
    </style>
    
    