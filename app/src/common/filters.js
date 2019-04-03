import {BigNumber} from 'bignumber.js'
BigNumber.config({ERRORS: false, DECIMAL_PLACES: 10, EXPONENTIAL_AT: 1e+9});
import common from '@/common';

let autoNumber = function(n, len){
    var number = common.toNumber(n);
    var str = new BigNumber(number).toString().split('.')[1];
    var n = common.getAutoNumber(number);
    if (str && str.length > n) n = str.length;
    return common.toFixedEx(number, len || n);
}
let autoFixed = function(n){
    return common.autoFixed(n);
}
let toFixedEx = function(number, len){
    return common.toFixedEx(number, len);
}
let toCNY = function(coin, data){
    return common.toCNY(coin, data);
}
let getCoin = function(str){
    return common.getCoin(str);
}
let getBaseCoin = function(str){
    return common.getBaseCoin(str);
}
let getSymbol = function(str){
    return common.getSymbol(str);
}
let estimate = function(str){
    return common.estimate(str);
}
let toDate = function(date, detail) {
    var newDate = new Date(date*1000)
    var year = newDate.getFullYear()
    var month = newDate.getMonth() + 1
    var day = newDate.getDate()
    var hours = newDate.getHours()
    var minutes = newDate.getMinutes()
    var seconds = newDate.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (day >= 0 && day <= 9) {
      day = '0' + day
    }

    if (detail) {
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds 
    }
    return year + '-' + month + '-' + day
}
// 年份
let toYear = function(val){
    var date = new Date(val)
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' +date.getDate();
}
// 时间
let timer = function(val){
    var date = new Date(val) 
    return  date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
//CNN_BTC  转换为BTC/CNN
let toString = function(str) {
    var arr = str.split('_')
    var newStr = arr[0] + '/' + arr[1]
    return newStr
}
export {
    toString,//后端显示币种名转换前端显示名
    autoNumber, //自动调整价格小数位数
    autoFixed,  //自动调整数量小数位数
    toFixedEx,  //调整小数点位数
    toCNY,      //估算人民币价值
    getCoin,    //获取交易对币名，C2C_BTC BTC/C2C == BTC
    getBaseCoin,    //获取交易对主币名 C2C_BTC BTC/C2C == C2C
    getSymbol,      //获取币所对应的符号
    estimate,   //估算数值 100000 = 10万 1000=1000
    toDate,
    toYear,
    timer
}


/*autoNumber  价格 、宽度自动，一般用于价格*/
/* autoFixed 数量 过滤参数   eg: 1000.12345678   转换为1000.12 一般用于数量*/
/*toCNY   转换人名币   coin：币种名，，data数量，   {BTC:0.1} 可以多币种转换  eg:toCNY({BTC:0.1, ETH:1,...等})*/