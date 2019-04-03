<template>
  <!-- 客服中心 -->
  <div class="callcenter">
    <!-- 头部 -->
    <pubHead
      :title="$t('personage.CustomerServiceCenter')"
      :bgColor="$config.color.mainCor"
      :titleColor="$config.color.titleCor"
      :isbackShow='true'
      :leftColor="$config.color.titleCor"
    >
    </pubHead>
    <div class="service">
      <!-- 在线客服 -->
      <div
        class="centers jus-b"
        v-if="$config.chatKey"
        @click="activate"
      >
        <div class="set-txt">
          <span class="iconfont icon-kefu1"></span>
          <span>{{$t('personage.OnlineService')}}</span>
        </div>
        <div class="arrows">
          <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
        </div>
      </div>
      <!-- 官方邮箱 -->
      <div
        class="centers jus-b"
        v-if="$config.email"
      >
        <div class="set-txt">
          <span class="iconfont icon-youxiang"></span>
          <span>{{$t('personage.OfficialMailbox')}}</span>
        </div>
        <div class="arrows">
          <span style="color:#919191;font-size:.2rem">{{$config.email}}</span>
          <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
        </div>
      </div>
      <!-- 添加我们 -->
      <div
        class="centers jus-b"
        @click="toAddOur()"
        v-if="$config.kefus"
      >
        <div class="set-txt">
          <span class="iconfont icon-weixin"></span>
          <span>{{$t('personage.AddOur')}}</span>
        </div>
        <div class="arrows">
          <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="slideInRight"
      leave-active-class="slideOutRight"
    >
      <router-view></router-view>
    </transition>
    <!-- 即时聊天通讯 -->
    <img
      id="ze-snippet"
      v-if="$config.chatKey"
      :src="'https://static.zdassets.com/ekr/snippet.js?key='+$config.chatKey"
    />
  </div>
</template>

<script>
// 引入头部组件
import pubHead from "@/common/head/head.vue";
export default {
  // 客服中心
  name: "SetOtp",
  data() {
    return {
      //   chatKey: this.$config.chatKey, //即时聊天key
      //   isContact: false, //是否显示在线客服
      //   email: this.$config.email, //邮箱
      //   isEmail: false //是否显示邮箱
      // addOur:this.$control.user.addOur,//添加我们
    };
  },
  // 声明组件
  components: {
    pubHead
  },
  mounted() {
    if (this.$config.chatKey) {
      this.loadV2Script();
    }
  },
  methods: {
    // 跳转到添加我们
    toAddOur() {
      this.$router.push("/user/callCenter/addOur");
    },
    loadV2Script(callback) {
      if (typeof $zopim === "function") {
        //如果已经加载就直接放回
        return Promise.resolve();
      } else {
        return new Promise(resolve => {
          var script = document.createElement("script");
          // script.src = "https://cdn.vaptcha.com/v2.js";
          script.src =
            "https://static.zdassets.com/ekr/snippet.js?key=" + window.chatKey;
          script.async = true;
          script.onload = script.onreadystatechange = function() {
            if (
              !this.readyState ||
              this.readyState == "loaded" ||
              this.readyState == "complete"
            ) {
              resolve();
              script.onload = script.onreadystatechange = null;
            }
          };
          document.getElementsByTagName("head")[0].appendChild(script);
        });
      }
    },
    activate() {
      this.$loading.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
      setTimeout(() => {
        this.$loading.close();
      }, 5000);
      zE(() => {
        // zE.hide();
        $zopim(() => {
          $zopim.livechat.setName(this.$store.state.username);
          if (this.$store.state.mobile) {
            $zopim.livechat.setPhone(this.$store.state.mobile);
          }
          if (this.$store.state.email) {
            $zopim.livechat.setEmail(this.$store.state.email);
          }
          // $zopim.livechat.window.hide();
          setTimeout(() => {
            $zopim.livechat.window.toggle();
            this.$loading.close();
          }, 1000);
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
/* 引用需要的的公共样式 */
@import url("~@/style/mixin");
.callcenter {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: @pub-bg;
  z-index: 15;
  .service {
    margin: 0.2rem;
    border-radius: 0.1rem;
    box-shadow: 1px 1px 1px 1px @bord-col;
    & > div:first-child {
      border-top-left-radius: 0.1rem;
      border-top-right-radius: 0.1rem;
    }
    & > div:last-child {
      border-bottom-left-radius: 0.1rem;
      border-bottom-right-radius: 0.1rem;
    }
    .centers {
      height: 0.88rem;
      line-height: 0.88rem;
      background: #fff;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      border-bottom: 1px solid @bord-col;
      font-size: 0.28rem;
      color: #4b4b4b;
      .set-txt {
        font-size: 0.28rem;
        color: #575757;
        .iconfont {
          font-size: 0.36rem;
          color: #4b4b4b;
        }
        .icon-weixin {
          font-size: 0.38rem;
        }
      }
    }
    .icon-arrow-right-copy-copy-copy {
      color: #d8d8d8;
      font-size: 0.28rem;
    }
  }
}
.slideInRight,
.slideOutRight {
  animation-duration: 300ms;
}
#ze-snippet {
  display: none;
}
</style>
<style>
.mint-indicator-wrapper {
  z-index: 999999999 !important;
}
/* 隐藏右下角图标 */
#ze-snippet {
  display: none !important;
}
#launcher {
  display: none !important;
}
#Embed {
  display: none !important;
}
.u-noPrint {
  display: none !important;
}
</style>

