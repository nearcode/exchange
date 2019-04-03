<template>
  <!-- 添加我们 -->
  <div class="addOur">
    <!-- 头部 -->
    <pubHead
      :title="$t('personage.AddOur')"
      :isbackShow='true'
      :leftColor="$config.color.titleCor"
      :bgColor="$config.color.mainCor"
      :titleColor="$config.color.titleCor"
    >
    </pubHead>
    <!-- 客服号码 -->
    <div class="service-num">

      <div
        class="service-one jus-b ali-c"
        v-for="(value, key) in $config.kefus"
        :key="key"
      >
        <div class="service-name">
          <span class="iconfont icon-weixin"></span>
          <span style=" padding-right: .2rem;">{{$t(key)}}</span>
        </div>
        <div class="service-number">
          <div class="sever-one">
            <div
              class="flex ali-c"
              v-for="(item, index) in value"
              :key="index"
            >
              <span>{{$t('personage.Service')}}{{index+1}}</span>
              <span>{{item}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// 引入头部组件
import pubHead from "@/common/head/head.vue";
export default {
  // 添加我们
  name: "AddOur",
  mounted() {
    //   console.log(this.$config.kefus)
  },
  // 声明组件
  components: {
    pubHead
  }
};
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
@import url("~@/style/mixin");
.addOur {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: @pub-bg;
  z-index: 20;
  .service-num {
    margin: 0.46rem 0.2rem;
    .service-one {
      background: #fff;
      height: 1.2rem;
      border-radius: 0.1rem;
      box-shadow: 0 0 1px 1px @bord-col;
      margin-bottom: 0.2rem;
      .service-name {
        width: 32%;
        border-top-left-radius: 0.1rem;
        border-bottom-left-radius: 0.1rem;
        height: 1.2rem;
        line-height: 0.8rem;
        background: @main-cor;
        text-align: center;
        color: #fff;
        font-size: 0.28rem;
        display: table;
        .icon-weixin {
          font-size: 0.48rem;
          padding-left: 0.3rem;
        }
        span {
          vertical-align: middle;
          display: table-cell;
        }
      }
      .service-number {
        width: 68%;
        height: 1.2rem;
        text-align: center;
        font-size: 0.26rem;
        color: #4b4b4b;
        .sever-one {
          height: 100%;
          padding-left: 0.4rem;
          .flex {
            height: 50%;
            span {
              margin-left: 0.3rem;
            }
          }
        }
      }
    }
  }
}
</style>
