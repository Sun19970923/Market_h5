<template >
  <!-- <view class="body"> -->
  <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
    @scrolltolower="loadNFTList" class="scroll-box">
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{$t('account.title')}} </block>
    </cu-custom>
    <view class="bg-box"
      :style=" imgUrl ? 'background: url('+$filters.fullImageUrl(imgUrl)+') no-repeat; background-size: cover;':'' ">
      <view class="head-portrait">
        <button v-if="user.coinbase == address" class="replace-cover" size="mini"
          @click="chooseFile">{{$t('items.replaceCover')}}
        </button>
        <avatar class="u-info-avatar" :imageUrl="$filters.fullImageUrl(userinfo.avatar)"
          :address="userinfo.address" :imgWidth="140" :imgHeight="140" shape="circular"></avatar>
      </view>
    </view>
    <view class="text-center mt-20">
      <view class="user-name" v-if="user.nickname">{{userinfo.nickname}}</view>
      <view class="flex align-center justify-center">
        <view class="user-id">{{ $filters.ellipsisAddress(address) }}</view>
        <view class="iconfont icon-copy" v-clipboard:copy="address"
          v-clipboard:success="copySuccess" v-clipboard:error="copyError"></view>
      </view>
      <view class="marked-words" v-if="!userinfo.description">
        {{$t('account.introduction')}}</view>
      <view class="marked-words" v-else>
        {{ userinfo.description }}</view>
      <view class="flex align-center justify-center mt-10">
        <view @click="share" class="share-box">
          <view class="iconfont icon-upload"></view>
        </view>
        <view class="ml-20rpx" v-if="!isLogin || user.coinbase != address">
          <button class="currency-button follow-btn" size="mini" v-if="!isFollow"
            @click="addFollow()">{{$t('MesPopup.follow')}}</button>
          <button class="currency-button follow-btn" size="mini" v-else
            @click="deleteFollow()">{{$t('MesPopup.followed')}}</button>
        </view>
        <view class="flex align-center">
          <view @click="openFollowing"> <text class="focus-on ml-5">{{$t('items.following')}}</text>
            <text class="number-text">({{ stat.followingCount }})</text>
          </view>
          <view @click="openFollow"> <text class="focus-on">{{$t('items.followers')}}</text> <text
              class="number-text">({{ stat.followCount }})</text> </view>
        </view>
      </view>
    </view>
    <view class="body-wrapper">
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
            <nft-item v-for="(nft, i) in nftList[tab]" :nft="nft" :index="i" :isItem="tab!='liked'"
              @showDialog="showDialog" @onLike="onLike" :key="i" :address="address" >
            </nft-item>
          </view>
          <load-status :loadStatus="loadStatus" @loadmore="getList"></load-status>
        </view>
      </view>
      <share ref="share"></share>

      <mes-popup ref="following" @close="closeMespopup" ftype="following" :address="address"
        @showFollownum="showFollownum"></mes-popup>

      <mes-popup ref="follow" @close="closeMespopup" ftype="follow" :address="address"
        @showFollownum="showFollownum">
      </mes-popup>
      <sale-dialog :show="showSaleDialog" @close="closeDialog"
        @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
      </sale-dialog>
      <cancel-sale-dialog :show="showCancelSaleDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </cancel-sale-dialog>
      <buy-dialog :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </buy-dialog>
      <bid-dialog :show="showBidDialog"  @close="closeDialog" @confirm="dialogConfirm" :bid="dialogOrder" :myAsset="dialogMyAsset" :nft="dialogNft">
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
  </scroll-view>
  <!-- </view> -->
</template>

<script>
import NftDialog from "@/mixins/NftDialog";
import { getLocalStorage } from "@/util/local-storage.js";
import NftTabItem from "@/mixins/NftTabItem";
export default {
  mixins: [NftDialog,NftTabItem],
  components: {
  },
  data() {
    return {
      imgUrl: "",
      scrollLeft: 0,
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
        { name: "created", title: this.$t("items.created"), count: 0 },
        { name: "liked", title: this.$t("items.liked"), count: 0 },
      ],
      page: 1,
      limit: this.$store.state.pageLimit,
      nftList: {
        sale: [],
        collectibles: [],
        created: [],
        liked: []
      },
      showFollow: false,
      showFollowing: false,
      tradeList: [],
      stat: {},
      loadStatus: "",
      address: "",
      userinfo: {},
      isRefresh: false,
    };
  },
  onPullDownRefresh() {
    this.isRefresh = true;
    this.reloadList();
  },
  onLoad(options) {
    let tab = options.tab;
    if (tab) this.tab = tab;
    let address = options.address;
    if (!address) return;
    this.address = address;
  },
  onShow() {
    this.init();
  },
  watch: {
    user() {
      this.init();
    },
  },
  computed: {
    user() {
      var user = this.$store.state.user;
      return user;
    },
    isOwner() {
      if (this.isLogin && this.$store.state.user.coinbase == this.address)
        return true;
      return false;
    },
    connected(){
      return this.$store.state.connected;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  methods: {
    share() {
      if (!this.connected) {
        return this.$tools.messageConnect();
      }
      if (!this.isLogin) {
        return this.$store.dispatch("signLogin");
      }
      this.$refs.share.$refs.share.open();
    },
    addFollow() {
      let data = {
        address: this.address,
      };
      var that = this;
      this.$api("follow.add", data).then((res) => {
        if (that.$tools.checkResponse(res)) {
          that.isFollow = true;
          this.showFollownum();
        }
      });
    },
    deleteFollow() {
      let data = {
        address: this.address,
      };
      var that = this;
      this.$api("follow.delete", data).then((res) => {
        if (that.$tools.checkResponse(res)) {
          that.isFollow = false;
          this.showFollownum();
        }
      });
    },
    init() {
      // this.address = JSON.parse(this.$mp.query.data).address;
      this.getUserinfo();
      this.page = 1;
      if (this.isLogin) {
        this.matchFollow();
      }
      this.showFollownum();
      this.getList();
    },
    matchFollow() {
      let address = {
        address: this.user.coinbase,
        userAddrs: this.address,
      };
      var that = this;
      this.$api("follow.match", address).then((res) => {
        if (that.$tools.checkResponse(res)) {
          if (!res.data.length || res.data.length == 0) {
            that.isFollow = false;
          } else {
            that.isFollow = true;
          }
        }
      });
    },
    closeMespopup() {
      this.$refs.following.$refs.following.close();
      this.$refs.follow.$refs.follow.close();
    },
    openFollowing() {
      uni.navigateTo({
        url: "/pages/follow?tab=following&address=" + this.address,
      });
    },
    openFollow() {
      uni.navigateTo({
        url: "/pages/follow?tab=followers&address=" + this.address,
      });
    },
    getUserinfo() {
      let params = {
        address: this.address,
      };
      this.$api("user.info", params).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.userinfo = res.data;
          this.imgUrl = res.data.bannerUrl;
        } else {
          this.$tools.message(res.errmsg);
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
        title: "Copy fail!",
        icon: "none",
      });
    },
    tabSelect(e) {
      this.tab = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.page = 1;
      this.getList();
    },
    //from pc
    goHome() {
      this.$router.push("/");
    },
    loadNFTList() {
      if (this.loadStatus == "over") return;
      this.getList();
    },
    reloadList() {
      this.page = 1;
      this.getList();
    },
    onShare(type) {
      console.log("share", type);
    },
    onLike(index, like) {
      // this.nftList[this.tab][index].like = like;
      this.$set(this.nftList[this.tab][index], "like", like, false);
    },
    showFollownum() {
      let params = {
        address: this.address,
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
    getOnSale: function () {
      let params = {
        page: this.page,
        limit: this.limit,
        address: this.address,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("user.onsales", params).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (params.page == 1) this.nftList.sale = [];
          that.nftList.sale = that.nftList.sale.concat(res.data.list);
          that.queryFunction(res.data.list,"sale")
          that.page = params.page + 1;
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
    getCollectiable: function () {
      let params = {
        page: this.page,
        limit: this.limit,
        address: this.address,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("user.collections", params).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (params.page == 1) this.nftList.collectibles = [];
          that.nftList.collectibles = that.nftList.collectibles.concat(
            res.data.list
          );
          that.queryFunction(res.data.list,"collectibles")
          that.page = params.page + 1;
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
    getCreated: function () {
      let params = {
        address: this.address,
        page: this.page,
        limit: this.limit,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("user.created", params).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (params.page == 1) this.nftList.created = [];
          that.nftList.created = that.nftList.created.concat(res.data.list);
          that.queryFunction(res.data.list,"created")
          that.page = params.page + 1;
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
    getLiked: function () {
      let params = {
        page: this.page,
        limit: this.limit,
        address: this.address,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("user.like", params).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (params.page == 1) this.nftList.liked = [];
          that.nftList.liked = that.nftList.liked.concat(res.data.list);
          that.queryFunction(res.data.list,"liked")
          that.page = params.page + 1;
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
    getTrade: function () {
      let params = {
        address: this.address,
        page: this.page,
        limit: this.limit,
      };
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      var that = this;
      this.$api("user.trade", params).then((res) => {
        this.loadStatus = "loaded";
        if (that.$tools.checkResponse(res)) {
          if (params.page == 1) this.tradeList = [];
          that.tradeList = that.tradeList.concat(res.data.list);
          that.page = params.page + 1;
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
        case "created":
          this.getCreated();
          break;
        case "liked":
          this.getLiked();
          break;
        case "trade":
          this.getTrade();
          break;
      }
    },
    tabindexFunc: function (tab, event) {
      console.log(
        "tabindexFunctabindexFunctabindexFunctabindexFunctabindexFunctabindexFunc",
        tab,
        event
      );
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
          that.setBanner(result.url);
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
  margin-top: 20rpx;
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
.ml-20rpx {
  margin-left: 20rpx;
}
.flex-wrap {
  flex-wrap: wrap;
}
.ml-5 {
  margin-left: 15rpx;
}
</style>
<style lang="scss">
.cu-load {
  width: 100%;
}
</style>
