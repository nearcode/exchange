'use strict'

// define(function () {
    function getParameterByName (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search)
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
    }

    /**
     * param 将要转为URL参数字符串的对象
     * key URL参数字符串的前缀
     * encode true/false 是否进行URL编码,默认为true
     *
     * return URL参数字符串
     */
    function urlEncode (param, key, encode) {
        if(param==null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };

    function init(datas,color){
        window.subscribers = {}
        window.tickTotalVolume = null
        // var api = new WebSocket(datas.wsURL.url, datas.wsURL.protocol)
        // api.onerror = function () {
        // TODO reload iframe
        // }
        // api.onclose = function () {
        // TODO reload iframe
        // }
        // api.onopen = function () {
        // api.send(JSON.stringify({
        //   request: 'inst_tick',
        //   inst_id: datas.instId,
        //   subscribe: true
        // }))
        // }
        // api.onmessage = function (event) {
        // var tick = JSON.parse(event.data)
        // tick.volume = Number(tick.volume)
        // if (tick.volume !== window.tickTotalVolume) {
        //   for (var prop in window.subscribers) {
        //     if (window.subscribers.hasOwnProperty(prop)) {
        //       window.subscribers[prop](tick)
        //     }
        //   }
        //   window.tickTotalVolume = Number(tick.volume)
        // }
        // }

        var lang = localStorage.lang=='cn'?'zh':(localStorage.lang || 'zh');
        var config = {
            fullscreen: false,
            symbol: datas.symbol,
            timezone: datas.timezone,
            mode: datas.mode,
            interval: 60,
            height: 367.2,
            width:'100%',
            // autosize: true,
            container_id: "trade_main",
            loading_screen: { backgroundColor: "#4b617b" },
            overrides: {
                "paneProperties.background":color.bg,
                "paneProperties.vertGridProperties.color": color.vert,
                "paneProperties.horzGridProperties.color": color.vert,
                "mainSeriesProperties.candleStyle.upColor": color.up,
                "mainSeriesProperties.candleStyle.downColor": color.down,
                "mainSeriesProperties.candleStyle.drawWick": true, // shadow line
                "mainSeriesProperties.candleStyle.wickUpColor": color.wickUp,
                "mainSeriesProperties.candleStyle.wickDownColor": color.wickDown,
                "mainSeriesProperties.candleStyle.drawBorder": true,
                "mainSeriesProperties.candleStyle.borderUpColor": color.borderUp,
                "mainSeriesProperties.candleStyle.borderDownColor": color.borderDown,
                "scalesProperties.backgroundColor": color.backgroundColor,
                "scalesProperties.lineColor":color.line,
                "scalesProperties.textColor": color.text,
                "paneProperties.topMargin": 25,
                "paneProperties.bottomMargin": 5,
                volumePaneSize: "small",
            },
            // studies_overrides: {
            //     "volume.volume.color.0": "#ff657b",
            //     "volume.volume.color.1": "#00c6b0",
            //     "volume.volume.transparency": 70
            // },
            datafeed: {
                onReady: function (cbk) {
                    setTimeout(function () {
                        cbk({
                            supported_resolutions: [1, 5, 30, 60, 120, 240, '1D', '1W'],
                            supports_time: true
                        })
                    }, 0)
                },
                resolveSymbol: function (symbolName, s) {
                    setTimeout(function () {
                        s(datas.symbolInfo)
                    }, 0)
                },
                getBars: function (symbolInfo, resolution, from, to, onHistoryCallback) {
                    var xhr = new XMLHttpRequest()
                    if (resolution === 'D') {
                        resolution = 1440
                    } else {
                        resolution = Number(resolution)
                    }
                    xhr.onreadystatechange = function onStateChange () {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                var tick = JSON.parse(this.responseText)
                                if (tick) {
                                    var i = 0
                                    var bars = []
                                    for (i = 0; i < tick.length; i++) {
                                        if (tick[i][1]) {
                                            bars.push({
                                                open: tick[i][2],
                                                high: tick[i][3],
                                                low: tick[i][4],
                                                close: tick[i][5],
                                                volume: tick[i][1],
                                                time: tick[i][0]
                                            })
                                        }
                                    }
                                    if (bars.length) {
                                        var last = bars[bars.length - 1]
                                        if (window['lastTick'+resolution]) {
                                            if (window['lastTick'+resolution].time <= last.time) {
                                                window['lastTick'+resolution] = last
                                            }
                                        } else {
                                            window['lastTick'+resolution] = last
                                        }
                                    }
                                    onHistoryCallback(bars, { noData: !bars.length })
                                }
                            } catch (err) {
                                console.error(err) // eslint-disable-line no-console
                            }
                        }
                    }
                    xhr.open('GET', datas.restAPIURL+'?'+urlEncode({
                        nonce: (new Date()).getTime() % 429496729,
                        request: 'ticks',
                        pair: datas.pair,
                        start_time: from,
                        end_time: to,
                        interval: resolution * 60
                    }), true)
                    xhr.setRequestHeader('Content-type', 'application/json')
                    xhr.send()
                },
                subscribeBars: function (symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
                    if (resolution === 'D') {
                        resolution = 1440
                    } else {
                        resolution = Number(resolution)
                    }
                    window.subscribers[subscriberUID] = function (tick) {
                        var last = window['lastTick'+resolution]
                        if (!last) {
                            return
                        }
                        var t1 = Math.floor(tick.timestamp / 1000)
                        t1 = t1 - t1 % (resolution * 60000)
                        var p = Number(tick.last)
                        if (t1 > last.time) {
                            var t = {
                                open: p,
                                high: p,
                                low: p,
                                close: p,
                                volume: tick.volume - window.tickTotalVolume,
                                time: t1
                            }
                            onRealtimeCallback(t)
                            window['lastTick'+resolution] = t
                        } else {
                            var t = {
                                open: last.open,
                                high: Math.max(last.high, p),
                                low: Math.min(last.low, p),
                                close: p,
                                volume: window.tickTotalVolume ? (last.volume + tick.volume - window.tickTotalVolume) : last.volume,
                                time: last.time
                            }
                            onRealtimeCallback(t)
                            window['lastTick'+resolution] = t
                        }
                    }
                },
                unsubscribeBars: function (subscriberUID) {
                    delete window.subscribers[subscriberUID]
                }
            },
            library_path: "/static/tradingview/",
            custom_css_url: color.url,
            locale: lang,
            drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
            disabled_features: [
                "use_localstorage_for_settings", 
                "border_around_the_chart", 
                "volume_force_overlay", 
                "pane_context_menu", 
                "header_symbol_search", 
                "symbol_search_hot_key", 
                "header_undo_redo", 
                "header_compare", 
                "header_chart_type", 
                "header_screenshot", 
                'header_interval_dialog_button'
            ],
            enabled_features: [
                'dont_show_boolean_study_arguments',
                'hide_last_na_study_output'
            ],
            charts_storage_url: 'http://saveload.tradingview.com',
            charts_storage_api_version: "1.1",
            client_id: 'tradingview.com',
            user_id: 'public_user_id',
            toolbar_bg: '#455a73',
            time_frames: [
                { text: '1m', resolution: "240", title: lang === 'zh' ? '月' : '1 Month', description: lang === 'zh' ? '近一月的K线走势' : 'Ticks in one month' },
                { text: '7d', resolution: "30", title: lang === 'zh' ? '周' : '1 Week', description: lang === 'zh' ? '近一周的K线走势' : 'Ticks in one month' },
                { text: '1d', resolution: "5", title: lang === 'zh' ? '日' : '1 Day', description: lang === 'zh' ? '今日K线走势' : 'Ticks in one day' },
                { text: '6h', resolution: "1", title: lang === 'zh' ? '6小时' : '6 Hours', description: lang === 'zh' ? '近6小时K线走势' : 'Ticks in 6 hours' }
            ]
        }
        // if (window.innerWidth < 756)
        //     datas.mode = 'mobile';
        // if (datas.mode==='mobile') {
        //     config.preset = 'mobile'
        // }
        localStorage.setItem('candle-theme', datas.theme)
        window.tvWidget = new TradingView.widget(config);
        window.tvWidget.onChartReady(function() {
            // var e = ["#965fc4", "#84aad5", "#55b263", "#b7248a"];
            // [5, 10, 30, 60].forEach(function(t, n) {
            //     window.tvWidget.chart().createStudy("Moving Average", !1, !1, [t], null, {
            //         "plot.color.0": e[n],
            //         // precision: 8
            //     })
            // });
        })
    }

//     return {
//         init: init
//     }
// });


export default {init}