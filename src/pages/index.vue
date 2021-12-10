<template>
  <page-loading>
    <block slot="page">
      <cu-custom opcity="1" :isBack="true" backStyle="none" :isFixed="true" :stopBack="true">
        <block slot="backText">
          <side-bar></side-bar>
          <!-- 消息 -->
          <uni-popup :type="'bottom'" ref="projectIntro" :maskClick="false">
            <view class="notes-box">
              <view class="flex align-center justify-between">
                <view class="notes-title">{{$t('notifyDialog.message')}}</view>
                <view @tap="toClose">
                  <img class="close-img" src="@/static/images/Popup/pop_shut.png" />
                </view>
              </view>
              <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
                @scrolltolower="loadNotifyList" class="scroll-box2">
                <!-- 无数据 -->
                <view v-if="list.length==0" class="nocontent-box">
                  <img class="nocontent-img" src="@/static/images/Popup/nocontent.png" />
                  <view class="nocontent-title">{{$t('notifyDialog.noMessage')}}</view>
                </view>
                <!-- 有数据 -->
                <notify-item v-for="(notify, i) in list" :key="i" :notify="notify" size="small"
                  @close="$emit('close')"></notify-item>
                <load-status :loadStatus="notifyLoadStatus"></load-status>
                <!-- 查看全部 -->
              </scroll-view>
              <view class="all-title" @tap="toMessage">{{$t('notifyDialog.seeAll')}}</view>
            </view>
          </uni-popup>
        </block>
        <block slot="right">
          <view class="flex align-center header-right">
            <view v-if="connected" class="notice-box" @tap="notes">
              <view class="iconfont icon-remind-fill"></view>
              <view v-if="message.unread" class="redTip">{{ message.unread }}</view>
            </view>
            <view v-if="connected" @click="disconnect" class="wallet-box active">
              {{ $filters.ellipsisAddress(user.coinbase, 4) }}</view>
            <view v-else @click="toConnect" class="wallet-box">{{$t('navigation.connectWallet')}}
            </view>
          </view>
        </block>
      </cu-custom>

      <uni-popup :type="'bottom'" ref="projectIntro" :maskClick="false">
        <view class="notes-box">
          <view class="flex align-center justify-between">
            <view class="notes-title">{{$t('notifyDialog.message')}}</view>
            <view @tap="toClose">
              <img class="close-img" src="@/static/images/Popup/pop_shut.png" />
            </view>
          </view>
          <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
            @scrolltolower="loadNotifyList" class="scroll-box2">
            <!-- 无数据 -->
            <view v-if="list.length==0" class="nocontent-box">
              <img class="nocontent-img" src="@/static/images/Popup/nocontent.png" />
              <view class="nocontent-title">{{$t('notifyDialog.noMessage')}}</view>
            </view>
            <!-- 有数据 -->
            <notify-item v-for="(notify, i) in list" :key="i" :notify="notify" size="small"
              @close="$emit('close')"></notify-item>
            <load-status v-if="list.length!=0" :loadStatus="notifyLoadStatus"></load-status>
            <!-- 查看全部 -->
          </scroll-view>
          <view class="all-title" @tap="toMessage">{{$t('notifyDialog.seeAll')}}</view>
        </view>
      </uni-popup>
      <view class="search-box flex align-center">
          <text class="cuIcon-search"></text>
          <input @focus="InputFocus" :adjust-position="false" type="text"
            :placeholder="$t('search.placeholder')" confirm-type="search"
            placeholder-class="placeholder-text" class="input-text" />
        </view>
        <view class="body-bg">
          <img class="logo" src="@/static/image/legend.png" />
          <div class="des">Born for the <span style="font-weight: bold; color: #fff;">Territory</span></div>
          <!-- <view class="content">{{$t('global.tip1')}}</view>
          <view class="content">{{$t('global.tip2')}}</view> -->
        </view>
      <view class="body-content">
        <view class="flex align-center float-right mb-24 mt-20">
          <view class="nft-sorts-item" :class="sortIndex == 'usdt_price' ? 'active' : ''"
            @click="seleteSort('usdt_price')">
            <view class="options">{{$t('hindex.price')}}</view>
            <view class="icon-box">
              <template v-if="sortIndex == 'usdt_price'">
                <img v-if="order=='desc'" class="sort-icon"
                  src="@/static/images/index/sort_desc.png" alt="">
                <img v-else class="sort-icon" src="@/static/images/index/sort_asc.png" alt="">
              </template>
              <img v-else class="sort-icon" src="@/static/images/index/no_sort.png" />
            </view>
          </view>
          <view class="nft-sorts-item" :class="sortIndex == 'update_time' ? 'active' : ''"
            @click="seleteSort('update_time')">
            <view class="options">{{$t('hindex.time')}}</view>
            <view class="icon-box">
              <template v-if="sortIndex == 'update_time'">
                <img v-if="order=='desc'" class="sort-icon"
                  src="@/static/images/index/sort_desc.png" alt="">
                <img v-else class="sort-icon" src="@/static/images/index/sort_asc.png" alt="">
              </template>
              <img class="sort-icon" v-else src="@/static/images/index/no_sort.png" />
            </view>
          </view>
          <my-filter :filters="filters" :filterId="filterId" @selectFilter="selectFilter">
          </my-filter>
        </view>
        <view class="clear-both"></view>
        <view class="flex flex-wrap justify-between nft">
          <view class="nft-inner">
            <nft-item v-for="(nft, i) in nftList" :nft="nft" :key="i" :index="i"
               @showDialog="showDialog" @onLike="onLike">
            </nft-item>
          </view>
          <load-status :loadStatus="loadStatus" @loadmore="getNFTList"></load-status>
        </view>

        <sale-dialog :show="showSaleDialog" @close="closeDialog"
          @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
        </sale-dialog>
        <cancel-sale-dialog :show="showCancelSaleDialog" @close="closeDialog"
          @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
        </cancel-sale-dialog>
        <buy-dialog :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm"
          :asset="dialogOrder" :nft="dialogNft">
        </buy-dialog>
        <bid-dialog :show="showBidDialog" @close="closeDialog"
          @confirm="dialogConfirm" :bid="dialogOrder" :myAsset="dialogMyAsset" :nft="dialogNft">
        </bid-dialog>
        <cancel-bid-dialog :show="showCancelBidDialog" @close="closeDialog" @confirm="dialogConfirm"
          :bid="dialogOrder" :nft="dialogNft">
        </cancel-bid-dialog>
        <accept-dialog :show="showAcceptDialog" @close="closeDialog" @confirm="dialogConfirm"
          :asset="dialogOrder" :nft="dialogNft">
        </accept-dialog>
        <transfer-dialog :show="showTransferDialog" @close="closeDialog" @confirm="dialogConfirm"
          :asset="dialogOrder" :nft="dialogNft">
        </transfer-dialog>
        <burn-dialog :show="showBurnDialog" @close="closeDialog" @confirm="dialogConfirm"
          :asset="dialogOrder" :nft="dialogNft">
        </burn-dialog>
      </view>
    </block>
  </page-loading>

</template>

<script>
import NftDialog from "@/mixins/NftDialog";
import NftItem from "@/mixins/NftItem";
import NotifyItem from "@/components/NotifyItem";
import LoadStatus from "@/components/LoadStatus";
import { getLocalStorage } from "@/util/local-storage.js";
export default {
  components: {
    LoadStatus,
    NotifyItem
  },
  mixins: [ NftDialog, NftItem],
  data() {
    return {
      showModal: false,
      dataArr: [],
      setNav: {
        bg: "#fff", //背景色
        color: "#fff", //字体颜色
        isdisPlayNavTitle: false, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
        navTitle: "", //导航标题
      },
      TabCur: 0,
      scrollLeft: 0,
      contracts: [],
      contractIndex: 0,
      sortIndex: "",
      filters: [],
      filterId: "",
      order: "",
      nftList: [],
      query: {
        page: 1,
        limit: this.$store.state.pageLimit,
      },
      list: [],
      query: {
        page: 1,
        limit: this.$store.state.pageLimit,
      },
      loadStatus: "",
      notifyLoadStatus: "",
      searchKey: "",
      searchHistory: [],
      hotList: [],
      swiperHeight: 0
    };
  },
  computed: {
    connected: function () {
      return this.$store.state.connected;
    },
    user: function () {
      return this.$store.state.user;
    },
    message: function () {
      return this.$store.state.message;
    },
    webLoading: function () {
      let webLoading = this.$store.state.webLoading;
      return webLoading;
    }
  },
  watch: {
    user() {
      this.query.page = 1;
      this.getNFTList(true);

      if (this.user.coinbase) {
        this.list = [];
        this.query.page = 1;
        this.notifyLoadStatus = "";
        this.getNotes();
      }
    },
    webLoading() {
      if (this.webLoading) {
        this.init();
      }
    },
  },
  mounted() {
  },
  async onShow() {
  },
  onPullDownRefresh() {
    this.init(true);
  },
  onReachBottom() {
    if (this.loadStatus == "over") return;
    this.getNFTList();
  },
  methods: {
    reloadList() {
      this.query.page = 1;
      this.getNFTList();
    },
    queryMessageMedia(nfts){
      let _nfts=[];
      for(let i=0;i<nfts.length;i++){
        let item=nfts[i];
          _nfts.push(item.content)
      }
      _nfts = this.$tools.serializeNfts2(_nfts);
      let data={
        info:_nfts,
        }
      if(data.info.length){
        this.$api('nft.getmedia',data).then((res)=>{
          if(this.$tools.checkResponse(res)){
           this.setMessageMedia(res.data);
          }
        })
      }
    },
    setMessageMedia(nfts){
      for(let i = 0; i < this.list.length; i++){
        let nft = this.list[i];
        for(let key in nfts){
          let item = key.split(":");
          if (nft.content.token == item[0] && nft.content.tokenId == item[1]) {
            this.list[i].media = nfts[key];
          }
        }
      }
      this.list = JSON.parse(JSON.stringify(this.list));
    },
    async searchClick() {
      let data = {
        keyword: this.searchKey,
      };
      uni.navigateTo({
        url: "/pages/search?data=" + encodeURIComponent(JSON.stringify(data)),
      });
    },
    notes() {
      this.getNotes();
      if (this.$store.state.connected) {
        this.$refs.projectIntro.open();
      }
    },
    toClose() {
      this.list = [];
      this.query.page = 1;
      this.notifyLoadStatus = "";
      this.$refs.projectIntro.close();
    },
    toMessage() {
      this.toClose();
      uni.navigateTo({
        url: "/pages/message",
      });
    },
    disconnect() {
      let locale = this.$i18n.locale;
      let that = this;
      uni.showModal({
        content: this.$t("global.disconnect"),
        confirmText: this.$t("global.confirm"),
        cancelText: this.$t("global.cancel"),
        confirmColor: this.$store.state.primaryColor,
        success: function (res) {
          if (res.confirm) {
            that.$store.dispatch("logout");
          }
        },
      });
    },
    toConnect() {
      this.$store.dispatch("connectAndSign");
    },
    getList() {
      var data = {
        hospitalId: 1,
      };
      this.$api("typeList", data).then((res) => {
        if (res.code === 200) {
          this.dataArr = res.data;
        }
        if (res.code === 500) {
          uni.showToast({
            title: this.$t("global.errConnect"),
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
    InputFocus(e) {
      uni.navigateTo({
        url: "/pages/search-pro",
      });
    },
    tabSelect(e) {
      this.TabCur = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
    },
    async init(param) {
      this.query.page = 1;
      await this.getContracts();
      this.getFilters();
      this.getNFTList(param);
    },
    getNotes() {
      let params = {
        ...this.query,
        isRead: 0,
        address: this.$store.state.user.coinbase,
      };
      this.$api("notice.list", params).then((res) => {
        if (this.$tools.checkResponse(res)) {
          if (params.page == 1) this.list = [];
          this.list = this.list.concat(res.data.list);
          this.queryMessageMedia(res.data.list)
          if (res.data.list.length < this.query.limit) {
            this.notifyLoadStatus = "over";
          } else {
            this.query.page += 1;
            this.notifyLoadStatus = "";
          }
        } else {
          this.$tools.message(res.errmsg);
        }
      });
    },
    selectFilter(filterId) {
      this.filterId = this.filterId == filterId ? "" : filterId;
      this.query.page = 1;
      this.getNFTList();
    },
    getContracts() {
      return new Promise((resolve, reject) => {
        this.$api("contract.list").then((res) => {
          if (this.$tools.checkResponse(res)) {
            let symbols = [];
            let contracts = [];
            contracts[0]={symboL:'All',name:'All'};
            for (var i = 1; i < res.data.length; i++) {
              let contract = res.data[i];
              if (!symbols.includes(contract.symbol)) {
                contracts.push(contract);
                symbols.push(contract.symbol);
              }
            }
            this.contracts = contracts;
          } else {
            this.$tools.message(res.errmsg);
          }
          resolve(res);
        });
      });
    },
    getFilters() {
      this.$api("category.list").then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.filters = res.data;
        }
      });
    },
    selectContract(index) {
      this.contractIndex = index;
      this.filterId = "";
      this.sortIndex = "";
      this.order = "";
      this.query.page = 1;
      this.getNFTList();
    },
    seleteSort(sort) {
      if (this.sortIndex == sort) {
        this.order = this.order == "asc" ? "desc" : "asc";
      } else {
        this.sortIndex = sort;
        this.order = "desc";
      }
      this.query.page = 1;
      this.getNFTList();
    },

    loadNFTList() {
      if (this.loadStatus == "over") return;
      this.getNFTList();
    },
    loadNotifyList() {
      if (this.notifyLoadStatus == "over") return;
      this.getNotes();
    },
    async getNFTList(isRefresh) {
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      let contract =this.contractIndex?this.contracts[this.contractIndex]:"";
      // let contract =this.contracts[this.contractIndex ? this.contractIndex : 0];
      let symbol = !contract ? "" : contract.symbol;
      var data = {
        page: this.query.page,
        limit: this.query.limit,
        symbol: symbol,
        cate: this.filterId,
        sort: this.sortIndex,
        order: this.order,
      };
      this.$api("home.list", data).then((res) => {
        if (this.$tools.checkResponse(res)) {
          if (data.page == 1) this.nftList = [];
          this.nftList = this.nftList.concat(res.data.list);
          for (var i = 0; i < 2; i++) {
            this.hotList.push(res.data.list[i]);
          }
          this.queryFunction(res.data.list);
          if (res.data.list.length < data.limit) {
            this.loadStatus = "over";
          } else {
            this.query.page += 1;
            this.loadStatus = "";
          }
        } else {
          this.$tools.message(res.errmsg);
        }
        if (isRefresh) {
          uni.stopPullDownRefresh();
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.rightArrow-icon {
  width: 18rpx;
  height: 18rpx;
  border-top: 4rpx solid #000;
  border-right: 4rpx solid #000;
  transform: rotate(45deg);
}
.head-box {
  align-items: flex-end;
  padding: 30rpx 0rpx;
}
.iconfont{
  color: rgba(255, 255, 255, 0.8);
}
.left-icon {
  width: 20rpx;
  height: 15rpx;
  margin-left: 10rpx;
}
.notes-box {
  z-index: 999;
  width: 100%;
  height: 1000rpx;
  background-color: #fff;
  padding: 30rpx;
}
.page-body {
  min-height: 100%;
  background: #fff;
}
.notes-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #000;
}
.close-img {
  width: 50rpx;
  height: 50rpx;
}
.nocontent-box {
  margin-top: 20%;
  text-align: center;
}
.nocontent-img {
  width: 50%;
}
.nocontent-title {
  color: #606266;
  font-size: 30rpx;
}
.all-title {
  color: $primaryColor;
  font-size: 30rpx;
  // margin-top: 20%;
}

.body-content {
  min-height: 100%;
  background-color: #242736;
  padding: 20rpx 20rpx 60rpx;
}
.head-box {
}
.clubArt-box {
  width: 182rpx;
  height: 35rpx;
}
.notice-box {
  width: 30rpx;
  height: 34rpx;
  // background-color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48rpx;
}
.wallet-box {
  font-size: 24rpx;
  font-weight: bold;
  color: $primaryColor;
  margin-left: 40rpx;
  margin-right: 40rpx;
  &.active {
    color: rgba(255, 255, 255, 0.8);
  }
}
.search-box {
  font-size: 32rpx;
  margin: 20rpx auto;
  // margin-left: 20rpx;
  width: 90%;
  padding: 10rpx;
  border-radius: 40rpx;
  position: relative;
  z-index: 1;
  // background-color: white;
  border: 1px solid rgba(36, 33, 39, 0.5);
  backdrop-filter: blur(20px);
}
.input-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #000;
  width: 100%;
}
.placeholder-text {
  font-size: 24rpx;
  font-weight: 500;
  color: rgba(36, 33, 39, 0.5);
}
.advertis {
  width: 100%;
  height: 244rpx;
  border-radius: 12rpx;
  margin-bottom: 53rpx;
}
.buy-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #888888;
}
.x-text-00C657 {
  color: $primaryColor;
}
.rank-text {
  font-size: 26rpx;
  font-weight: bold;
  color: #222222;
  margin-left: 16rpx;
}
.time-box {
  font-size: 18rpx;
  font-weight: 400;
  color: #131415;
  width: 76rpx;
  height: 44rpx;
  line-height: 44rpx;
  border: 1rpx solid #eeeeee;
  border-radius: 8rpx;
  text-align: center;
}
.head-portrait {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background-color: pink;
}
.user-box {
  width: 100%;
  overflow-x: auto;
  margin: 34rpx 0rpx 64rpx;
}
.nickname {
  width: 84rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #222222;
  text-align: center;
}
.number {
  width: 84rpx;
  font-size: 22rpx;
  font-weight: bold;
  color: #999999;
  text-align: center;
}
.mr-49 {
  margin-right: 49rpx;
}
.icon-box {
  width: 20rpx;
  // height: 13rpx;
  // background-color: pink;
  margin: 0rpx 30rpx 0rpx 12rpx;
  img{
    filter: invert(100%);
  }
}

.float-right {
  float: right;
}
.clear-both {
  clear: both;
}
.nft-box {
  width: 323rpx;
  border: 1rpx solid #eeeeee;
  box-shadow: 0rpx 0rpx 2rpx 0rpx rgba(153, 153, 153, 0.24);
  border-radius: 12rpx;
  padding-bottom: 26rpx;
}
.nft-img {
  width: 323rpx;
  height: 265rpx;
  border-radius: 12rpx;
  background-color: pink;
}
.m-18 {
  margin: 0rpx 18rpx;
}
.mt-20 {
  margin-top: 20rpx;
}
.mb-24 {
  margin-bottom: 24rpx;
}
.nft-icon {
  width: 17rpx;
  height: 21rpx;
  border-radius: 50%;
  background-color: pink;
}
.nft-name {
  font-size: 22rpx;
  font-weight: bold;
  color: #1d1e22;
  margin-left: 12rpx;
}
.nft-number {
  font-size: 22rpx;
  font-weight: 500;
  color: #1d1e22;
  opacity: 0.6;
}
.nft-price {
  font-size: 20rpx;
  font-weight: bold;
  color: $primaryColor;
}
.like-icon {
  width: 26rpx;
  height: 22rpx;
  background-color: pink;
}
.nft-sorts-item {
  white-space: nowrap;
  display: flex;
  font-size: 13rpx;
  align-items: center;
  font-weight: 400;
  cursor: pointer;
  margin-right: 16rpx;
  .text {
    display: flex;
  }
  .sort-icon {
    display: flex;
    height: 30rpx;
    // margin-left: 6rpx;
  }
  &.active {
    .options {
      // color: $primaryColor;
      color: rgba(255, 255, 255, 1);
    }
  }
  .options {
    font-size: 22rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
}
.nft{
  margin: 0 -5px;
  // filter: invert(100%);
}
.nft-inner {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.scroll-box {
  height: 100vh;
  background-color: #fff;
  padding: 36rpx 36rpx 100rpx 36rpx;
}

.scroll-box2 {
  height: 90%;
  background-color: #fff;
  padding: 36rpx 0;
}

.redTip {
  cursor: pointer;
  margin-left: -10px;
  margin-top: 0px;
  white-space: nowrap;
  background: #dd3b3b;
  border-radius: 10rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #ffffff;
  padding: 2rpx 6rpx;
}
.contract-nav {
  white-space: nowrap;
  padding-top: 20rpx;
}
.cu-item {
  display: inline-block;
  margin-right: 20rpx;
  padding: 6rpx 0;
  &.active {
    color: $primaryColor;
    border-bottom: 4rpx solid $primaryColor;
  }
}
.body-bg{
  width: 100%;
  background: url('../static/image/bg.jpg') no-repeat;
  background-size: 100% 100%;
  padding: 130rpx 20rpx 30rpx;
  margin-top: -100rpx;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .des{
    margin: 10px 0;  
    color: #fff;  
  }
  .logo {
    width: 64%;
  }
  .content {
    color: #3c4784;
    margin-top: 10rpx;
    font-weight: 600;
    font-size: 20rpx;
  }
}
</style>
