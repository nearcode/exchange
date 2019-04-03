import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	logo: "",
    webTitle: '',
	markets: {},
	coins: {},
	lastPrices: {},
	merchantFee: 0,
	uid: '',//用户ID
	uid2: 0,
	webLogo: window.LOGO,
	username: '',//用户名
	email: '',//邮箱
	authType: {},//类型
	favorites: [],
	lastPage: '',
	mobile:'',//手机
	tickers: null,//tickers数据
	baseCoin: '',
	balances: {},
	truename:'',//真实姓名
	baseCoinList: [], //
    // 保存登录状态	
	isLogin: function () {
		let token = localStorage.token;
		if (!token) return false;
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		var exp = JSON.parse(window.atob(base64)).exp;
		if (!exp) return false;
		return Math.round(new Date().getTime() / 1000) <= exp;
	},
	//保存中英文切换状态
	language:function(){
		var lang = window.localStorage.getItem('language');
		if(lang == 'chinese'){
			return false
		}else if(lang == 'english'){
			return true
		}else{
			return false
		}
	},
}

const mutations = {
    //是否登录
    login(state){
        state.isLogin()
    },
    //是否登出
    loginOut(state){
		window.localStorage.removeItem('token');
        state.isLogin()
    },
    //判断手机号码是否绑定成功
    bindSuccess(state,val){
        state.mobile = val
	},
	//判断邮箱是否绑定
	bindEmail(state,val){
		state.email = val
	},
    // 获取初始信息
    getInfos(state,val){
        val.$api.user.getInfo().then((res) =>{
            const datas = res;
			state.webTitle = datas.siteInfo.title;
			state.logo = datas.siteInfo.logo;
			document.title = state.webTitle;
			localStorage.markets = JSON.stringify(datas.baseCoinList);
			state.baseCoin = localStorage.baseCoin = datas.baseCoinList[0];
			state.baseCoinList = datas.baseCoinList;
			state.coins = datas.coins;
			localStorage.coins = JSON.stringify(datas.coins);
			state.lastPrices = datas.lastPrices;
			localStorage.lastPrices = JSON.stringify(state.lastPrices||'{}');
			localStorage.merchantFee = datas.merchantFee;
			localStorage.tencentCaptchaAppid = datas.tencentCaptchaAppid;
			
			if (!datas.uid) return;
			state.uid = datas.uid;
			localStorage.id = datas.uid;
			state.uid2 = datas._id;
			state.username = datas.username;
			localStorage.username = datas.username;
			state.email = datas.email;
			localStorage.setItem('email',datas.email);
			state.authType = datas.authType;
			state.truename = datas.truename;
			state.favorites = datas.favorites||[];
			localStorage.favorites = JSON.stringify(state.favorites)
			state.mobile = datas.mobile;
			localStorage.setItem('mobile',datas.mobile);
        }).catch((err) =>{
            console.log(err)
        })
	},
	// 获取Tickers
    getTickers(state, vue){
		vue.$api.home.getTickers().then(res => {
			res = res.data
			for (let pair in res){
				res[pair].pair = pair;
				res[pair].name = pair.split('_')[0] + '/' + pair.split('_')[1];
			}
		   state.tickers = JSON.stringify(res);
		   localStorage.tickers = JSON.stringify(res);
		   if (!localStorage.pair)	localStorage.pair = vue.$common.getDefaultMarket();
		   var lastPrices = {};
		   for (var ticker in res){
				lastPrices[ticker] = res[ticker].last || 0
		   }
		   localStorage.lastPrices = JSON.stringify(lastPrices);
		});
	},
	// 获取资产
	getBalances(state, vue){
		vue.$api.user.getBalance().then(res =>{
            let balances = {};
            //遍历资产列表
            for(var coin in res.data){
                balances[coin] = res.data[coin];
                balances[coin].allValuation = vue.$common.toCNY(coin, res.data[coin].available+(res.data[coin].lock||0));
                balances[coin].valuation = vue.$common.toCNY(coin, res.data[coin].available);
			}
			state.balances = balances;
            // localStorage.balances = JSON.stringify(balances);
        })
	}
}

const actions = {
	
}

// 导出
export default new Vuex.Store({
    state,
    mutations,
    actions
})