/**
 * user模块接口列表
 */

import axios from '@/api/https'; // 导入https中创建的axios实例

const user = {
	//登录
	login(params) {
		return axios.post(`${API_URL}/login`, params)
	},
	//登录------>获取登录验证码
	getCode() {
		return axios.get(`${API_URL}/signin/getCode`)
	},
	//登录------>类型验证
	authType(params) {
		return axios.post(`${API_URL}/authType`, params)
	},
	//获取初始信息
	getInfo() {
		return axios.get(`${API_URL}/info`)
	},
	//注册
	signs(params) {
		return axios.post(`${API_URL}/signup`, params)
	},
	//注册------>获取注册验证码
	getSignCode(params) {
		return axios.post(`${API_URL}/signup/getCode`, params)
	},
	//忘记密码
	forget(params) {
		return axios.post(`${API_URL}/account/resetPassword`, params)
	},
	//忘记密码------>获取忘记密码验证码
	getForgetCode(params) {
		return axios.post(`${API_URL}/account/resetPassword/code`, params)
	},
	// 资产列表
	getBalance() {
		return axios.get(`${API_URL}/account/balances`)
	},
	//资产列表------>充币
	getCreateWalletAddress(params) {
		return axios.post(`${API_URL}/account/createWalletAddress`, params)
	},
	//资产列表------>充币------>二维码地址
	getQrcodeAddress(params) {
		// return axios.get(`${API_URL}/qrcode?text=${params}`)
		return `${API_URL}/qrcode?text=${params}`
	},
	//获取所有交易记录
	getAllRecord(params) {
		return axios.get(`${API_URL}/account/history?type=depositAndWithdraw&coin=${params}`)
	},
	//获取充值记录
	getDepositRecord(params) {
		return axios.get(`${API_URL}/account/history?type=deposit&coin=${params}`)
	},
	//获取提现记录
	getWithdrawRecord(params) {
		return axios.get(`${API_URL}/account/history?type=withdraw&coin=${params}`)
	},
	// 获取当前币种余额
	getCoinBalance(params) {
		return axios.get(`${API_URL}/account/getBalance/${params}`)
	},
	// 确定提现
	getConfirm(params) {
		return axios.post(`${API_URL}/account/withdraw`, params)
	},
	// 转账
	TransferAccount(params){
		return axios.post(`${API_URL}/3rd/withdraw/request`,params)
	},
	// 添加提现地址
	getAddress(params) {
		return axios.post(`${API_URL}/account/addWithdrawAddress`, params)
	},
	// 获取提现历史记录
	getAddressHistory(params) {
		return axios.get(`${API_URL}/account/getWithdrawAddress/${params}`)
	},
	getC2CInfo(params) {
		return axios.get(`${C2C_URL}/c2c`, params)
	},
	//C2C交易
	getC2C(params) {
		return axios.post(`${C2C_URL}/buyAndSell`, params)
	},
	//C2C交易记录
	getRecord(params) {
		return axios.get(`${C2C_URL}/user/tradeList`, params)
	},
	//C2C取消订单
	getCancel(params) {
		return axios.post(`${C2C_URL}/cancel`, params)
	},
	//C2C已转账
	getTransfer(params) {
		return axios.post(`${API_URL}/c2c/user/paid`, params)
	},
	// 添加银行卡
	addBnakCard(params) {
		return axios.post(`${API_URL}/account/bankCard`, params)
	},
	//获取银行卡信息
	getBnakCard() {
		return axios.get(`${API_URL}/account/bankCard`)
	},
	//获取币种
	getFocus() {
		return axios.get(`${API_URL}/info`)
	},
	// 删除关注的币种
	getDelConcern(params) {
		return axios.post(`${API_URL}/account/favorites`, params)
	},
	//获取所有币种
	getAllCoin() {
		return axios.get(`${API_URL}/tickers`)
	},
	//获取已关注的币种
	getConcern() {
		return axios.get(`${API_URL}/account/info`)
	},
	//修改密码
	changePassword(params) {
		return axios.post(`${API_URL}/account/changePassword`, params)
	},
	// 开启谷歌验证
	openGoogle() {
		return axios.get(`${API_URL}/account/isAuth`)
	},
	//开启谷歌验证------>获取密钥
	getSecretKey() {
		return axios.get(`${API_URL}/account/getOTP`)
	},
	//开启谷歌验证------>弹框确定和取消谷歌认证
	setOtp(params) {
		return axios.post(`${API_URL}/account/setOTP`, params)
	},
	//绑定手机号码
	getBindMobile(params) {
		return axios.post(`${API_URL}/account/bindMobile`, params)
	},
	//绑定手机号码------>获取绑定验证码
	getBindCode(params) {
		return axios.post(`${API_URL}/account/bind/getMobileCode`, params)
	},
	//解绑手机号码
	getUnbindMobile(params) {
		return axios.post(`${API_URL}/account/unbindMobile`, params)
	},
	//解绑手机号码------>获取解绑验证码
	getUnbindCode() {
		return axios.get(`${API_URL}/account/unbind/getMobileCode`, )
	},
	// 弹框获取验证码
	getPopCode() {
		return axios.post(`${API_URL}/account/getCode`)
	},
	//绑定邮箱
	getBindEmail(params) {
		return axios.post(`${API_URL}/account/bindEmail`, params)
	},
	//绑定邮箱------>获取绑定邮箱验证码
	getEbindCode(params) {
		return axios.post(`${API_URL}/account/bind/getEmailCode`, params)
	},
	//解绑邮箱
	getUnbindEmail(params) {
		return axios.post(`${API_URL}/account/unbindEmail`, params)
	},
	//解绑邮箱------>获取解绑邮箱验证码
	getEunbindCode(params) {
		return axios.get(`${API_URL}/account/unbind/getEmailCode`, params)
	},
	// 设置验证类型
	getAuthType(params) {
		return axios.post(`${API_URL}/setAuthType`, params)
	},
	//实名认证------>获取验证状态
	getCertification() {
		return axios.get(`${API_URL}/account/getCertification`)
	},
	//实名认证------>提交认证
	submitCertification(params) {
		return axios.post(`${API_URL}/account/certification`, params)
	},
	// 获取新闻列表
	getNewList(params) {
		return axios.get(`${API_URL}/news/list`, params)
	},
	//获取公告详情内容
	getShow(params) {
		return axios.get(`${API_URL}/news/show/${params}`)
	},

}

export default user;
