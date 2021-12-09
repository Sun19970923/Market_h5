<template>
  <view class="tab-content-list">
    <view class="info-item" v-if="creator && creator.address">
      <view @click="goUser(creator.address)" class="avatar">
        <avatar shape="circular" :imageUrl="$filters.fullImageUrl(creator.avatar)" :address="creator.address" :imgWidth="70" :imgHeight="70"></avatar>
      </view>
      <view class="info">
        <view class="label">{{$t('details.creator')}}</view>
        <view @click="goUser(creator.address)" class="name" v-if="creator.nickname">{{ creator.nickname }}</view>
        <view @click="goUser(creator.address)" class="name" v-else>{{ ellipsisAddress(creator.address) }}</view>
      </view>
    </view>
    <view class="info-item" v-if="info.contract && info.contract.address">
      <view @click="goContract(info.contract.address)"  class="avatar">
        <avatar shape="circular" :imageUrl="$filters.fullImageUrl(info.contract.cover)" :address="info.contract.address" :imgWidth="70" :imgHeight="70"></avatar>
      </view>
      <view class="info">
        <view class="label">{{$t('details.collection')}}</view>
        <view @click="goContract(info.contract.address)" class="name" v-if="info.contract">{{info.contract.name || $filters.ellipsisAddress(info.contract.address)}}</view>
      </view>
    </view>
    <view class="propertys">
      <view v-for="(item, index) in properties" :key="index" class="property-item">
        <view class="lalbel">{{item?item.key:''}}</view>
        <view class="name">{{item?item.value:''}}</view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  name: "Info",
  props: {
    info: {
      type: Object,
      default: {},
    },
    creator: {
      type: Object,
      default: {},
    },
  },
  data: function () {
    return {};
  },
  computed: {
    address() {
      if(!this.info.creator) {
        return ""
      }
      if(this.info.nickname){
      }
      if(this.info.address) {
        return this.info.address.slice(0, 11) + "..." + this.info.address.slice(-4)
      }
    },
    properties() {
      if(this.info.properties) {
        return JSON.parse(this.info.properties);
      } else {
        return [];
      }
    },
  },
  methods: {
    ellipsisAddress(address){
      return address.slice(0, 11) + "..." + address.slice(-4)
    },
    goUser(address) {
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });

    },
    goContract(address){
      let data={
        address:address
      }
      uni.navigateTo({
        url: "/pages/collection?data=" + encodeURIComponent(JSON.stringify(data)),
      });
    }
  },
};
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
