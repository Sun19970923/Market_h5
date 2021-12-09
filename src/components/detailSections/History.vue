<template>
<view class="tab-content-list">
  <view v-for="(his,index) in historys" :key="index" class="info-item">
    <view @click="goAccount(his.address)" class="avatar">
      <avatar  :imageUrl="$filters.fullImageUrl(his.avatar)" :address="his.address" :imgWidth="70" :imgHeight="70" shape="circular"></avatar>
    </view>
    <view class="info">
      <template v-if="his.type == 1">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.putOnSale')}}<span class="bfont">{{ $tools.singlePrice(his.buyerValue, his.sellValue) }} {{his.payToken.symbol}}</span></view>
      </template>
      <template v-else-if="his.type == 2">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.editSaleFor')}} <span class="bfont">{{$tools.singlePrice(his.buyerValue, his.sellValue)}} {{his.payToken.symbol}}</span></view>
      </template>
      <template v-else-if="his.type == 3">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.cancelSaleFor')}} <span class="bfont">{{$tools.singlePrice(his.buyerValue, his.sellValue)}} {{his.payToken.symbol}}</span></view>
      </template>
      <template v-else-if="his.type == 4">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.boughtFor')}}<span class="bfont">{{$tools.singlePrice(his.buyerValue, his.sellValue)}} {{his.payToken.symbol}}</span></view>
      </template>
      <template v-else-if="his.type == 5">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.offered')}}<span class="bfont">{{$tools.singlePrice(his.sellValue, his.buyerValue)}} {{his.payToken.symbol}}</span> {{$t('details.for')}} {{his.buyerValue}} {{$t('details.editions')}}</view>
      </template>
      <template v-else-if="his.type == 6">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.editOffered')}} <span class="bfont">{{$tools.singlePrice(his.sellValue, his.buyerValue)}} {{his.payToken.symbol}}</span> {{$t('details.for')}} {{his.buyerValue}} {{$t('details.editions')}}</view>
      </template>
      <template v-else-if="his.type == 7">
        <view class="label" :class="{'expired': his.expired}"> {{$t('details.cancelOffered')}} <span class="bfont">{{$tools.singlePrice(his.sellValue, his.buyerValue)}} {{his.payToken.symbol}}</span> {{$t('details.for')}} {{his.buyerValue}} {{$t('details.editions')}}</view>
      </template>
      <template v-else-if="his.type == 8">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.accept')}} <span class="bfont">{{$tools.singlePrice(his.sellValue, his.buyerValue)}} {{his.payToken.symbol}}</span> {{$t('details.for')}} {{his.sells}} {{$t('details.editions')}}</view>
      </template>
      <template v-else-if="his.type == 9">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.Mint')}}</view>
      </template>
      <template v-else-if="his.type == 14">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.Burn')}}</view>
      </template>
      <template v-else-if="his.type == 15">
        <view class="label" :class="{'expired': his.expired}">{{$t('details.Transfer')}}</view>
      </template>
      <view @click="goAccount(his.address)" class="name">
        <span class="text">
          <span class="c9">{{$t('details.by')}}</span>
            {{his.nickname || $filters.ellipsisAddress(his.address) }}
        </span>
        <span class="t">{{ $filters.timeFormat(his.time) }}</span>
      </view>
    </view>
  </view>

</view>
</template>

<script>
export default {
  name: "History",
  props: {
    historys: {
      type: Array,
      default: [],
    },
    sellValue: {
      type: Number,
      default: 1,
    },
  },
  data(){
    return {}
  },
  methods: {
    goAccount(address){
      uni.navigateTo({
        url: "/pages/account?address=" + address
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-content-list{
  width:100%;
  margin-bottom: 0;
}
.info-item {
  display: flex;
  padding-bottom: 40rpx;
  flex-direction: row;
  align-items: flex-start;
  .avatar {
    // width: 35px;
    // height: 35px;
    // border-radius: 50%;
    overflow: hidden;
    margin-right: 15rpx;
    cursor: pointer;
    .avatar-img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    position: relative;
    border-bottom: 1px solid #eee;
    flex: 1;
    padding-bottom: 20rpx;
    .ab-right {
      position: absolute;
      right: 0;
      top: -20rpx;
    }
    .label {
      font-size: 28rpx;
      color: #999;
      font-weight: 400;
      margin-bottom: 10rpx;
      line-height: 28rpx;
      &.expired {
        text-decoration: line-through;
      }
    }
    .c9 {
      color: #999 !important;
    }
    .name {
      font-size: 30rpx;
      margin-bottom: 10rpx;
      display: flex;
      cursor: pointer;
    }
    .bfont {
      line-height: 35rpx;
      color: #333;
    }
    .ml5 {
      margin-left: 10rpx;
    }
    .t {
      color: #999;
    }
    .bluec {
      color: $primaryColor;
    }
    .text {
      flex: 1;
    }
  }
}
</style>
