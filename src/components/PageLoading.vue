<template>
  <div class="page-body">
    <block v-if="webLoading">
      <slot  name="page"></slot>
    </block>
    <div class="web-loading" v-else>
      <u-loading size="60" color="#6800FF" mode="circle"></u-loading>
    </div>
  </div>
</template>
<script>
export default{
  name: "PageLoading",
  computed:{
    webLoading: function(){
      let webLoading = this.$store.state.webLoading;
      return webLoading;
    },
  },
}
</script>

<style lang="scss" scoped>

.web-loading{
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
