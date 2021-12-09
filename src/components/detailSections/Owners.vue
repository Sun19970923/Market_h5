<template>
<view class="tab-content-list">
  <view v-for="(owner, index) in owners" :key="index" class="info-item">
    <view class="avatar">
      <avatar @click="goAccount(owner.address)" shape="circular" :imageUrl="$filters.fullImageUrl(owner.avatar)" :address="owner.address" :imgWidth="70" :imgHeight="70"></avatar>
    </view>
    <view v-if="!owner.onsell" class="info">
      <view class="label">{{owner.quantity}} {{$t('details.text1')}}</view>
      <view @click="goAccount(owner.address)" class="name">
        <text class="text">
          {{owner.nickname || $filters.ellipsisAddress(owner.address) }}
        </text>
        <text class="t">{{owner.time}}</text>
      </view>
    </view>
    <view v-else class="info">
      <view class="label">
        <view class="label-left">
          <text>{{ getStockValue(owner) }} {{$t('details.text2')}} </text> <text class="bfont"> {{ $tools.singlePrice(owner.price, owner.sellValue) }} {{owner.payToken.symbol}} </text>
        </view>
        <text v-if="connected && user.coinbase == owner.address" class="nft-op cancel" @tap="cancel(owner)">{{$t('details.cancel')}}</text>
        <text v-else class="nft-op" @tap="buy(owner)">{{$t('details.buy')}}</text>
      </view>
      <view @click="goAccount(owner.address)" class="name">
        <text class="text" >
          {{ owner.nickname || $filters.ellipsisAddress( owner.address ) }}
        </text>
        <text class="t">{{ $filters.timeFormat(owner.createTime) }}</text>
      </view>
    </view>
  </view>
</view>
</template>
<script>
import { computed } from 'vue'

export default {
  name: "Owners",
  props: {
    owners: {
      type: Array,
      default: [],
    },
  },
  data(){
    return {}
  },
  computed:{
    user(){
      return this.$store.state.user;
    },
    connected(){
        return this.$store.state.connected;
    }
  },
  methods: {
    cancel(owner){
      this.$emit('cancel', owner);
    },
    getStockValue(owner){
      let stockValue = owner.sellValue - owner.completed;
      if(stockValue > owner.quantity) stockValue = owner.quantity;
      return stockValue;
    },
 
    buy(owner){
      this.$emit('buy', owner);
    },
    goAccount(address){
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.tab-content-list{
  width:100%;
  margin-bottom: 0rpx;
}
</style>
