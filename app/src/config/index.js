/**
 * E网项目颜色，接口 等全局控制js
 */

/**
 * 接口域名的管理
 */
//用户中心
let chatKey = '', //key
	email = '', //邮箱
	kefus = '',
	site = '', baseDomain, exchangeDomain, c2cDomain;

let protocol = location.protocol;
baseDomain = 'localhost:4001';
exchangeDomain = 'localhost:4003';
c2cDomain = 'localhost:4004';


window.API_URL = `${protocol}//${baseDomain}/api/v1`;
window.EXCHANGE_URL = `${protocol}//${exchangeDomain}/api/v1`;
window.C2C_URL = `${protocol}//${c2cDomain}/api/v1`;
window.SOCKET_URL = `${protocol}//${exchangeDomain}`;

// 颜色
let color = {
	mainCor:'#3b82de',//主色调
	titleCor:'#fff',//头部文字颜色
	botCor:'#999',//底部nav初始颜色
	homeRise:'#4fd68b',//首页涨幅背景色
	homeFall:'#ff433f',//首页跌幅背景色
	marketRise:'#3ebf17',//行情涨幅背景色
	marketFall:'#ff433f',//行情跌幅背景色
}
// site = "eauni"
export default {
	chatKey,
	email,
	kefus,
	site,
	baseDomain,
	color
};
