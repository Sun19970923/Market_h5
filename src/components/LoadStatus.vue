<template>
<view class="clubart-load-status">
  <view class="loading-status cu-load loading" v-if="loadStatus == 'loading'" ></view>
  <view class="loading-over" v-else-if="loadStatus == 'over'">{{$t('loadStatus.end')}}</view>
  <view class="loading-status cu-load " v-else > 
    <view class="load-more" @tap="loadMore">
      {{$t('loadStatus.loading')}}
    </view>
  </view>
</view>
</template>
<script>
export default {
  name: 'LoadStatus',
  props: {
    loadStatus: {
      type: String,
      default: "",
    }
  },
  data(){
    return {};
  },
  methods: {
    loadMore(){
      this.$emit("loadmore");
    }
  },
}
</script>

<style lang="scss" scoped>
.clubart-load-status{
  padding: 10px 0;
  width: 100%;
  color: $primaryColor;
  .loading-status{
    height: 60px;
  }
  .loading-over{
    text-align: center;
    padding: 30px 0;
    color: $grayColor;
  }
}

.load-more{
  border: $border; 
  border-radius: 20rpx;
}
.cu-load.loading::after{
  content:''!important;
}
</style>
