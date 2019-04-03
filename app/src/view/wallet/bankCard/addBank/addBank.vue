<template>
    <!-- 添加银行卡 -->
    <div class="addBank">
        <!-- 头部 -->
        <pubHead 
            :title="$t('wallet.AddCard')" 
            titleColor="#fff"
            :isbackShow = 'true'
            leftColor="#fff"
            bgColor="#3b82de">
        </pubHead>
        <!-- 添加银行卡 -->
        <div class="addBank-txt">
            <!-- 姓名 -->
            <div class="input-name">
                <input type="text" :placeholder="$t('wallet.Pname')" v-model="name" disabled>
            </div>
            <!-- 提示 -->
            <div class="hint">
                <span>{{$t('wallet.Only')}}</span>
            </div>
            <!-- 选择开户银行 -->
            <div class="select jus-b" @click="popupVisible1 = true" style="margin-bottom:1px">
                <input type="text" :placeholder="$t('wallet.OpenBank')" v-model="bankCard.bank">
                <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
            </div>
            <!-- 其他银行 -->
            <div class="select jus-b" v-if="other">
                <input type="text" :placeholder="$t('wallet.OrtherBank')" v-model="otherBank">
            </div>
            <!-- 提示 -->
            <div class="hint">
                <span>{{$t('wallet.BankAddress')}}</span>
            </div>
             <!-- 选择开户银行所在地 -->
            <div class="select jus-b" @click="popupVisible = true">
                <input type="text" :placeholder="$t('wallet.BankAdd')" v-model="bankCard.city">
                <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
            </div>
            <!-- 支行名称 -->
            <div class="input-name sub-branch">
                <input type="text" :placeholder="$t('wallet.BankName')" v-model="bankCard.branch">
            </div>
            <!-- 填写卡号 -->
            <div class="input-name sub-branch">
                <input type="text" :placeholder="$t('wallet.CardNum')" v-model="bankCard.address">
            </div>
            <!-- 再次输入卡号 -->
            <!-- <div class="input-name sub-branch">
                <input type="text" :placeholder="$t('wallet.AgainNum')" v-model="bankCard.address">
            </div> -->
        </div>
        <!-- 确认添加 -->
        <div class="sure">
             <mt-button  @click="sureAdd()" class="btn" :disabled="disabled">
                <span>{{$t('wallet.SureAdd')}}</span>
            </mt-button>
        </div>
         <!-- 开户行所在地选择 -->
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup">
            <mt-picker :slots="dataList" @change="onCityChange" class="pickers"></mt-picker>
        </mt-popup>
        <!-- 开户行选择 -->
         <mt-popup v-model="popupVisible1" position="bottom" class="mint-popup">
            <mt-picker :slots="bankList" @change="onBankChange" class="pickers"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
import pubHead from '@/common/head/head.vue'
import city from '@/common/json/city.json'
import bank from '@/common/json/bank.json'
export default {
    // 添加银行卡
    name:'AddBank',
    data(){
        return{
            popupVisible:false,
            popupVisible1:false,
            other:false,
            bankCard:{},//银行信息
            name:this.$store.state.truename,//用户名
            bank:'',//银行名字
            city:'',//城市地址
            otherBank:'',
            card:'',//卡号
            cardName:'',//支行名称
            disabled:false,//让button按钮失效
            // 获取银行名称
            bankList:[
                {
                    flex:1,
                    defaultIndex:1,
                    values:bank,
                    className:'slot1',
                    textAlign:'center'
                }                
            ],
            // 获取开户行地址
            dataList:[{
                flex:1,
                defaultIndex:1,
                values: Object.keys(city),
                className:'slot1',
                textAlign:'center'
                },
                {
                    divider:true,
                    content:'-',
                    className:'slot2'
                },
                {
                    flex:1,
                    values:[],
                    className:'slot3',
                    textAlign:'center'
                }
            ]
        }
    },
    mounted(){
        this.bankCard = this.$route.params
        console.log(this.bankCard)
        if (!this.bankCard.branch) this.bankCard.branch = this.bankCard.bank;
        // 当dom发生变化，更新后执行
        this.$nextTick(() =>{
            // this.bankList[0].defaultIndex = 0;
            console.log(this.$route.params);
            // this.dataList[0].defaultIndex = 0
        if(this.bankCard.city) {
            let sheng = this.bankCard.city.split(" ")[0];
            let shi = this.bankCard.city.split(" ")[1];
            let n = 0;
            for (var item in city){
                if (sheng == item){
                    this.dataList[0].defaultIndex = n;
                    break;
                }
                n++
            }
            n = 0;
            for (var item of city[sheng]){
                if (shi == item){
                    this.dataList[2].defaultIndex = n;
                    break;
                }
                n++
            }
            n = 0; 
            for (var item of bank){
                if (this.bankCard.bank == item){
                    this.bankList[0].defaultIndex = n
                    break;
                }
                n++
            }
        }
            // this.dataList[0].defaultIndex
        });
    },
    methods:{
        // 开户行地址
        onCityChange(picker, values){
            if(city[values[0]]){
                picker.setSlotValues(0, Object.keys(city));
                picker.setSlotValues(1, city[values[0]]);
                this.bankCard.city = values[0] + ' ' + values[1];
            }
        },
        // 开户行
        onBankChange(picker,values){
            picker.setSlotValues(0,bank);
            // 判断是否选择了其他银行，如果是，就显示另外一个输入框，提交当前输入框的银行名称
            if(values[0] == '其他'){
                this.bankCard.bank = values[0],
                this.other = true
            }else{
                this.bankCard.bank = values[0],
                this.other = false
            }
        },
        //确认添加
        sureAdd(){
            this.disabled = false;
            // this.bankCard.bank == '其他'?this.bankCard.bank = this.otherBank : this.bankCard.bank;
            // console.log(this.bankCard);
            if(!this.bankCard.bank || !this.bankCard.address){
                this.$toast(this.$t('wallet.FullInfo'))
            }else{
                this.disabled = true;
                this.$api.user.addBnakCard(this.bankCard).then((result) =>{
                    sessionStorage.banks = JSON.stringify(this.bankCard);
                    this.disabled = true;
                    this.$toast(this.$t('wallet.SubmitSuc'));
                    this.$router.go(-1);
                }).catch((error) =>{
                    if(error.data.message) this.$toast(this.$t('error.' + error.data.message))
                    if(error.message == 'PLEASE_VERIFY_YOUR_REALNAME'){
                        setTimeout(() => {
                            this.$router.push({path:'/user/certification'});
                        }, 2000);
                    }
                })
            }
        },
    },
    // 声明组件
    components :{
        pubHead,
    },
}
</script>

<style lang="less" scoped>
 /* 引用需要的的公共样式 */
    @import url('~@/style/mixin');
.addBank{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @pub-bg;
    z-index: 20;
    .addBank-txt{
        margin: .2rem;
        box-shadow: 0 0 1px 1px @bord-col;
        font-size: .28rem;
        border-radius: .1rem;
        &>div:first-child{
            border-top-left-radius:.1rem;
            border-top-right-radius:.1rem;  
        }
        &>div:last-child{
            border-bottom-left-radius: .1rem;
            border-bottom-right-radius: .1rem;
        }
        .icon-arrow-right-copy-copy-copy{
            color: #d2d2d2;
        }
        // 姓名
        .input-name{
            height: .88rem;
            // background: #979797;
            input{
                height: .87rem;
                width: 100%;
                padding-left: .24rem;
                background: #fff;
                &::placeholder{
                    color: #979797;
                    font-size: .28rem;
                }
            }
        }
        // 提示
        .hint{
            height: .88rem;
            background: @pub-bg;
            line-height: .88rem;
            padding-left: .24rem;
            color: #505050;
        }
        // 选择开户银行
        .select{
            height: .88rem;
            background: #fff;
            line-height: .88rem;
            padding-right: .24rem;
            input{
                width: 80%;
                padding-left: 0.24rem;
            }
        }
        // 支行名称
        .sub-branch{
            margin-top: 1px;
            margin-bottom: 1px;
        }
        
    }
    // 确认添加
    .sure{
        margin: .5rem .2rem;
        height: .88rem;
        border-radius: .1rem;
        text-align: center;
        line-height: .88rem;
        font-size:.32rem;
        .btn{
            width: 100%;
            background: @main-cor;
            color:#fff;
        }
    }
}
.mint-popup{
    width: 100%;
    height :25%;
}
.pickers{
    width: 100%;
	background: #FFFFFF;
	position: absolute;
	z-index: 13;
}

</style>
