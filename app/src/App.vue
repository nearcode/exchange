<template>
  <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>

      <!-- <router-view v-if=""></router-view> -->

      <router-view v-if="isRouterAlive && !$route.meta.keepAlive"></router-view>

      <foot></foot>
      
  </div>
</template>

<script>
import foot from '@/common/footer/footer.vue';
// import func from './vue-temp/vue-editor-bridge';
export default {
  name: 'App',
  provide() {
    return {
      reload:this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted(){
      this.$store.commit('getInfos',this);
      this.$store.commit('getTickers', this);
  },
  components: {
      foot
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(()=>{
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
  /* 引用需要的的公共样式 */
 


</style>