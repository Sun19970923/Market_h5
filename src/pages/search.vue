<template>
  <view class="page-body">
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{$t('search.title')}} </block>
    </cu-custom>
    <view class="g-main f-flex">
      <view class="search-box flex align-center searchClass">
        <text class="cuIcon-search"></text>
        <input v-model='searchQuery.search' :adjust-position="false" type="text"
          :placeholder="$t('search.placeholder')" confirm-type="search" placeholder-class="placeholder-text"
          class="input-text" @keydown.enter="submit" />
      </view>
      <view class="m-title">{{$t('search.searchResult')}}</view>

      <view class="flex justify-center">
        <view class="tabClass" :class="sortIndex=='first'?'active':''" @click="handleClick('first')">nft</view>
        <view class="tabClass ml-40rpx" :class="sortIndex=='second'?'active':''" @click="handleClick('second')">
          {{$t('search.consumer')}}</view>
      </view>
      <view v-if="sortIndex=='first'" class="NFT">
        <template v-if="searchLoadStatus != 'loading' && !nftList.length">
          <no-content :tip="$t('search.noContent')"></no-content>
        </template>
        <template v-else>
          <view class="m-list">
            <view class="search">
              <nft-item v-for="(nft, i) in nftList" :nft="nft" :key="i" :index="i" @showDialog="showDialog"
                @onLike="onLike">
              </nft-item>
            </view>
            <load-status :loadStatus="searchLoadStatus"></load-status>
          </view>
        </template>
      </view>

      <view v-if="sortIndex=='second'" class="Consumer">
        <template v-if="searchLoadStatus != 'loading' && !accountList.length">
          <no-content :tip="$t('search.noContent')"></no-content>
        </template>
        <template v-else>
          <view class="m-list">
            <view v-for="(account, i) in accountList" :key='i' class="Consumer-list f-flex">
              <view @click="goUser(account.address)" class="Consumer-list-left f-flex">
                <avatar :imageUrl="$filters.fullImageUrl(account.avatar)" :address="account.address" :imgWidth="88"
                  :imgHeight="88">
                </avatar>
                <img src="@/static/images/search/icon_v@2x.png" class="image2" />
                <span class="name">{{account.nickname}}</span>
              </view>
              <view class="Consumer-list-right">
                {{$filters.ellipsisAddress(account.address)}}
              </view>
            </view>
            <load-status :loadStatus="searchLoadStatus"></load-status>
          </view>
        </template>
      </view>

      <sale-dialog :show="showSaleDialog"  @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </sale-dialog>
      <cancel-sale-dialog :show="showCancelSaleDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </cancel-sale-dialog>
      <buy-dialog :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm" :asset="dialogOrder"
        :nft="dialogNft">
      </buy-dialog>
      <bid-dialog :show="showBidDialog"  @close="closeDialog" @confirm="dialogConfirm"
        :bid="dialogOrder" :myAsset="dialogMyAsset" :nft="dialogNft">
      </bid-dialog>
      <cancel-bid-dialog :show="showCancelBidDialog" @close="closeDialog" @confirm="dialogConfirm" :bid="dialogOrder"
        :nft="dialogNft">
      </cancel-bid-dialog>
      <accept-dialog :show="showAcceptDialog" @close="closeDialog" @confirm="dialogConfirm" :bid="dialogOrder"
       :myAsset="dialogMyAsset" :nft="dialogNft">
      </accept-dialog>
      <transfer-dialog :show="showTransferDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </transfer-dialog>
      <burn-dialog :show="showBurnDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </burn-dialog>
    </view>
  </view>
</template>
<script>
import NftDialog from "@/mixins/NftDialog";
import NftItem from "@/mixins/NftItem";
export default {
  mixins: [NftDialog, NftItem],
  data: function () {
    return {
      name: "Search",
      nftList: [],
      accountList: [],
      searchQuery: {
        search: this.$route.query.keyword || "",
        page: 1,
        limit: this.$store.state.pageLimit,
      },
      searchLoadStatus: "",
      searchUrl: "home.search",
      sortIndex: "first",
    };
  },
  watch:{
    user(){
      this.searchQuery.page = 1;
    this.search();
    }
  },
  onLoad(options) {
    this.searchQuery.search = options.keyword;
  },
  onShow() {
    this.search();
  },
  mounted() {},
  onPullDownRefresh(){
    this.searchQuery.page = 1;
    this.search(true);
  },
  onReachBottom(){
    this.loadsearchList();
  },
  computed:{
    user: function () {
      var user = this.$store.state.user;
      return user;
    },
  },
  methods: {
    reloadList() {
      this.searchQuery.page = 1;
      this.search();
    },
    submit(){
      this.searchQuery.page = 1;
      this.search();
    },
    goUser(address) {
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
    handleClick(tab) {
      this.sortIndex = tab;
      this.searchQuery.page = 1;
      this.search();
    },
    loadsearchList() {
      if (this.searchLoadStatus == "over") return;
      this.search();
    },
    search(isRefresh){
      if (this.searchLoadStatus == "loading") return;
      let data = {
        ...this.searchQuery,
      }
      this.searchLoadStatus = "loading";
      if(this.sortIndex == 'second'){
        this.getAccounts(data, isRefresh);
      }else{
        this.getNFTs(data, isRefresh);
      }
    },
    getNFTs(data, isRefresh){
      this.$api("home.search", data).then((res) => {
        this.searchLoadStatus = "";
        if(this.$tools.checkResponse(res)){
          if(data.page == 1) this.nftList = [];
          this.nftList = this.nftList.concat(res.data.list);
          this.queryFunction(res.data.list);
          if(res.data.list.length < data.limit){
            this.searchLoadStatus = "over";
          }else{
            this.searchQuery.page += 1;
          }
        }else{
          this.$tools.message(res.errmsg);
        }
        if(isRefresh){
          uni.stopPullDownRefresh();
        }
      });
    },
    getAccounts(data, isRefresh){
      this.$api("home.searchuser", data).then((res) => {
        if(this.$tools.checkResponse(res)){
          if(data.page == 1) this.accountList = [];
          this.accountList = this.accountList.concat(res.data.list);
          if(res.data.list.length < data.limit){
            this.searchLoadStatus = "over";
          }else{
            this.searchQuery.page += 1;
          }
        }else{
          this.$tools.message(res.errmsg);
        }
        if(isRefresh){
          uni.stopPullDownRefresh();
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.f-flex {
  display: flex;
}
.page-body{
  min-height: 100%;
  background: #fff;
}
.g-main {
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  background-color: #242736;
  padding: 20rpx 20rpx 60rpx;
}
.m-title {
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: $grayColor;
}
.m-list {
  margin-top: 28rpx;
  width: 100%;
}
.m-none {
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 122rpx;
  margin-bottom: 182rpx;
}
.new-search-list {
  margin: 0 -10rpx;
}
.m-none-text {
  margin-top: 23rpx;
  font-size: 17rpx;
  font-family: Montserrat-Regular;
  font-weight: 400;
  color: #1b1b1b;
  line-height: 8rpx;
}
.Consumer {
  width: 100%;
  // height: 423rpx;
  margin-top: 30rpx;
  margin-bottom: 39rpx;
  // overflow-y: auto;
}
.Consumer-list {
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eeeeee;
  margin-bottom: 30rpx;
}

.Consumer-list-left {
  cursor: pointer;
  align-items: center;
  .image2 {
    align-self: flex-end;
    margin-left: -13rpx;
    width: 13rpx;
    height: 13rpx;
  }
  .name {
    margin-left: 9rpx;
    font-size: 13rpx;
    font-weight: bold;
    color: #1b1b1b;
  }
}
.Consumer-list-right {
  font-size: 8rpx;
  font-family: Montserrat-Regular;
  font-weight: 400;
  color: #999999;
}
.NFT {
  width: 100%;
}
.image1 {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  z-index: -1;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.category-tags {
  background: #f4f4f4;
  border-radius: 5rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
}
.category-tags-item {
  background: none;
  border: none;
  color: #999;
  font-weight: bold;
  padding: 2rpx 6rpx;
  height: auto;
  margin: 0 10rpx;
  border-radius: 0;
  cursor: pointer;
  &.active {
    font-size: 8rpx;
    font-family: Montserrat-Regular;
    color: #1b1b1b;
    opacity: 1 !important;
    border-bottom: 2rpx solid $primaryColor;
  }
}
.search-section {
  margin-bottom: 19rpx;
  display: flex;
  align-items: center;
  margin-top: 27rpx;
  justify-content: space-between;
}
.search-sorts {
  display: flex;
  align-items: center;
  line-height: 18rpx;
  transform: translateX(-10rpx);
}
.search-sorts-item {
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 8rpx;
  font-family: Montserrat-regular;
  font-weight: 400;
  cursor: pointer;
  margin-right: 16rpx;
  .iconfont {
    font-size: 16rpx;
    font-weight: bold;
    &.active {
      color: $primaryColor;
    }
  }
  &.active {
    color: $primaryColor;
    .iconfont {
      color: $primaryColor;
    }
  }
}
.filter-btn {
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1rpx solid #eeeeee;
  border-radius: 6rpx;
  padding: 12rpx 8rpx;
  font-size: 8rpx;
  font-weight: 400;
  color: #1b1b1b;
  line-height: 7rpx;
  img {
    margin-right: 5rpx;
  }
}
.filter-popover {
  transform: translateX(-37rpx);
}
.popover-filters {
  padding: 10rpx 9rpx 13rpx 10rpx;
  box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(153, 153, 153, 0.3);
  border-radius: 8rpx;
  font-size: 14rpx;
  font-weight: 400;
  color: #444444;
  line-height: 12rpx;
  width: 160rpx;
  background: #ffffff;
  border: 1rpx solid #eeeeee;
  border-radius: 5rpx;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.popover-filters-item {
  cursor: pointer;
  margin-left: 8rpx;
  margin-bottom: 8rpx;
  background: #f4f4f4;
  border-radius: 5rpx;
  padding: 6rpx 8rpx 6rpx 7rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    color: white !important;
    background: #00c657 !important;
  }
}
.search {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.loading-status {
  padding-bottom: 50rpx;
}
.search-loading {
  height: 60rpx;
}
.search-loading-over {
  text-align: center;
  padding: 30rpx 0;
  color: $grayColor;
}
.scroll-box {
  height: 100vh;
  background-color: #fff;
}
.tabClass {
  font-size: 40rpx;
  &.active {
    color: $primaryColor;
    border-bottom: 2rpx solid $primaryColor;
  }
}
.ml-40rpx {
  margin-left: 40rpx;
}
.search-box {
  font-size: 32rpx;
  width: 100%;
  border: 1px solid grey;
  padding: 10rpx;
  border-radius: 10rpx;
  background-color: #242736 !important;
}
input{
  color: rgba(255, 255, 255, 0.8) !important;
}
.input-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #000;
  width: 100%;
}
.searchClass {
  margin-top: 30rpx;
  width: 100%;
  border: $border;
  border-radius: 60rpx;
  padding: 24rpx 30rpx;
  color: #606266;
  background: #fff;
  border: 1rpx solid #e4e7ed;
}
.cuIcon-search{
  color: $grayColor;
}
</style>
