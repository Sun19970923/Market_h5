<template >
  <!-- <view class="body"> -->
  <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
    @scrolltolower="loadNFTList" class="scroll-box">

    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{$t('collection.title')}} </block>
    </cu-custom>
    <view class="bg-box"
      :style=" imgUrl ? 'background: url('+$filters.fullImageUrl(imgUrl)+') no-repeat; background-size: cover;':'' ">
      <view class="head-portrait">
        <!-- <button class="replace-cover" size="mini" @click="chooseFile">{{$t('items.replaceCover')}}
        </button> -->
        <avatar class="u-info-avatar" :imageUrl="$filters.fullImageUrl(contract.cover)"
          :address="contract.address" :imgWidth="140" :imgHeight="140" shape="circular"></avatar>
      </view>
    </view>
    <view class="text-center mt-20">
      <view class="user-name" v-if="contract.name">{{contract.name}}</view>
      <view class="flex align-center justify-center">
        <view class="user-id">{{ showAddress }}</view>
        <view class="iconfont icon-copy" v-clipboard:copy="contract.address"
          v-clipboard:success="copySuccess" v-clipboard:error="copyError"></view>
      </view>
      <view class="marked-words" v-if="!contract.description">
        {{$t('account.introduction')}}
      </view>
      <view class="marked-words" v-else> {{ contract.description }} </view>
    </view>
    <view class="body-wrapper">
      <!-- <view class="title-box"></view>
      <view class="flex align-start">
        <view class="user-img">
          <avatar class="avatar-img" :imageUrl="$filters.fullImageUrl(contract.cover)"
            :address="contract.address" :imgWidth="140" :imgHeight="140">
          </avatar>
        </view>
        <view class="user-right">
          <view class="user-name" v-if="contract.name">{{contract.name}}</view>
          <view class="flex align-center">
            <view class="user-id">{{ showAddress }}</view>
            <view class="iconfont icon-copy" v-clipboard:copy="contract.address"
              v-clipboard:success="copySuccess" v-clipboard:error="copyError"></view>
          </view>
          <view class="marked-words" v-if="!contract.description">
            {{$t('account.introduction')}}
          </view>
          <view class="marked-words" v-else> {{ contract.description }} </view>
        </view>
      </view> -->
      <scroll-view scroll-x class="nav mb-24" scroll-with-animation :scroll-left="scrollLeft">
        <view class="cu-item" :class="tab==item.name?'text-black cur':''"
          v-for="(item,index) in tabs" :key="index" @tap="tabSelect" :data-id="item.name">
          {{item.title}}
        </view>
      </scroll-view>
      <view class="clear-both"></view>

      <view v-for="(item,index) in tabs" :key="index">
        <view v-if="tab==item.name" class="flex flex-wrap justify-between">
          <view class="nft">
            <nft-item v-for="(nft, i) in nftList[tab]" :nft="nft" :index="i" 
              :isItem="false" @showDialog="showDialog" @onLike="onLike" :key="i">
            </nft-item>
          </view>
          <load-status :loadStatus="loadStatus"></load-status>
        </view>
      </view>
      <sale-dialog ref="sale" :show="showSaleDialog"  @close="closeDialog"
        @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
      </sale-dialog>
      <cancel-sale-dialog ref="cancel_sale" :show="showCancelSaleDialog" @close="closeDialog"
        @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
      </cancel-sale-dialog>
      <buy-dialog ref="buy" :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </buy-dialog>
      <bid-dialog ref="bid" :show="showBidDialog"  @close="closeDialog"
        @confirm="dialogConfirm" :bid="dialogOrder" :myAsset="dialogMyAsset" :nft="dialogNft">
      </bid-dialog>
      <cancel-bid-dialog ref="cancel_bid" :show="showCancelBidDialog" @close="closeDialog"
        @confirm="dialogConfirm" :bid="dialogOrder" :nft="dialogNft">
      </cancel-bid-dialog>
      <accept-dialog :show="showAcceptDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </accept-dialog>
      <transfer-dialog ref="transfer" :show="showTransferDialog" @close="closeDialog"
        @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
      </transfer-dialog>
      <burn-dialog ref="burn" :show="showBurnDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </burn-dialog>
    </view>
  </scroll-view>
  <!-- </view> -->
</template>

<script>
import NftDialog from "@/mixins/NftDialog";
import { getLocalStorage } from "@/util/local-storage.js";
import NftTabItem from "@/mixins/NftTabItem";
export default {
  mixins: [NftDialog, NftTabItem],
  components: {
  },
  data() {
    return {
      imgUrl: "",
      setNav: {
        bg: "#fff", //背景色
        color: "#000", //字体颜色
        isdisPlayNavTitle: true, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
        navTitle: this.$t("collection.title"), //导航标题
      },
      InputBottom: "",
      TabCur: 0,
      scrollLeft: 0,
      operationArr: ["编辑", "取消出售", "竞拍", "转让", "销毁"],
      operationIdex: 0,
      showOperation: false,
      // from pc
      isFollow: false,
      tab: "sale",
      tabs: [
        { name: "sale", title: this.$t("items.sale"), count: 0 },
        {
          name: "collectibles",
          title: this.$t("items.collectibles"),
          count: 0,
        },
      ],
      page: 1,
      limit: this.$store.state.pageLimit,
      showFollow: false,
      showFollowing: false,
      nftList: [],
      tradeList: [],
      stat: {},
      ftype: 1,
      loadStatus: "",
      address: "",
      contract: {},
      isRefresh: false,
    };
  },
  onPullDownRefresh() {
    this.isRefresh = true;
    this.page = 1;
    this.getList();
  },
  watch: {
    user() {
      this.init();
    },
  },
  async onShow(option) {
    // this.$store.dispatch("reload");
    this.init();
  },
  computed: {
    user() {
      var user = this.$store.state.user;
      return user;
    },
    showAddress() {
      // let address = this.address;
      // var showAddress =
      //   address.slice(0, 11) + "..." + address.slice(address.length - 4);
      // return showAddress;
      let address = this.contract.address;
      if (!address) return "";
      var showAddress =
        address.slice(0, 11) + "..." + address.slice(address.length - 4);
      return showAddress;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  methods: {
    reloadList() {
      this.page = 1;
      this.getList();
    },
    async init() {
      this.address = JSON.parse(this.$mp.query.data).address;
      if (this.$mp.query.tab) {
        this.tab = this.$mp.query.tab;
      }
      this.page = 1;
      await this.getContract();
      this.getList();
    },
    getContract() {
      let address = {
        caddress: this.address, //待获取合约信息
      };
      this.$api("contract.info", address).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.contract = res.data;
          this.imgUrl = res.data.bannerUrl;
        }
      });
    },
    copySuccess(e) {
      uni.showToast({
        title: this.$t("request.copySuccess"),
      });
    },
    copyError(e) {
      uni.showToast({
        title: "复制失败!",
        icon: "none",
      });
    },
    InputFocus(e) {
      this.InputBottom = e.detail.height;
    },
    InputBlur(e) {
      this.InputBottom = 0;
    },
    tabSelect(e) {
      this.tab = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      // uni.navigateTo({
      //   url: "/pages/collection?tab=" + this.tab + "&&data=" + this.$mp.query.data,
      // });
      this.page = 1;
      this.getList();
    },
    toOperation(index) {
      this.operationIdex = index;
    },
    loadNFTList() {
      if (this.loadStatus == "over") return;
      this.getList();
    },
    closeMespopup() {
      this.showFollow = false;
      this.showFollowing = false;
    },
    showFollownum() {
      let params = {
        address: this.user.coinbase,
      };
      this.$api("user.stat", params).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.stat = res.data;
          this.tabs[0].count = this.stat.saleCount;
          this.tabs[1].count = this.stat.collectionCount;
          this.tabs[2].count = this.stat.createCount;
          this.tabs[3].count = this.stat.likeCount;
        }
      });
    },
    getOnSale() {
      this.getContractItems("sale");
    },
    getCollectiable() {
      this.getContractItems("collectibles");
    },
    getContractItems(tab) {
      let isSell = tab == "sale" ? true : null;
      let address = {
        page: this.page,
        limit: this.limit,
        address: this.address,
        isSell: isSell,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("contract.listitems", address).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (address.page == 1) this.nftList[tab] = [];
          this.nftList[tab] = this.nftList[tab].concat(res.data.list);
          that.queryFunction(res.data.list, tab)
          that.queryBids(res.data.list, tab);
          that.page = address.page + 1;
          that.loadStatus =
            res.data.list.length < res.data.limit
              ? "over"
              : this.loadStatus;
        } else {
          that.$tools.message(res.errmsg);
        }
        if (this.isRefresh) {
          this.isRefresh = false;
          uni.stopPullDownRefresh();
        }
      });
    },
    getList() {
      switch (this.tab) {
        case "sale":
          this.getOnSale();
          break;
        case "collectibles":
          this.getCollectiable();
          break;
      }
    },
    //更换封面
    chooseFile() {
      let that = this;
      uni.chooseFile({
        count: 1,
        type: "image",
        extension: [".jpg", ".jpeg", ".png", ".gif", ".svg"],
        async success(res) {
          let result = null;
          result = await that.uploadStorage(res.tempFiles[0]);
          that.setBanner();
        },
      });
    },
    async uploadStorage(file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        var that = this;
        this.$api("storage.upload", formData).then(async function (res) {
          if (that.$tools.checkResponse(res)) {
            resolve(res.data);
          } else {
            resolve({
              error: res.errmsg,
            });
          }
        });
      });
    },
    setBanner(url) {
      let data = {
        url: url,
      };
      this.$api("user.setbanner", data).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.imgUrl = url;
        } else {
          this.$tools.message(res.errmsg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mt-10 {
  margin-top: 10rpx;
}
.mr-10 {
  margin-right: 20rpx;
}
.justify-center {
  justify-content: center;
}
.text-center {
  text-align: center;
}
.mt-20 {
  margin-top: 50rpx;
}
.replace-cover {
  height: 42rpx;
  line-height: 42rpx;
  border: 1rpx solid #000000;
  font-size: 14rpx;
  color: #333333;
  position: absolute;
  top: 120rpx;
  right: 28rpx;
  border-radius: 20rpx;
  background-color: transparent;
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.bg-box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200rpx;
  background: linear-gradient(-90deg, #e7d5cb, #e3c7c4, #82aabe);
}
.head-portrait {
  margin-top: 100rpx;
}

.body {
  min-height: 100%;
  background-color: #fff;
  padding: 0rpx 36rpx 100rpx 36rpx;
}
.user-right {
  flex: 1;
  position: relative;
  .edit-btn {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20rpx;
    border: $border;
  }
}

.title-box {
  font-size: 36rpx;
  font-weight: 500;
  color: #1b1b1b;
  text-align: center;
  margin-bottom: 28rpx;
}
.user-img {
  width: 144rpx;
  height: 144rpx;
  // background-color: pink;
  margin-right: 22rpx;
}
.user-name {
  font-size: 38rpx;
  font-weight: bold;
  color: #1b1b1b;
}
.user-id {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin: 10rpx 0rpx;
}
.copy-icon {
  width: 22rpx;
  height: 21rpx;
  background-color: pink;
  margin-left: 13rpx;
}
.marked-words {
  font-size: 26rpx;
  font-weight: 500;
  color: #999999;
}
.share-box {
  width: 50rpx;
  height: 50rpx;
  border: 1rpx solid #cccccc;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.focus-on {
  font-size: 26rpx;
  font-weight: bold;
  color: #333333;
  margin: 0rpx 10rpx 0rpx 56rpx;
}
.number-text {
  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
}
.mt-34 {
  margin-top: 34rpx;
}

.mr-49 {
  margin-right: 49rpx;
}
.filter-box {
  font-size: 14rpx;
  font-weight: 400;
  color: #1b1b1b;
  width: 86rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  border: 1rpx solid #eeeeee;
  border-radius: 10rpx;
  margin-top: 15rpx;
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
  position: relative;
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
.operation-icon {
  width: 12rpx;
  height: 12rpx;
  background-color: pink;
  margin-right: 20rpx;
}
.like-icon {
  width: 26rpx;
  height: 22rpx;
  background-color: pink;
}

.operation-box {
  position: absolute;
  bottom: 50rpx;
  right: 50rpx;
  width: 153rpx;
  background: #ffffff;
  border: 1rpx solid #cccccc;
  border-radius: 10rpx;
  padding: 25rpx 0rpx;
}
.operation-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #333333;
  text-align: center;
}
.choose-operation {
  color: #dd3b3b;
}
.icon-upload {
  font-size: 48rpx;
}
.nft{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.scroll-box {
  height: 100vh;
  background-color: #fff;
}
.u-info-introduction {
  color: $grayColor;
}
</style>
<style lang="scss">
.cu-load {
  width: 100%;
}
</style>
