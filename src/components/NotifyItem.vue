<template>
  <view class="notify-item" :class="{big: size=='big'}">
    <view class="notify-inner">
      <view class="cover cpointer" @click="goDetail">
        <image fit="contain" class="nft-cover" :src="$filters.fullImageUrl(newNFT.image)"
          v-if="info.target == 'NFT'"></image>
        <template v-else>
          <avatar shape="circular" :imageUrl="$filters.fullImageUrl(info.image)" :address="info.owner"
            :imgWidth="130" :imgHeight="130" v-if="size !='big'"></avatar>
          <avatar shape="circular" :imageUrl="$filters.fullImageUrl(info.image)" :address="info.owner"
            :imgWidth="150" :imgHeight="150" v-else></avatar>
        </template>
      </view>
      <view class="notify-content">
        <view class="title cpointer" @click="goDetail">
          <view class="bfont">{{info.title}}</view>
        </view>
        <view class="desc">
          <view class="c9">{{info.desc}}</view>
          <view class="cpointer op" @click="goAccount(info.op.address)">
            <avatar :imageUrl="$filters.fullImageUrl(info.op.image)" :address="info.op.address"
              :imgWidth="40" :imgHeight="40" shape="circular"></avatar>
            <span
              class="op-name">{{ info.op.name || $filters.ellipsisAddress(info.op.address) }}</span>
          </view>
        </view>
        <view class="time c9">{{ $filters.timeFormat(info.time) }}</view>
      </view>

    </view>
  </view>
</template>
<script>
export default {
  name: "NotifyItem",
  props: {
    notify: {
      type: Object,
      default: {},
    },
    size: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    newNFT(){
      if(!this.notify.media)return '';
      return this.$tools.analysis(this.notify.media);
    },
    title() {
      return "";
    },
    desc() {
      return "";
    },
    info() {
      let info = this.parseNotify(this.notify);
      return info;
    },
  },
  methods: {
    thumbnail(url) {
      if(url){
        if (url.endsWith(".gif")) return url;
        return url + "!300x300";
      }
      else{
        return '';
      }
    },
    goDetail() {
      this.read();
      if (this.info.target == "NFT") {
        var ids = this.info.address + ":" + this.info.tokenId;
        uni.navigateTo({
          url: "/pages/token?ids=" + ids,
        });
        if (this.size == "small") {
          this.$emit("close");
        }
      } else {
        this.goAccount(this.info.owner);
      }
    },
    goAccount(address) {
      let data = {
        address: address,
      };
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
      // this.$router.push({ path: "/account/" + address });
      if (this.size == "small") {
        this.$emit("close");
      }
    },
    read() {
      this.$api("notice.read", { id: this.notify.id });
    },
    parseNotify(notify) {
      switch (this.$tools.getNotifyType(notify.type)) {
        case "FOLLOW":
          return this.followNotify(notify);
          break;
        case "LIKE":
          return this.likeNotify(notify);
          break;
        case "TRADE":
          return this.tradeNotify(notify);
          break;
      }
    },
    followNotify(notify) {
      return {
        target: "USER",
        image: notify.operatorImg,
        owner: notify.operator,
        title:
          notify.operatorName || this.$filters.ellipsisAddress(notify.operator),
        time: notify.createTime,
        op: {
          address: notify.operator,
          name: notify.operatorName,
          image: notify.operatorImg,
        },
        desc: "followed by",
      };
    },
    likeNotify(notify) {
      return {
        target: "NFT",
        image: notify.image,
        title: notify.name,
        address: notify.content.address,
        tokenId: notify.content.tokenId,
        op: {
          address: notify.operator,
          name: notify.operatorName,
          image: notify.operatorImg,
        },
        time: notify.createTime,
        desc: "liked by",
      };
    },
    tradeNotify(notify) {
      let info = {
        target: "NFT",
        image: notify.image,
        title: notify.name,
        address: notify.content.token,
        tokenId: notify.content.tokenId,
        op: {
          address: notify.operator,
          name: notify.operatorName,
          image: notify.operatorImg,
        },
        time: notify.createTime,
      };
      switch (this.$tools.getNotifySubType(notify.subType)) {
        case "CANCEL_SALE":
          info.desc = "cancel sale by";
          break;
        case "BUY":
          info.desc = "buy by";
          break;
        case "BID":
          info.desc = "bid by";
          break;
        case "EDIT_BID":
          info.desc = "edit bid by";
          break;
        case "CANCEL_BID":
          info.desc = "cancel bid by";
          break;
        case "ACCEPT_BID":
          info.desc = "accept by";
          break;
        case "MINT":
          info.desc = "mint by";
          break;
        case "LIKED":
          info.desc = "liked by";
          break;
        case "BURN":
          info.desc = "burn by";
          break;
        case "TRANSFER":
          info.desc = "transfer by";
          break;
        case "RECEIVE":
          info.desc = "receive by";
          break;
        case "BOUGHT":
          info.desc = "bought by";
          break;
        case "BIDDEN":
          info.desc = "biding by";
          break;
      }
      return info;
    },
  },
};
</script>

<style lang="scss" scoped>
.notify-item {
  display: flex;
  flex: 1;
  border: $border;
  margin-bottom: 20rpx;
  border-radius: $borderRadius;
  &.big {
    margin-bottom: 40rpx;
    .notify-inner {
      padding: 15rpx;
    }
    .nft-cover {
      width: 150rpx;
      height: 150rpx;
    }
    .title {
      font-size: 36rpx;
    }
  }
  .notify-inner {
    display: flex;
    padding: 20rpx;
  }
  .notify-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 20rpx;
    justify-content: center;
  }
  .nft-cover {
    width: 130rpx;
    height: 130rpx;
    border-radius: $borderRadius;
  }
  .title {
    padding-bottom: 10rpx;
  }
  .time {
    font-size: 24rpx;
  }
  .desc {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 10rpx;
    .op {
      display: flex;
      align-items: center;
    }
    .c9 {
      white-space: nowrap;
      padding-right: 10rpx;
    }
    .op-name {
      padding-left: 10rpx;
      white-space: nowrap;
    }
  }
}
</style>

