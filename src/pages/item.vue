<template >
  <!-- <view class="body"> -->
  <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
    @scrolltolower="loadNFTList" class="scroll-box">
    <cu-custom opcity="1" :isBack="true" backStyle="none" :isFixed="true" :stopBack="true">
      <block slot="backText">
        <side-bar></side-bar>
      </block>
      <block slot="content"> {{$t('items.title')}} </block>
    </cu-custom>
    <view class="bg-box"
      :style=" imgUrl ? 'background: url('+$filters.fullImageUrl(imgUrl)+') no-repeat; background-size: cover;':'' ">
      <view class="head-portrait">
        <avatar class="u-info-avatar" :imageUrl="$filters.fullImageUrl(user.avatar)"
          :address="user.coinbase" :imgWidth="140" :imgHeight="140" shape="circular"></avatar>
      </view>
    </view>
    <view class="text-center mt-20">
      <view class="user-name" v-if="user.nickname">{{user.nickname}}</view>
      <view class="flex align-center justify-center">
        <view class="user-id">{{ $filters.ellipsisAddress(user.coinbase) }}</view>
        <view class="iconfont icon-copy" v-clipboard:copy="user.coinbase"
          v-clipboard:success="copySuccess" v-clipboard:error="copyError"></view>
      </view>
      <view class="marked-words" v-if="user.brief">{{user.brief}}</view>
      <view class="marked-words" v-else>{{$t('account.introduction')}}</view>
      <view class="flex align-center justify-center mt-10">
        <view class="mr-10">
          <button @tap="toProfile" size="mini" class="edit-btn">{{$t('items.edit')}}</button>
        </view>
        <view @click="share" class="share-box">
          <view class="iconfont icon-upload"></view>
        </view>
        <view class="flex align-center">
          <view @click="openFollowing"> <text class="focus-on">{{$t('items.following')}}</text>
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
              @showDialog="showDialog" @onLike="onLike" :key="i" >
            </nft-item>
          </view>
          <load-status :loadStatus="loadStatus"></load-status>
        </view>
      </view>
      <share ref="share"></share>

      <mes-popup ref="following" @close="closeMespopup" ftype="following" :address="user.coinbase"
        @showFollownum="showFollownum"></mes-popup>

      <mes-popup ref="follow" @close="closeMespopup" ftype="follow" :address="user.coinbase"
        @showFollownum="showFollownum"></mes-popup>
      <sale-dialog :show="showSaleDialog"  @close="closeDialog"
        @confirm="dialogConfirm" :asset="dialogOrder" :nft="dialogNft">
      </sale-dialog>
      <cancel-sale-dialog :show="showCancelSaleDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </cancel-sale-dialog>
      <buy-dialog :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="dialogOrder" :nft="dialogNft">
      </buy-dialog>
      <bid-dialog :show="showBidDialog"  @close="closeDialog" @confirm="dialogConfirm" :bid="dialogOrder" :myAsset="dialogMyAsset" :asset="dialogOrder" :nft="dialogNft">
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
      InputBottom: "",
      TabCur: 0,
      scrollLeft: 0,
      titleList: [
        { text: "在售" },
        { text: "收藏品" },
        { text: "创建" },
        { text: "喜欢" },
        { text: "交易" },
      ],
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
        { name: "created", title: this.$t("items.created"), count: 0 },
        { name: "liked", title: this.$t("items.liked"), count: 0 }
      ],
      page: 1,
      limit: 6,
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
      ftype: 1,
      loadStatus: "",
      isRefresh: false,
    };
  },
  onPullDownRefresh() {
    this.isRefresh = true;
    this.reloadList();
  },
  onShow() {
    // this.$store.dispatch("reload");
    this.init();
  },
  watch: {
    user() {
      this.init();
    },
  },
  onLoad(options) {
    let tab = options.tab;
    if (tab) this.tab = tab;
  },
  computed: {
    user() {
      var user = this.$store.state.user;
      return user;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  methods: {
    init() {
      /*
      if(this.$mp.query.tab){
        this.tab = this.$mp.query.tab;
      }
      */
      this.imgUrl = this.user.bannerUrl;
      this.page = 1;
      this.showFollownum();
      this.getList();
    },
    toProfile() {
      uni.navigateTo({
        url: "/pages/profile",
      });
    },
    share() {
      if (!this.$store.state.connected) {
        return this.$tools.messageConnect();
      }
      if (!this.isLogin) {
        return this.$store.dispatch("signLogin");
      }
      this.$refs.share.$refs.share.open();
    },
    closeMespopup() {
      this.$refs.following.$refs.following.close();
      this.$refs.follow.$refs.follow.close();
    },
    openFollowing() {
      uni.navigateTo({
        url: "/pages/follow?tab=following&address=" + this.user.coinbase,
      });
    },
    openFollow() {
      uni.navigateTo({
        url: "/pages/follow?tab=followers&address=" + this.user.coinbase,
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
      this.page = 1;
      this.getList();
    },
    toOperation(index) {
      this.operationIdex = index;
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

    onLike(index, like) {
      this.$set(this.nftList[this.tab][index], "like", like, false);
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
    getOnSale: function () {
      let params = {
        page: this.page,
        limit: this.limit,
        address: this.user.coinbase,
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
        address: this.user.coinbase,
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
    getNftDetail(data) {
        this.$api("nft.detail",{token:data.sellToken,tokenId:data.sellTokenId}).then(res=>{
            return res.data;
        })
    },
    getCreated: function () {
      let params = {
        address: this.user.coinbase,
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
        address: this.user.coinbase,
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
        address: this.user.coinbase,
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
  margin-top: 10rpx;
}
.mr-10 {
  margin-right: 20rpx;
}
.text-center {
  text-align: center;
  background-color: #242736 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
}
.mt-20 {
  padding-top: 50rpx;
  padding-bottom: 50rpx;
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
.align-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.bg-box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200rpx;
  background: linear-gradient(-90deg, #4b4a4a, #4e3c3a, #505253);
}
.head-portrait {
  margin-top: 100rpx;
}
.nav{
  color: rgba(255, 255, 255, 0.8);
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
  color: rgba(255, 255, 255, 0.8);
  margin: 10rpx 0rpx;
}
.iconfont{
    color: rgba(255, 255, 255, 0.8);
}
.text-black{
    color: rgba(255, 255, 255, 1.5);

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
  // color: #333333;
  color: rgba(255, 255, 255, 0.8);
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
  // padding: 36rpx 36rpx 100rpx 36rpx;
}
.mb-24 {
  margin-bottom: 24rpx;
}
</style>
<style lang="scss">
.cu-load {
  width: 100%;
}
</style>
