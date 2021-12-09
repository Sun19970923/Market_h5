<template>
<u-skeleton class="nft-item"  v-if="loadStatus == 'loading'" 
    :animation="true" :loading="loadStatus == 'loading'"
  >
</u-skeleton>
</template>
<script>
export default {
  name: "NFTItemLoad",
  props: {
    loadStatus: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      limit: this.$store.state.pageLimit,
    };
  },
  created(){
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>

.d-right {
      font-size: 18rpx;
  .iconfont {
    font-size: 36rpx;
    margin-left: 5rpx;
    color: #aaa;
    cursor: pointer;
    &.active {
      color: $redColor;
    }
  }
}
.nft-item {
  width: 20%;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 0rpx solid rgba(4, 4, 5, 0.1);
  box-sizing: border-box;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
  .inner {
    position: relative;
    border: $border;
    border-radius: $borderRadius;
    // overflow: hidden;
    --coverWidth: 100%;
  }
  .like {
    position: absolute;
    z-index: 100;
    right: 5rpx;
    top: 5rpx;
    .iconfont {
      cursor: pointer;
      margin-right: 5rpx;
      margin-top: 6rpx;
      font-size: 18rpx;
      border-radius: 18rpx;
      color: #aaa;
      &.active {
        color: $redColor;
      }
    }
  }
  .cover-padding {
    position: relative;
    padding-bottom: calc(var(--coverWidth) / 1.33);
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: $borderRadius;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .collection-btn{
    width: 45rpx;
    height: 45rpx;
    text-align: center;
    line-height: 45rpx;
    position: absolute;
    right: 0;
    top: 0;
    background: #fff;
    border-bottom-left-radius: 10rpx;
    font-size: 30rpx;
    color: #666;
    &.active{
      color: #ffd200;
    }
  }
  .cover-image {
    // max-width: 100%;
    // max-height: 100%;
  }
  .avatar {
    margin-right: 6rpx;
  }
  .descript {
    padding: 6rpx;
  }
  .d {
    padding: 5rpx;
    display: flex;
  }
  .d-left {
    width:90%;
    display: flex;
    flex: 1;
    align-items: center;
  }
  .d-right {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
  }
  .bid {
    white-space: nowrap;
    color: $primaryColor;
    cursor: pointer;
    font-weight: 400;
    font-size: 24rpx;
  }
  .price {
    max-width:100rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 24rpx;
    font-family: Montserrat-Regular;
    font-weight: 400;
    color: #1d1e22;
    margin-right: 5rpx;
  }
  .font12{
    white-space: nowrap;
    font-size: 24rpx;
    font-family: Montserrat-Regular;
    font-weight: 400;
    color: #1d1e22;
  }
  .nosale {
    text-overflow: ellipsis;
    font-size: 12rpx;
    font-weight: 400;
    color: $grayColor;
  }
  .d-price{
    display: flex;
    width: 100%;
  }
  .stock {
    white-space: nowrap;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
    text-align: center;
  }
}
.bfont {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.d-top {
  width: 100%!important;
  flex: 0 !important;
}

.more-menu-popover {
  .menu {
    cursor: pointer;
    padding: 8rpx 7rpx;
    margin:20rpx 0;
    font-size: 13rpx;
    font-weight: normal;
    border-radius: $borderRadius;
    &:hover,
    &:active {
      background: #f0f0f0;
    }
  }
}

.sale-bid {
  display: flex;
  flex-direction: column;
  button {
    border: none;
    background: none;
    font-size: 14rpx;
    font-family: Montserrat-Regular;
    font-weight: 500;
    color: #1d1e22;
    line-height: 26rpx;
    cursor: pointer;
    &:hover {
      color: red;
      border-color: inherit;
      background-color: inherit;
    }
    &:focus {
      color: red;
      border-color: inherit;
      background-color: inherit;
    }
  }
}

@media screen and (max-width: 1320rpx) {
  .nft-item {
    width: 25%;
  }
}

@media screen and (max-width: 1040rpx) {
  .nft-item {
    width: 33.33%;
  }
}

@media screen and (max-width: 780rpx) {
  .nft-item {
    width: 50%;
  }
}
.custom-popover{
position: relative;
display: flex;
	justify-content: center;
}
.menus{
  top:40rpx;
  width:200rpx;
  right:-40rpx;
  position:absolute;
  z-index:999;
    border-radius: 8rpx;
    padding: 16rpx;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba(0,0,0,.1);
    background: #FFF;
    border: 1px solid #E4E7ED;
   .menu {
    cursor: pointer;
    padding: 8rpx 7rpx;
    font-size: 20rpx;
    font-weight: normal;
    border-radius: $borderRadius;
    &:hover,
    &:active {
      background: #f0f0f0;
    }
  }
}


</style>
