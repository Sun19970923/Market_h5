<template>
  <view class="clubart-no-content">
    <view class="no-content-image">
      <img src="@/static/images/search/nocontent.png" alt="">
    </view>
    <view class="no-content-tip" v-if="tip"> {{tip}} </view>
  </view>
</template>

<script>
export default {
  name: 'NoEmpty',
  props: {
    tip: {
      type: String,
      default: "",
    }
  },
}
</script>

<style lang="scss" scoped>
.clubart-no-content{
  padding: 50px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  .no-content-image{
    width: 100px;
    display: flex;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .no-content-tip{
    padding-top: 10px;
    color: rgba(255, 255, 255, 1);
  }
}

</style>
