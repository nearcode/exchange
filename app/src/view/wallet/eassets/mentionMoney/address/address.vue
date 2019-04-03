<template>
    <!-- 提现地址历史记录 -->
    <div class="address">
         <!-- 头部 -->
        <pubHead 
            title="历史地址记录" 
            :titleColor="$config.color.titleCor"
            :isbackShow = 'true'
            :leftColor="$config.color.titleCor"
            :bgColor="$config.color.mainCor">
        </pubHead>
        <!-- 地址 -->
        <scroll class="history">
            <!-- 地址列表 -->
            <div class="list">
                <div class="address-list" v-for="item in addressList">
                    <!-- 地址名称 -->
                    <div class="address-name">
                        <span>{{item.name}}</span>
                        <span>{{item.address}}</span>
                    </div>
                    <!-- 选择或者删除地址 -->
                    <div class="select">
                        <span @click="selectAddress(item.address)">选择</span>
                        <span>删除</span>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>
/*****************************************本页面暂不做任何操作******************************************/
<script>
// 引入头部组件
import pubHead from '@/common/head/head.vue';
//引入滚动组件
import Scroll from "@/common/scroll/scroll";

export default {
    // 提现地址历史记录
    name:'Address',
    data(){
        return{
            coin:this.$route.params.coin,//币种名称
            // 地址列表
            addressList:[]
        }
    },
    mounted(){
        console.log(this.coin)
        // 获取历史提现记录
        this.$api.user.getAddressHistory(this.coin).then(res =>{
            this.addressList = res
            console.log(res)
        })
        console.log(this.addressList)
    },
    methods:{
        // 选择地址
        selectAddress(name,address){
            var addressObj = {
                name:name,
                address:address
            }
            this.$emit('seAddress',addressObj);
            this.$router.push({
                name:'MentionMoney',
                params:{
                    coin:this.coin
                }
            })
        }
    },
    // 声明组件
    components :{
        pubHead,
        Scroll
    },
}
</script>

<style lang="less" scoped>
.address{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    overflow: hidden;
    background: #f3f3f3;
    .history{
        position: absolute;
        width: 100%;
        left: 0;
        top: 1rem;
        bottom: 0;
        .address-list{
            margin:.2rem;
            height: .88rem;
            background: #fff;
            border-radius: .1rem;
            .address-name{
                height: .44rem;
                line-height: .44rem;
                text-indent: .4rem;
            }
            .select{
                text-align: right;
                height: .4rem;
                line-height: .4rem;
                margin-right:.2rem ;
                span{
                    display: inline-block;
                    width: 1rem;
                    text-align: center;
                    background: #f3f3f3;
                    border-radius: .1rem;
                    color: #000;
                }
            }
        }
    }
}
</style>
