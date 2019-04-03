const sortBy = require('lodash.sortby');
const remove = require('lodash.remove');
import {
  BigNumber
} from 'bignumber.js'


export default {
  // getJsonData(localStorage.tickers, {})
  getJsonData: function (str, value = {}) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return value;
    }
  },
  //获取数量精确度
  getAutoNumber: function (n) {
    n = Math.abs(n);
    if (n == 0) return 0;
    // if (this >= 10) return 2;
    // if (this >= 1) return 3;
    if (n >= 0.1) return 3;
    if (n >= 0.01) return 4;
    if (n > 0.001) return 6;
    return 8;
  },
  //字符转成数字类型
  toNumber: function (str, len) {
    len = len || 8;
    var n = parseFloat(str);
    if (isNaN(n) || Math.abs(n) == Infinity)
      return 0;
    n = parseFloat(this.toFixedEx(n, len));
    if (n == 0)
      return Math.abs(n);
    return n * 1.0;
  },
  toFixedEx: function (n, len) {
    if (typeof len == 'undefined') len = 8;
    return new BigNumber(n).toFixed(len);
  },
  autoFixed: function (n) {
    var len = this.getAutoNumber(n);
    return this.toFixedEx(n, len);
  },
  //排序 [{price:3}, {price:2}, {price:4}]
  sortBy(data, callback) {
    return sortBy(data, callback);
  },
  //var a = clone(ab)
  //ab = {ab:1}
  clone: function (obj) {
    var o;
    if (typeof obj == "object") {
      if (obj === null) {
        o = null;
      } else {
        if (obj instanceof Array) {
          o = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(this.clone(obj[i]));
          }
        } else {
          o = {};
          for (var j in obj) {
            o[j] = this.clone(obj[j]);
          }
        }
      }
    } else {
      o = obj;
    }
    return o;
  },
  //从数组中删除 数据
  //remove([1,2,4], 4)
  remove(a, b){
    return remove(a, b);
  },
  /**
   * 1. coins="BTC" data=0.01
   * 2. coins = {
   *    BTC: 0.01,
   *    ETH: 1
   * }
   */
  toCNY: function (coins, data) {
    var lastPrices = this.getJsonData(localStorage.lastPrices);
    var tempData = {};
    if (typeof coins == 'string') {
      tempData[coins] = data;
    } else
      tempData = coins;
    var value = 0;
    for (var coin in tempData) {
      var price = lastPrices[coin+"_C2C"] || lastPrices[coin+"_CNY"] || 0;
      if (price == 0) {
        if (coin == 'CNY' || coin == 'CNN' || coin == 'EC' || coin == 'CNYT') {
          price = 1;
        } else if (coin == 'BTC')
          price = localStorage.btcPrice;
        else
          price = lastPrices['BTC_' + coin] * localStorage.btcPrice;
      }
      value += this.toNumber(tempData[coin] * price)
    }
    return value
  },
  //ETH/BTC  转成交易对 ETH_BTC
  getPair: function(str) {
    var arr = str.split('/')
    var oldStr = arr[0] + '_' + arr[1]
    return oldStr
  },
  //获取 主币种 
  getBaseCoin: function(str){
    let arry = str.split('/');
    if (arry.length > 1) {
      return arry[1];
    }else {
      arry = str.split('_');
      return arry[1];
    }
  },
  //获取交易币种
  getCoin: function(str){
    let arry = str.split('/');
    if (arry.length > 1) {
      return arry[0];
    }else {
      arry = str.split('_');
      return arry[0];
    }
  },
  //获取币符号
  getSymbol: function(coin){
    if (coin == 'BTC'){
      return '฿';
    }
    else if (coin == 'USDT'){
      return '$';
    }
    else if (coin == 'CNY'){
      return '￥';
    }
    else return coin;
  },
  //默认的交易市场
  getDefaultMarket() {
    let tickers = this.getJsonData(localStorage.tickers);
    try {
      return sortBy(tickers, function (item) {
        return -item.baseVol;
      })[0].pair;
    } catch (e) {
      return '';
    }
  }, 
  //传交易对(BTC_ILK)获取最后的价格
  lastPrice(pair) {
    let tickers = this.getJsonData(localStorage.tickers);
    try {
      return tickers[pair].last;
    } catch (e) {
      return 0;
    }
  },
  //通过交易对获取行情信息
  getTicker(pair, value) {
    let tickers = this.getJsonData(localStorage.tickers, value);
    try {
      return tickers[pair] || value;
    } catch (e) {
      return {};
    }
  },
  //估值
  estimate(n){
    if (n > 10000){
      return this.autoFixed(n/10000)+'万';
    }else{
      return this.toFixedEx(n, 2);
    }
  },
}
