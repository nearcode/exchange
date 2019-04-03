<template>
    <div class="ali-validate flexc">
        <div id="sc" class="flexc">
        </div>
        <remote-js src="http://g.alicdn.com/sd/nvc/1.1.112/guide.js"></remote-js>
        <remote-js src="http://g.alicdn.com/sd/smartCaptcha/0.0.4/index.js"></remote-js>
        <!-- <remote-js src="http://g.alicdn.com/sd/quizCaptcha/0.0.1/index.js"></remote-js> -->
        
    </div>
</template>
    
    <script>
    import Scroll from "@/common/scroll/scroll";
        export default {
            data() {
                return {

                }
            },
            components: {
                'remote-js': {
                    render(createElement) {
                    return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
                },
                props: {
                    src: { type: String, required: true },
                    },
                },
            }, 
            mounted () {
                console.log(111);
                window.NVC_Opt = {
                    appkey:'CF_APP_1',
                    scene:'nvc_register',
                    // renderTo:'#captcha',
                    // trans: {"key1": "code0", "nvcCode":200},
                    // elements: [
                    //     'http://img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
                    //     'http://img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png'
                    // ], 
                     // bg_front: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
                    // obj_ok: 'http://img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
                    // bg_back_pass: 'http://img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
                    // obj_error: 'http://img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
                    // bg_back_fail: 'http://img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
                    // upLang:{"cn":{
                    //     _ggk_guide: "请在屏幕上滑动，刮出两面盾牌",
                    //     _ggk_success: "恭喜您成功刮出盾牌<br/>继续下一步操作吧",
                    //     _ggk_loading: "加载中",
                    //     _ggk_fail: ['呀，盾牌不见了<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                    //     _ggk_action_timeout: ['我等得太久啦<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                    //     _ggk_net_err: ['网络实在不给力<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
                    //     _ggk_too_fast: ['您刮得太快啦<br/>请', "javascript:noCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题']
                    //     }
                    // }
                };
                
                // var that = this;
                // // window.onload = function(){
                //     var ic = new smartCaptcha({
                //         renderTo: '#sc',
                //         width: '100%',
                //         secvrf_layout:true,
                //         height: 42,
                //         default_txt: '点击按钮开始验证',
                //         success_txt: '验证成功',
                //         fail_txt: '验证失败，请点击刷新',
                //         scaning_txt: '安全检测中',
                //         success: function(data) {
                //             that.logins({token:NVC_Opt.token, sessionID:data.sessionId, sig:data.sig});
                //         },
                //     });
                //     ic.init();
                // // }
                setTimeout(()=> {
                    this.loadParameter();
                },3000);//3s后执行，因为该函数要在js函数配置完后执行
            },
            methods: {
                logins (token) {
                    this.$emit('loging',token);
                },
                //加载配置参数
                loadParameter() {
                    return new Promise((resolve, reject) =>{
                        
                        var that = this;
                        var ic = new smartCaptcha({
                            renderTo: '#sc',
                            width: '100%',
                            secvrf_layout:true,
                            height: 42,
                            default_txt: '点击按钮开始验证',
                            success_txt: '验证成功',
                            fail_txt: '验证失败，请点击刷新',
                            scaning_txt: '安全检测中',
                            success: function(data) {
                                that.logins({token:NVC_Opt.token, sessionID:data.sessionId, sig:data.sig});
                            },
                        });
                        ic.init();
                    
                    })
                    
                }
            }
        }
    </script>
    
    <style lang="less" scoped>
    @import url('~@/style/mixin');
    .ali-validate {
        height: 3rem;
        width: 100%;
        #sc {
            margin-left: 0!important;
            margin-top: 0!important;
            
        }
        
    }
    </style>

    <style>
    #SM_TXT_1,#SM_TXT_2,#SM_TXT_3 {
        margin: 0 .2rem!important;
    }
    #SM_POP_INNER_1 {
        left: 0!important;
        top:.34rem!important;
    }
    </style>
    