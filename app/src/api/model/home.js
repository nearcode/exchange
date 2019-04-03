/**
 * home模块接口列表
 */

import axios from '@/api/https'; // 导入https中创建的axios实例

const home = {
	// 获取Tickers
	getTickers() {
		return axios.get(`${EXCHANGE_URL}/tickers`);
	},
	// 获取token
	getToken() {
		return axios.get(`${API_URL}/chat/getToken`);
	},
	//获取公告
	getNews(params) {
		return axios.get(`${API_URL}/news/list`, {
			params: params
		});
	},
	//获取首页banner图
	getBanner() {
		return axios.get(`${API_URL}/banners`)
	},
	//委托
	getOrder(param) {
		return axios.get(`${EXCHANGE_URL}/myOrders`, {
			params: param
		})
	},
	// 成交记录
	getHistory(param) {
		return axios.get(`${API_URL}/market/getMyOrderHistory`, {
			params: param
		})
	},
	// 取消委托订单
	cancelOrder(param) {
		return axios.post(`${EXCHANGE_URL}/cancel`, param)
	},
	// 历史资金
	historyList(param) {
		return axios.get(`${API_URL}/market/getOrderHistory?p=${param}&limit=20`)
	},
}

export default home;
