<template>
  <view class="body">
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{nftURI.name}} </block>
    </cu-custom>
    <view class="body-wrapper">
      <view class="head-box">
        <view class="flex align-center justify-between flex-wrap">
          <view class="flex align-center flex-wrap">
            <template v-if="!lowestAsset">
              <view class="eth-box">{{$t('nftDetail.nfs')}}</view>
            </template>
            <template v-else>
              <view class="eth-box">{{ lowestAsset.singlePrice }} {{lowestAsset.payToken.symbol}}
              </view>
              <view class="us-box">USDT ${{ lowestAsset.singleUsdtPrice }}</view>
            </template>
          </view>
          <view class="number-box">{{$t('nftDetail.number')}}：{{info.sellQuantity || 0}} of
            {{info.quantity}}</view>
        </view>
        <view class="introduce-box">{{ nftURI.description || $t('nftDetail.text2') }}</view>
        <view class="nft-royalties" v-if="royalties"> {{royalties}}% {{$t('nftDetail.text3')}}
        </view>
      </view>
      <view class="nft-img">
        <nft-preview :imgUrl="info.imgUrl" :animUrl="info.animUrl"
          :animation_url="nftURI.animation_url" :imageIpfs="nftURI.image"></nft-preview>
      </view>
      <view class="bottom-box">
        <view class="flex align-center justify-between operate-box">
          <view v-if="info.category" class="art-box">{{ info.category.name }}</view>
          <view class="flex align-center">
            <view class="icon-box" @click="likeFunction()">
              <text class="iconfont icon-favorites-fill" :class="info.like?'active':''"></text>
            </view>
            <view class="icon-box">
              <text @click="isFull=true" class="iconfont icon-fullscreen"></text>
            </view>
            <view @click="share" class="icon-box relative">
              <text class="iconfont icon-upload"></text>
            </view>

            <view v-popover:filter class="icon-box" v-if="openseaUrl || myAsset">
              <text class="iconfont icon-ellipsis bfont"></text>
            </view>
            <popover class="popover-menus" name="filter">
              <template v-if="myAsset">
                <view class="menu" @click="showDialog('transfer', myAsset)">
                  {{$t('nftDetail.transfer')}}</view>
                <view class="menu" @click="showDialog('burn', myAsset)">
                  {{$t('nftDetail.burnToken')}} </view>
              </template>
              <view class="menu" v-if="openseaUrl" @click="showDialog('opensea')">
                {{$t('nftDetail.viewOpensea')}}
              </view>
            </popover>

          </view>
        </view>
        <scroll-view scroll-x class="nowrap" scroll-with-animation :scroll-left="scrollLeft">
          <view class="flex options-container">
            <view v-for="(item,index) in optionArr" :key="index" class="option-box" @tap="chooseOption(item)">
                    <view class="option-text">{{item.label}}</view>
                    <view class="lin-box" :class=" item.name == tab ? 'bc-000':''"></view>
            </view>
          </view>
        </scroll-view>
        <!-- 详情1、3 -->
        <view class="flex justify-between m-46" style="margin-bottom:250rpx;">
          <template v-if="tab=='info'">
            <info-tab :info="info" :creator="creator" :attributes="nftURI.attributes"></info-tab>
          </template>
          <template v-else-if="tab=='owners'">
            <owners-tab :sellValue="info.sellValue" :owners="owners"
              @cancel="(owner) => showDialog('cancel_sale', owner)"
              @buy="(owner) => showDialog('buy', owner)"></owners-tab>
          </template>
          <template v-else-if="tab=='history'">
            <history-tab :sellValue="info.sellValue" :historys="historys"></history-tab>
          </template>
          <template v-else-if="tab=='bid'">
            <bid-tab :bids="bids" :myBid="myBid" :myAsset="myAsset"
              @accept="(bid) => showDialog('accept', bid)"
              @cancel="(bid) => showDialog('cancel_bid', bid)"></bid-tab>
          </template>
        </view>
      </view>

      <!-- 详情3 -->
      <view class="trade-box" style="padding-top:20rpx;">
          <view style="display:flex;margin-bottom:20rpx;">
                  <view class="lowestAuctionBox" v-if="highestBid">
                      <view class="top">
                          <text>{{$t('nftDetail.hbb')}}</text>
                          <button v-if="myAsset" class="viewBtn" size="mini" @click="showDialog('accept', highestBid)">{{ $t('nftDetail.accept')}}</button>
                      </view>
                      <view class="info">
                          <view class="avatar">
                              <avatar @click="goAccount(highestBid.owner)"
                                      shape="circular"
                                      :imageUrl="$filters.fullImageUrl(highestBid.avatar)"
                                      :address="highestBid.owner"
                                      :imgWidth="50"
                                      :imgHeight="50"></avatar>
                          </view>
                          <view class="name">
                            <text class="bfont c3">{{highestBid.nickname || $filters.ellipsisAddress(highestBid.address) }} </text>
                            <view>
                              <text class="bluec">{{highestBid.singlePrice || ''}}{{highestBid.payToken.symbol}}</text>
                              <text class="c9 ml5"> {{ highestBid.singleUsdtPrice ||''}} USDT</text>
                            </view>
                          </view>
                      </view>
                  </view>
          </view>
        

        <view class="flex">
          <template v-if="myAsset">
            <button size="mini" v-if="!myAsset.onsell" class="common-btn nft-btn"
              @click="showDialog('sale', myAsset)">{{$t('nftDetail.sale')}}
            </button>
            <button size="mini" v-else class="common-btn nft-btn"
              @click="showDialog('edit_sale', myAsset)">{{$t('nftDetail.editSale')}}
            </button>
          </template>
          <template v-else-if="lowestAsset">
            <button size="mini" @click="showDialog('buy', lowestAsset)" class="common-btn nft-btn">
              {{$t('nftDetail.buy')}}
            </button>
          </template>

          <template v-if="!myAsset || owners.length > 1">
            <button size="mini" plain v-if="!myBid" @click="showDialog('bid')"
              class="common-btn nft-btn plain">
              {{$t('nftDetail.pad')}}</button>
            <button size="mini" plain v-else class="common-btn nft-btn plain"
              @click="showDialog('edit_bid', myBid)">
              {{$t('nftDetail.editBid')}}</button>
          </template>

        </view>
      </view>

      <buy-dialog :show="showBuyDialog" @close="closeDialog" @confirm="dialogConfirm" :asset="order"
        :nft="info">
      </buy-dialog>
      <bid-dialog :show="showBidDialog" @close="closeDialog" @confirm="dialogConfirm" :bid="order" :myAsset="myAsset" :nft="info">
      </bid-dialog>
      <sale-dialog :show="showSaleDialog" @close="closeDialog" 
        @confirm="dialogConfirm" :asset="order" :nft="info">
      </sale-dialog>
      <accept-dialog :show="showAcceptDialog" @close="closeDialog" @confirm="dialogConfirm"
        :bid="order" :myAsset="myAsset" :nft="info">
      </accept-dialog>
      <cancel-sale-dialog :show="showCancelSaleDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="order" :nft="info">
      </cancel-sale-dialog>
      <cancel-bid-dialog :show="showCancelBidDialog" @close="closeDialog" @confirm="dialogConfirm"
        :bid="order" :nft="info">
      </cancel-bid-dialog>
      <transfer-dialog :show="showTransferDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="order" :nft="info"></transfer-dialog>

      <burn-dialog :show="showBurnDialog" @close="closeDialog" @confirm="dialogConfirm"
        :asset="order" :nft="info"></burn-dialog>

      <full-screen :isFull="isFull" :info="info" @exitClick="isFull=false"
        :animation_url="nftURI.animation_url" :imageIpfs="nftURI.image"></full-screen>
      <share ref="share"></share>
    </view>
  </view>
</template>

<script>
import InfoTab from "@/components/detailSections/Info";
import OwnersTab from "@/components/detailSections/Owners";
import HistoryTab from "@/components/detailSections/History";
import BidTab from "@/components/detailSections/Bid";
import NftPreview from "@/components/NFTPreview";
import NftDialog from "@/mixins/NftDialog";
import MixinsNFTInfo from '@/mixins/NftInfo';

export default {
  components: {
    InfoTab,
    OwnersTab,
    HistoryTab,
    BidTab,
    NftPreview,
  },
  mixins: [ MixinsNFTInfo ],
  data() {
    return {
      optionArr: [
        { label: this.$t("nftDetail.info"), name: "info" },
        { label: this.$t("nftDetail.owners"), name: "owners" },
        { label: this.$t("nftDetail.history"), name: "history" },
        { label: this.$t("nftDetail.bid"), name: "bid" }
      ],
      tab: "info",
      scrollLeft: 0,
      btnArr: [
        this.$t("nftDetail.cancelSale"),
        this.$t("nftDetail.bid"),
        this.$t("nftDetail.transfer"),
      ],
      btnIndex: 0,
      token: {
        token: "",
        tokenId: "",
      },
      tabIndex: "info",
      isLikeFlag: "",
      creator: {},
      info: {},
      owners: [],
      historys: [],
      bids: [],
      lowestAsset: null,
      myAsset: null,
      highestBid: null,
      myBid: null,
      showSaleDialog: false,
      showCancelSaleDialog: false,
      showBuyDialog: false,
      showBidDialog: false,
      showCancelBidDialog: false,
      showAcceptDialog: false,
      showTransferDialog: false,
      showBurnDialog: false,
      showReportDialog: false,
      order: {},
      isFull: false,
      mediaData: [],
      royalties:'',
      saleContent: '请选择出售方式',
      showType: 1,
      finished: false
    };
  },
  onPullDownRefresh() {
    this.init(true);
  },
  onLoad(options) {
    let tab = options.tab;
    if (tab) {
      this.tab = tab;
    }
    let ids = options.ids;
    if (!ids) return;
    ids = ids.split(":");
    if (ids.length != 2) return;
    this.token = {
      token: ids[0],
      tokenId: ids[1],
    };
  },
  onShow() {
    this.init();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
    connected() {
      return this.$store.state.connected;
    },
    config() {
      return this.$store.state.config;
    },
    payTokens() {
      return this.$store.state.payTokens;
    },
    nftURI() {
      if (this.info.metadataContent) {
        return this.$tools.analysis(this.info.metadataContent);
      }
      if (this.mediaData) {
        let nft;
        nft = this.info.address + ":" + this.info.tokenId;
        for (let key in this.mediaData) {
          if (key == nft) {
            return this.$tools.analysis(this.mediaData[key]);
          }
        }
      }
      return {};
    },
    openseaUrl() {
      return this.$store.state.openseaUrl;
    },
  },
  watch: {
    user() {
      this.init();
    }
  },
  methods: {
    toSale() {
      this.showSaleDialog = true;
    },
    goAccount(address) {
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
    share() {
      if (!this.$tools.needConnected()) return;
      this.$refs.share.$refs.share.open();
    },
    chooseOption(item) {
      this.tab = item.name;
    },
    showDialog(type, asset) {
      if(type == "opensea"){
        let url = this.openseaUrl +  this.info.address + "/" + this.info.tokenId;
        return window.open(url, "_blank");
      }

      if (!this.$tools.needLogin(this.$route.path)) return;
      switch (type) {
        case "sale":
          this.showSaleDialog = true;
          this.order = asset;
          break;
        case "edit_sale":
          this.showSaleDialog = true;
          this.order = asset;
          break;
        case "cancel_sale":
          this.showCancelSaleDialog = true;
          this.order = asset;
          break;
        case "buy":
          this.showBuyDialog = true;
          this.order = asset;
          break;
        case "bid":
          this.showBidDialog = true;
          this.order = asset;
          break;
        case "edit_bid":
          this.showBidDialog = true;
          this.order = asset;
          break;
        case "cancel_bid":
          this.showCancelBidDialog = true;
          this.order = asset;
          break;
        case "accept":
          this.showAcceptDialog = true;
          this.order = asset;
          break;
        case "transfer":
          this.showTransferDialog = true;
          this.order = asset;
          break;
        case "burn":
          this.showBurnDialog = true;
          this.order = asset;
          break;
        case "report":
          this.showReportDialog = true;
          break;
      }
    },
    closeDialog() {
      this.showSaleDialog = false;
      this.showCancelSaleDialog = false;
      this.showBuyDialog = false;
      this.showBidDialog = false;
      this.showCancelBidDialog = false;
      this.showAcceptDialog = false;
      this.showTransferDialog = false;
      this.showBurnDialog = false;
      this.order = {};
    },
    init(isRefresh) {
      this.getDetails(isRefresh);
    },
    likeFunction(parameter) {
      let that = this;
      let data = {
        address: this.info.address,
        tokenId: this.info.tokenId,
      };
      if (!this.info.like) {
        this.$api("like.add", data).then((res) => {
          if (that.$tools.checkResponse(res)) {
            that.$set(that.info, "like", true, false);
          }
        });
      } else {
        this.$api("like.remove", data).then((res) => {
          if (that.$tools.checkResponse(res)) {
            that.$set(that.info, "like", false, false);
          }
        });
      }
    },
    queryLike(address, tokenId) {
      let that = this;

      if (!this.connected) return;
      let query = {
        nfts: address + ":" + tokenId,
        address: this.$store.state.user.coinbase,
      };
      this.$api("like.listuserlike", query).then((res) => {
        if (that.$tools.checkResponse(res)) {
          if (res.data.length) {
            that.$set(that.info, "like", true, false);
          } else {
            that.$set(that.info, "like", false, false);
          }
        } else {
          that.$tools.message(res.errmsg);
        }
      });
    },
    getMedia(nfts) {
      let _nfts = nfts.address + ":" + nfts.tokenId;
      let data = {
        info: _nfts,
      };
      this.$api("nft.getmedia", data).then((res) => {
        this.mediaData = res.data;
      });
    },
    getRoyalties(nfts){
      let _nfts = nfts.address + ":" + nfts.tokenId;
      let data = {
        info: _nfts,
      };
      this.$api("nft.getroyalties", data).then((res) => {
        for(let key in res.data){
          if(key == _nfts && res.data[key]){
            let getroyalties = JSON.parse(res.data[key])
            let count = 0;
            for(let i = 0;i < getroyalties.length;i++){
              count = count + getroyalties[i]
            }
            that.royalties = that.$tools.decimal(count / 100, 2);
          }
        }
      });
    },  
    getDetails(isRefresh) {
      var data = {
        token: this.token.token,
        tokenId: this.token.tokenId,
      };
      let that = this;
      this.$api("nft.detail", data).then(async function (res) {
        if (that.$tools.checkResponse(res)) {
          that.info = res.data.nft;
          let sellQuantity = 0;
          if (res.data.items) {
            for (let i = 0; i < res.data.items.length; i++) {
              if (res.data.items[i].onsell) {
                let item = res.data.items[i];
                let _sellQuantity = item.sellValue - item.completed;
                if (_sellQuantity > item.quantity) _sellQuantity = item.quantity;
                sellQuantity += _sellQuantity;
              }
            }
          }
          that.info.sellQuantity = sellQuantity;
          that.$set(that.info, "contract", res.data.nft.contract);
          that.queryLike(that.info.address, that.info.tokenId);
          that.getMedia(res.data.nft);
          if(!that.info.royalties){
            that.getRoyalties(res.data.nft)
          }
          else{
            let data=JSON.parse(that.info.royalties)
            let count=0;
            for(let i=0;i<data.length;i++){
              count=count+data[i]
            }
            that.royalties = that.$tools.decimal(count / 100, 2);
          }
          that.creator = res.data.creator;
          that.info.category = that.$store.getters.category(
            that.info.categoryId
          );
          await that.getOwners();
          that.getBids();
          that.getContract();
          that.getHistorys();
        } else {
          that.$tools.message(res.errmsg);
        }
        if (isRefresh) {
          uni.stopPullDownRefresh();
        }
      });
    },
    getOwners() {
      return new Promise((resolve, reject) => {
        let that = this;
        var data = {
          token: this.token.token,
          tokenId: this.token.tokenId,
        };
        this.$api("nft.owners", data).then((res) => {
          if (that.$tools.checkResponse(res)) {
            let owners = [];
            let owner;
            for (var i = 0; i < res.data.length; i++) {
              owner = res.data[i];
              if (owner.onsell) {
                owner.payToken = that.$store.getters.payToken(
                  owner.payTokenAddress
                );
              }
              let sellQuantity = owner.sellValue - owner.completed;
              if(sellQuantity > owner.quantity) sellQuantity = owner.quantity;
              owner.sellQuantity = sellQuantity;
              owners.push(owner);
            }
            that.owners = owners;
          }
          resolve(true);
        });
      });
    },
    getHistorys() {
      var data = {
        token: this.token.token,
        tokenId: this.token.tokenId,
      };
      this.$api("nft.history", data).then((res) => {
        if (this.$tools.checkResponse(res)) {
          let historys = [];
          let history;
          for (var i = 0; i < res.data.length; i++) {
            history = res.data[i];
            if (history.type < 5) {
              if (history.buyerToken) {
                history.payToken = this.$store.getters.payToken(
                  history.buyerToken
                );
              }
            } else {
              if (history.sellToken) {
                history.payToken = this.$store.getters.payToken(
                  history.sellToken
                );
              }
            }
            historys.push(history);
          }
          this.historys = historys;
        }
      });
    },
    getBids() {
      var data = {
        token: this.token.token,
        tokenId: this.token.tokenId,
      };
      this.$api("nft.bids", data).then((res) => {
        if (this.$tools.checkResponse(res)) {
          let bids = [];
          for(var i = 0; i < res.data.length; i++){
            let bid = res.data[i];
            let bidQuantity = bid.buyerValue - bid.completed;
            bid.bidQuantity = bidQuantity;
            let payToken = this.$store.getters.payToken(bid.sellToken);
            bid.payToken = payToken;
            bids.push(bid);
          }
          this.bids = bids;
          this.analysisNFT();
        } else {
          this.$tools.message(res.errmsg);
        }
      });
    },
    analysisNFT() {
      if(this.connected){
        this.myAsset = this.getAddressAsset(this.owners, this.user.coinbase);
        this.myBid = this.getActiveAddressBid(this.bids, this.user.coinbase);
      }
      this.lowestAsset = this.getLowestAsset(this.owners);
      this.highestBid = this.getHighestBid(this.bids);
    },
    getContract(isRefresh) {
      let data = {
        addresss: this.info.address,
      };
      this.$api("contract.listbyaddr", data).then((res) => {
        if (this.$tools.checkResponse && res.data.length) {
          this.info.contract = res.data[0];
        }
      });
    },
    dialogConfirm() {
      this.closeDialog();
      this.init();
    }
  },
};
</script>

<style lang="scss" scoped>
.flex-wrap {
  flex-wrap: wrap;
}
button::after {
  border: none;
}
.body {
  height: 100%;
  overflow: auto;
  background-color: #fff;
}
.head-box {
  padding: 20rpx 0;
}
.eth-box {
  font-size: 28rpx;
  font-weight: bold;
  color: $primaryColor;
}
.us-box {
  font-size: 28rpx;
  font-weight: 500;
  color: #999999;
  margin-left: 22rpx;
}
.number-box {
  font-size: 26rpx;
  font-weight: 400;
  color: #999999;
}
.introduce-box {
  width: 100%;
  font-size: 26rpx;
  color: #444444;
  padding: 40rpx 0 20rpx;
}
.nft-img {
  width: 100%;
}
.bottom-box {
  width: 100%;
  padding: 40rpx 0;
}
.operate-box {
  padding-bottom: 40rpx;
}
.art-box {
  font-size: 24rpx;
  font-weight: 500;
  color: #666666;
  height: 46rpx;
  line-height: 46rpx;
  background: #e5e5e5;
  border-radius: 8rpx;
  padding: 0rpx 15rpx;
}
.icon-box {
  width: 70rpx;
  height: 70rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 50%;
  margin-left: 38rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  .iconfont {
    color: #aaa;
    &.active {
      color: $redColor;
    }
  }
}

.options-container {
  min-width: 100%;
  overflow-x: auto;
}
.option-box {
  margin-right: 37rpx;
}
.option-box:after {
  // 使用伪类元素占据单位，不影响页面
  content: "";
  height: 0;
  width: 1rpx;
}
.option-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}
.lin-box {
  margin-top: 13rpx;
  height: 5rpx;
}
.bc-000 {
  background: #000000;
}

.user-img {
  width: 84rpx;
  height: 84rpx;
  background-color: pink;
  margin-right: 22rpx;
}
.user-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}
.price-box {
  font-size: 28rpx;
  color: #999999;
}
.price-text {
  font-size: 28rpx;
  margin: 0rpx 26rpx 0rpx 16rpx;
}
.time-box {
  font-size: 26rpx;
  font-weight: 500;
  color: #999999;
}
.m-46 {
  margin: 46rpx 0rpx;
}

.trade-box {
  width: 100%;
  padding: 40rpx 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eeeeee;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 2rpx 20rpx rgb(0 0 0 / 10%);
  z-index: 4;
}
.buy-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background: $primaryColor;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #ffffff;
}
.bid-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background: #d9f7e6;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: $primaryColor;
  margin-left: 59rpx;
}
.service-box {
  font-size: 24rpx;
  font-weight: 400;
  color: #1b1b1b;
  opacity: 0.6;
  text-align: center;
  margin-top: 47rpx;
}
.mt-46 {
  margin-top: 46rpx;
}
.trade-box2 {
  width: 100%;
  padding: 70rpx 36rpx 64rpx;
  background-color: #fff;
  border-top: 1rpx solid #eeeeee;
  position: sticky;
  bottom: 0;
}
.x-text-7381FF {
  color: $primaryColor;
}
.m-44 {
  margin: 36rpx 44rpx 0rpx;
}
.common-btn {
  width: 40%;
  line-height: 80rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
}
.choose-btn {
  color: #dd3b3b;
  border: 1rpx solid #dd3b3b;
}
.nowrap {
  white-space: nowrap;
}
.nft-royalties {
  background: #e6f9ee;
  padding: 8px 10px;
  border-radius: 5px;
  width: 100%;
  font-size: 14px;
  color: #666;
  text-align: center;
}
.selectBtn {
  background-color: #4F00FF;
  color: #fff;
  width: 85px;
  padding: 0;
  height: 35px;
  line-height: 35px;
  font-size: 13px;
}
.line {
    width: 100%;
    border: 1rpx solid #eee;
    margin-bottom: 15px;
}
.textTab {
    height: 100%;
    background-color: #efefef;
    color: #333;
    padding: 16rpx 20rpx;
    margin-top: -27px;
    border-radius: 4px;
    font-size: 14px;
}
.lowestAuctionBox + .lowestAuctionBox {
    border-left: 1px solid #eee;
}
.lowestAuctionBox{
    width: 100%;
    padding: 10rpx;
    font-size: 13px;
    .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;
        .viewBtn{
            margin: 0;
            padding: 6rpx 6rpx;
            line-height: 1rem;
            color: #6800ff;
            background-color: #e1ccff;
        }
    }
    .info{
        font-size: 12px;
        display: flex;
        justify-content: left;
        align-items: center;
        // line-height: 1.2rem;
    }
    .countdown{
        background-color: #f4f4f4;
        color: #00c657;
        text-align: center;
        border-radius: 6rpx;
    }
}
.status-switch {
    background-color: #eee;
    border: 1px solid #ddd;
    border-radius: 30rpx;
    font-size: 12px;
    max-width: 35vw;
    display: flex;
    justify-content: left;
    text{
        width: 50%;
        display: inline-block;
        padding: 6rpx 20rpx;
        text-align: center;
        border-radius: 30rpx;
    }
    .active {
        background-color: #6801ff;
        color: #ffffff;
    }
}
</style>

