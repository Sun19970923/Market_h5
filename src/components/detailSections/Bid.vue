<template>
<view class="tab-content-list">
  <view class="owner-bid-switch" v-if="connected && myBid">
    <switch class="switchClass" :checked="showMyBid" @change="switchChange"/>
    <view class="ml-20rpx" :class="showMyBid?'active':''">{{$t('details.myBid')}}</view>
  </view>

  <view v-for="(bid, index) in validBids" :key="index" class="info-item">
    <view @click="goAccount(bid.address)" class="avatar">
      <avatar  :imageUrl="$filters.fullImageUrl(bid.avatar)" :address="bid.address" :imgWidth="70" :imgHeight="70" shape="circular"></avatar>
    </view>
    <view class="info">
      <view class="flex justify-between">
        <template v-if="bid.type == 5">
          <view class="label" :class="{'expired': bid.expired}">{{$t('details.offered')}} <span class="bfont">{{ $tools.singlePrice(bid.sellValue, bid.buyerValue)}} {{ bid.payToken.symbol }}</span> {{$t('details.for')}} {{bid.buyerValue}} {{$t('details.editions')}}</view>
        </template>
        <template v-if="bid.type == 6">
          <view class="label" :class="{'expired': bid.expired}">{{$t('details.editOffered')}}<span class="bfont">{{ $tools.singlePrice(bid.sellValue, bid.buyerValue)}} {{ bid.payToken.symbol}}</span> {{$t('details.for')}} {{bid.buyerValue}} {{$t('details.editions')}}</view>
        </template>
        <template v-if="bid.type == 7">
          <view class="label" :class="{'expired': bid.expired}">{{$t('details.cancelOffered')}}<span class="bfont">{{ $tools.singlePrice(bid.sellValue, bid.buyerValue)}} {{ bid.payToken.symbol }}</span> {{$t('details.for')}} {{bid.buyerValue}} {{$t('details.editions')}}</view>
        </template>
        <template v-else-if="bid.type == 8">
          <view class="label" :class="{'expired': bid.expired}">{{$t('details.accept')}} <span class="bfont">{{$tools.singlePrice(bid.sellValue, bid.buyerValue)}} {{ bid.payToken.symbol }}</span> {{$t('details.for')}} {{bid.sells}} {{$t('details.editions')}}</view>
        </template>
        <view class="right" v-if="bid.active">
          <text v-if="bid.isOwner" @click.stop="cancelBid(bid)" plain type="success" class="nft-op cancel" >{{$t('details.cancel')}}</text>
          <text v-else-if="myAsset" @click.stop="acceptBid(bid)" plain type="success" class="nft-op cancel" >{{$t('details.accept')}}</text>
        </view>

      </view>
      <view class="name" @click="goAccount(bid.address)">
        <span class="text">
          <span class="c9">{{$t('details.by')}}</span>
          {{bid.nickname || $filters.ellipsisAddress(bid.address) }}
        </span>
        <span class="t">{{ $filters.timeFormat(bid.time) }}</span>
      </view>
      
    </view>
  </view>

</view>
</template>

<script>
export default {
  name: "Bid",
  props: {
    bids: {
      type: Array,
      default: []
    },
    myBid: {
      type: Object,
      default: ()=>{}
    },
    myAsset: {
      type: Object,
      default: ()=>{},
    },
  },
  data(){
    return {
      showMyBid: false,
    }
  },
  computed:{
    connected(){
      return this.$store.state.connected;
    },
    user(){
      return this.$store.state.user;
    },
    validBids(){
      let bids = this.analysisBid(this.bids);
      if(!this.showMyBid)  return bids;
      return bids.filter(function(bid){
        return bid.isOwner;
      });
    },
  },
  methods: {
    switchChange: function (e) {
      this.showMyBid = !this.showMyBid
    },
    goAccount(address){
      uni.navigateTo({
        url: "/pages/account?address=" + address
      });
    },
    analysisBid(bids){
      let _bids = [];
      for(var i = 0; i < bids.length; i++){
        let bid = bids[i];
        bid.payToken = this.$store.getters.payToken(bid.sellToken);
        if( (bid.type == this.$sdk.valueCommonType('BID')
            || bid.type == this.$sdk.valueCommonType('EDIT_BID') )
            && !bid.expired){
          bid.active = true;
        }
        if(this.connected &&
            bid.address.toLocaleLowerCase() == this.user.coinbase.toLocaleLowerCase() ){
          bid.isOwner = true;
        }
        _bids.push(bid)
      }
      return _bids;
    },
    cancelBid(bid){
      this.$emit("cancel", bid);
    },
    acceptBid(bid){
      this.$emit('accept', bid);
    },
  }
}
</script>

<style lang="scss" scoped>
.owner-bid-switch{
  padding-bottom: 20rpx;
  margin-bottom: 40rpx;
  border-bottom: $border;
  display: flex;
  align-items: center;
}
.cancelButton{
width:120rpx;
height:60rpx;
font-size:20rpx;
display: flex;
justify-content: center;
align-items: center;
}
.tab-content-list{
  width:100%;
  margin-bottom: 0;
}
.owner-bid-switch{
  .el-switch__label{
    &.is-active{
      color: $primaryColor;
    }
  }
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
    .right {
      // position: absolute;
      // right: 0;
      // top: -20rpx;
      white-space: nowrap;
    }
    .label {
      font-size: 28rpx;
      color: #999;
      font-weight: 400;
      margin-bottom: 10rpx;
      margin-right:10rpx;
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
.active{
  color:$primaryColor;
}
.ml-20rpx{
  margin-left:20rpx;
}
</style>
