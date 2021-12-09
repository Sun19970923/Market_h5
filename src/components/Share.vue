<template>
  <uni-popup class="popupClass" ref='share' type="bottom">
    <view class="mainSection sp">
      <u-row class="titleClass">
        <u-col span="4"></u-col>
        <u-col class="section2" span="4">{{$t('share.shareTo')}}</u-col>
        <u-col class="section3" span="4">
          <img @click="close" class="close-img" src="@/static/images/Popup/pop_shut.png">
        </u-col>
      </u-row>
      <view class="share-body">
        <view class="share-item">
          <text @click="popup('twitter')" class="iconfont icon-twitter"></text>
          <view class="font">{{$t('share.twitter')}}</view>
        </view>
        <view class="share-item">
          <text @click="popup('telegram')" class="share-item iconfont icon-telegram"></text>
          <view class="font">{{$t('share.telegram')}}</view>
        </view>
        <view class="share-item">
          <text @click="send()" class="share-item iconfont icon-email-fill"></text>
          <view class="font">{{$t('share.email')}}</view>
        </view>
        <view class="share-item">
          <text @click="popup('youtube')" class="share-item iconfont icon-Youtube-fill"></text>
          <view class="font">{{$t('share.youtube')}}</view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  name: "Share",
  data() {
    return {};
  },
  methods: {
    popup(type) {
      let url;
      var share = this.$store.state.share;
      var site = this.$store.state.url;
      var site_name = this.$store.state.name;
      switch(type){
        case "twitter":
          url = "https://twitter.com/intent/tweet?url=" +
            encodeURIComponent(document.location.href) +
            "&text=" +
            encodeURIComponent(document.title) +
            "&hashtags=" + site_name +
            "%2Cethereum%2Cdigitalasset%2Cnft&via=" + site;
          break;
        case "telegram":
          url =
            "https://telegram.me/share/?url=" +
            encodeURIComponent(document.location.href) +
            "&title=" +
            encodeURIComponent(document.title);
          break;
        case "facebook":
          url =
            "https://www.facebook.com/sharer.php?u=" +
            encodeURIComponent(document.location.href) +
            "&quote=nft-market";
          break;
      }
      window.open(
        url,
        "newWindow",
        "toolbar=no,menubar=no,directories=no,status=no,width=600,height=450,scrollbars=yes,resizable=no"
      );
    },
    send(){
      var site_name = this.$store.state.name;
      var share = this.$store.state.share;
      location = "mailto:?cc=" + share.email.url + "&subject=" + site_name + "&body=email content";
    },
    close() {
      this.$refs.share.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.share-body {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 60rpx;
  margin-bottom:30rpx;
  .share-item {
    margin: 0 10rpx;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 72rpx;
    cursor: pointer;
    border-radius: $borderRadius;
    .font{
      font-size:30rpx;
    }
    &:hover,
    &:active {
      background: #f0f0f0;
    }
  }
}
.sp {
  height: fit-content;
}
.titleClass {
  .section2 {
    display: flex;
    justify-content: center !important;
  }
  .section3 {
    display: flex;
    justify-content: flex-end !important;
    .close-img {
      width: 72rpx;
    }
  }
}
</style>

