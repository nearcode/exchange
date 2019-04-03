<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    },
    /**
     * 如果启用loading交互，传递loading的状态
     * isShow: false
     * showIcon: false,    // 是否显示loading的icon
     * status: ''  // '正在加载...', '刷新成功', '刷新失败', ''
     */
    loadingStatus: {
      type: Object,
      default: function() {
        return {
          showIcon: false,
          status: ""
        };
      }
    },
    /**
     * 是否启用下拉刷新的交互
     */
    pulldownUI: {
      type: Boolean,
      default: false
    },
    /**
     * 是否启用上拉加载的交互
     */
    pullupUI: {
      type: Boolean,
      default: false
    },
    scrollToEndFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingConnecting: false,
      pulldownTip: {
        text: "下拉刷新", // 松开立即刷新
        rotate: "" // icon-rotate
      }
    };
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll();
      // 实现数据加载完默认滚动到底部
      if (this.scrollToEndFlag) {
        this.scrollTo(0, this.scroll.maxScrollY);
      }
    }, 20);
  },
  updated() {
    // 实现数据加载完默认滚动到底部
    setTimeout(() => {
      if (this.scrollToEndFlag) {
        this.scrollTo(0, this.scroll.maxScrollY);
      }
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX
      });

      // 是否派发滚动事件
      if (this.listenScroll || this.pulldown || this.pullup) {
        let me = this;
        this.scroll.on("scroll", pos => {
          if (this.listenScroll) {
            me.$emit("scroll", pos);
          }

          if (this.pulldown) {
            // 下拉动作
            if (pos.y > 50) {
              this.pulldownTip = {
                text: "松开立即刷新",
                rotate: "icon-rotate"
              };
            } else {
              this.pulldownTip = {
                text: "下拉刷新", // 松开立即刷新
                rotate: "" // icon-rotate
              };
            }
          }

          if (this.pullup) {
          }
        });
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          console.log("scrollEnd");
          console.log(this.scroll);
          // 滚动到底部
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd");
          }
        });
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on("touchend", pos => {
          // 下拉动作
          if (pos.y > 50) {
            setTimeout(() => {
              // 重置提示信息
              this.pulldownTip = {
                text: "下拉刷新", // 松开立即刷新
                rotate: "" // icon-rotate
              };
            }, 600);
            this.$emit("pulldown");
          }
        });
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    disable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
