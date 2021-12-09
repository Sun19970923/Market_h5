<template>
  <view class="nft-item">
    <view class="inner">
      <view class="cover-padding">
        <view class="cover" @click="goDetail">
          <u-image class="cover-image" placeholder="loading"
            :src="$filters.fullImageUrl(nftURI.image)" fit="contain">
            <template v-slot:error>
              <img class="error-image" :src="require('@/static/images/util/non-existent.png')" />
            </template>
          </u-image>
          <div class="collection-btn" :class="nft.like ? 'active': ''" @tap.stop="clickLike()">
            <text class="right-item clubart-icon iconfont"
              :class="nft.like ?'icon-collection-fill': 'icon-collection'"></text>
          </div>
        </view>
      </view>
      <view class="descript">
        <view class="d">
          <view class="d-left d-top">
            <view @click="goUser(lowestAsset.address)" class="avatar">
              <avatar class="bflex cpointer" v-if="lowestAsset"
                :imageUrl="$filters.fullImageUrl(lowestAsset.avatar)" :address="lowestAsset.address"
                :imgWidth="32" :imgHeight="32" shape="circular"></avatar>
            </view>
            <text @click="goDetail" class="bfont cpointer">
              {{nftURI.name}}</text>
          </view>
        </view>
        <view class="d">
          <view class="d-left" v-if="ownerAsset">
            <template v-if="ownerAsset.onsell">
              <text class="price bfont">
              {{ ownerAsset.singlePrice }}
              {{ ownerAsset.payToken ? ownerAsset.payToken.symbol:''}}
              </text>
              <text class="stock"> {{ ownerAsset.sellQuantity}} of {{ownerAsset.quantity}} </text>
            </template>
            <template v-else>
              <text class="nosale bfont">{{$t('nftItem.nfs')}}</text>
              <text class="stock"> 0 of {{ ownerAsset.quantity}}</text>
            </template>
          </view>
          <view class="d-left" v-else-if="lowestAsset">
            <text class="price bfont">
              {{ lowestAsset.singlePrice}} {{ lowestAsset.payToken ? lowestAsset.payToken.symbol : "" }}
            </text>
            <text class="stock"> {{ lowestAsset.sellQuantity }} of {{ nft.nft.quantity}}</text>
          </view>
          <view class="d-left" v-else>
            <text class="nosale bfont">{{$t('nftItem.nfs')}}</text>
            <text class="stock"> 0 of {{ nft.nft.quantity}}</text>
          </view>
        </view>
        <view class="d">
          <view class="d-left" v-if="nft.itemList && nft.itemList.length">
            <text class="bid" @click="goDetail" v-if="highestBid">
              {{ highestBid.singlePrice}}{{highestBid.payToken?highestBid.payToken.symbol:""}}</text>
            <text class="bid" @click="goDetail" v-else-if="myAsset"> {{$t('nftItem.pab')}} </text>
            <text class="bid" @click="showDialog('bid')" v-else>{{$t('nftItem.pab')}}</text>
          </view>
          <view class="d-right">
            <view class="custom-popover">
              <text id="moreClick" @click="visible=!visible"
                class="bfont iconfont icon-ellipsis"></text>
              <view v-show="visible==true" class="menus">
                <template v-if="myAsset">
                  <view class="menu" v-if="lowestAsset && lowestAsset.address != myAsset.address" @click="showDialog('buy', lowestAsset)">
                    {{ $t('nftItem.buy') }}
                  </view>
                  <view v-if="!myAsset.onsell" class="menu" @click="showDialog('sale', myAsset)">{{$t('nftItem.sale')}}
                  </view>
                  <template v-else>
                    <view class="menu" @click="showDialog('edit_sale', myAsset)">
                      {{$t('nftItem.editSale')}}</view>
                    <view class="menu" @click="showDialog('cancel_sale', myAsset)">
                      {{$t('nftItem.cancleSale')}}</view>
                  </template>
                  <template v-if="myAsset.quantity != nft.nft.quantity">
                    <div class="menu" v-if="!myBid" @click="showDialog('bid')"> {{ $t('nftItem.bid') }}</div>
                    <template v-else>
                      <div class="menu" @click="showDialog('edit_bid', myBid)">{{ $t('nftItem.editBid') }}</div>
                      <div class="menu" @click="showDialog('cancel_bid', myBid)">{{ $t('nftItem.cancelBid') }}</div>
                    </template>
                  </template>
                  <view class="menu" @click="showDialog('transfer', myAsset)">{{$t('nftItem.transfer')}}</view>
                  <view class="menu" @click="showDialog('burn', myAsset)">{{$t('nftItem.burn')}}</view>
                </template>
                <template v-else>
                  <view class="menu" v-if="lowestAsset" @click="showDialog('buy', lowestAsset)">
                    {{$t('nftItem.buy')}}
                  </view>
                  <view class="menu" @click="showDialog('bid')" v-if="!myBid">
                    {{$t('nftItem.bid')}}</view>
                  <template v-else>
                    <view class="menu" @click="showDialog('edit_bid', myBid)">
                      {{$t('nftItem.editBid')}}</view>
                    <view class="menu" @click="showDialog('cancel_bid', myBid)">
                      {{$t('nftItem.cancelBid')}}</view>
                  </template>
                </template>

                <view class="menu" @click="showDialog('opensea')"  v-if="openseaUrl">
                  {{$t('nftItem.viewOpensea')}}</view>

              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import BigNumber from "bignumber.js";
import MixinsNFTInfo from '@/mixins/NftInfo';
export default {
  name: "NFTItem",
  mixins: [ MixinsNFTInfo ],
  props: {
    index: {
      type: [Number, String],
      default: "",
    },
    nft: {
      type: Object,
      default: () => {
        return {
          like:false,
          itemList:{},
          nft:{}
        }
      },
    },
    address:{
      type:String,
      default:'',
    },
  },
  data() {
    return {
      visible: false,
      timer: "",
      countDown: "00:00:00"
    };
  },
  created() {
    document.addEventListener("click", (e) => {
      if (e.target.id != "moreClick") {
        this.visible = false;
      }
    });
  },
  computed: {
    lowestAsset(){
      if(!this.nft.owners) return;
      let lowestAsset = this.getLowestAsset(this.nft.owners);
      return lowestAsset;
    },
    nowTime() {
        return new Date().getTime() / 1000
    },
    nftURI() {
      if (this.nft.nft.metadataContent) {
        return this.$tools.analysis(this.nft.nft.metadataContent);
      }
      if (this.nft.media) {
        return this.$tools.analysis(this.nft.media);
      }
      return "";
    },
    showData() {
      return this.countDown;
    },
    myAsset() {
      if(!this.nft.owners) return;
      if(!this.connected) return;
      let myAsset = this.getAddressAsset(this.nft.owners, this.user.coinbase);
      return myAsset;
    },
    ownerAsset(){
      if(!this.nft.owners){
        return;
      }
      if(!this.address){
        return;
      }
      let ownerAsset = this.getAddressAsset(this.nft.owners, this.address);
      return ownerAsset;
    },
    myBid() {
      if(!this.nft.bids) return;
      if (!this.connected) return;
      let myBid = this.getActiveAddressBid(this.nft.bids, this.user.coinbase);
      return myBid;
    },
    highestBid() {
      if(!this.nft.bids) return;
      let highestBid = this.getHighestBid(this.nft.bids);
      return highestBid;
    },
    openseaUrl(){
      return this.$store.state.openseaUrl;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    thumbnail(url) {
      if (url) {
        if (url.endsWith(".gif")) return url;
        return url + "!320x240";
      } else {
        return "";
      }
    },
    goUser(address) {
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
    clickLike() {
      let data = {
        address: this.nft.nft.address,
        tokenId: this.nft.nft.tokenId,
      };
      if (!this.nft.like) {
        this.$api("like.add", data).then((res) => {
          if (this.$tools.checkResponse(res)) {
            this.$emit("onLike", this.index, true);
            this.$forceUpdate();
          }
        });
      } else {
        this.$api("like.remove", data).then((res) => {
          if (this.$tools.checkResponse(res)) {
            this.$emit("onLike", this.index, false);
            this.$forceUpdate();
          }
        });
      }
    },
    showDialog(name, asset) {
      if(name == 'opensea'){
        let url = this.openseaUrl + nft.address + "/" + nft.tokenId;
        window.open(url, "_blank");
        return;
      }
      if (!this.$tools.needLogin(this.$route.path)) return;
      let nft = this.nft.nft;
      let order = asset;
      this.$emit("showDialog", name, nft, order, this.myAsset);
    },
    goDetail() {
      var ids = this.nft.nft.address + ":" + this.nft.nft.tokenId;
      uni.navigateTo({
        url: "/pages/token?ids=" + ids,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hot-tip {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 12rpx;
  border: 2rpx solid #3c4aff;
  padding: 10rpx;
  background-color: #fff;
}
.huomiao-icon {
  width:27rpx;
  height: 33rpx;
}
.data-text {
  font-weight: bold;
  margin: 0rpx 20rpx;
  width: 130rpx;
}
.x-text-8A8A8A {
  color: #8a8a8a;
}

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
  .collection-btn {
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
    &.active {
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
    width: 90%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
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
    max-width: 200rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 24rpx;
    font-family: Montserrat-Regular;
    font-weight: 400;
    color: #1d1e22;
    margin-right: 5rpx;
  }
  .font12 {
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
  .d-price {
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
  width: 100% !important;
  flex: 0 !important;
}

.more-menu-popover {
  .menu {
    cursor: pointer;
    padding: 8rpx 7rpx;
    margin: 20rpx 0;
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
.custom-popover {
  position: relative;
  display: flex;
  justify-content: center;
}
.menus {
  top: 40rpx;
  width: 200rpx;
  right: -40rpx;
  position: absolute;
  z-index: 999;
  border-radius: 8rpx;
  padding: 16rpx;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 20rpx;
  box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border: 1px solid #e4e7ed;
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
.nft-image-skeleton {
  width: 90%;
  height: 90%;
}
</style>
