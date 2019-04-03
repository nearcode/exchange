/*
*   动态计算html的font-size尺寸
*   使用rem单位进行移动端适配
*   默认设计图尺寸750，单位转换为1rem=100px
*/
;(function(c,d){var e=document.documentElement||document.body,a="orientationchange" in window?"orientationchange":"resize",b=function(){var f=e.clientWidth;e.style.fontSize=(f>=750)?"100px":100*(f/750)+"px"};b();c.addEventListener(a,b,false)})(window);