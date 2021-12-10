<template>
  <view>
    <view @tap="show=true">
      <img class="sideButton" src="@/static/images/index/button_cebianlan.png" alt="">
      <!-- <image class="sideButton" src="@/static/images/index/button_cebianlan.png"></image> -->
    </view>
    <view class="cu-modal drawer-modal justify-start " :class="show?'show':''" @tap="show=false">
      <view class="cu-dialog basis-lg" @tap.stop="">
        <view class="flex align-center mb-big" v-if="connected">
          <avatar class="user-img" :imageUrl="$filters.fullImageUrl(user.avatar)"
            :address="user.coinbase" :imgWidth="116" :imgHeight="116" shape="circular">
          </avatar>
          <view>
            <view class="user-name">{{ user.nickname }}</view>
            <view class="user-code">{{ $filters.ellipsisAddress(user.coinbase) }}</view>
          </view>
        </view>
        <view class="flex align-center mb-big" v-else>
          <avatar class="user-img" :address="'unlogin'" :imgWidth="116" :imgHeight="116"
            shape="circular">
          </avatar>
          <view class="bfont text-link" @tap="toConnect"> {{$t('sideBar.connectWallet')}} </view>
        </view>
        <view class="wallet-section" v-if="connected">
          <view class="flex align-center mb-42">
            <img class="icon-box" src="@/static/images/index/FINGER.jpg" alt="">
            <!-- <image class="icon-box" src="@/static/images/index/FINGER.jpg"></image> -->
            <view class="flex flex-direction align-start">
              <view class="x-text-1B1B1B">{{$t('navigation.balance')}}</view>
              <view class="eth-box">{{erc20Balance.balance}} {{ defaultPaytoken.symbol }} </view>
              <view class="price-box">${{erc20Balance.usdtBalance}}</view>
            </view>
          </view>
        </view>

        <view @click="Jump('index')" class="head-box flex align-center justify-between mb-big">
          <view class="title-text">{{$t('sideBar.explore')}}</view>
          <view class="rightArrow"></view>
        </view>
        <view @click="Jump('item')" class="head-box flex align-center justify-between mb-big">
          <view class="title-text">{{$t('sideBar.myItems')}}</view>
          <view class="rightArrow"></view>
        </view>
        <view @click="Jump('myFollower')" class="head-box flex align-center justify-between mb-big">
          <view class="title-text">{{$t('sideBar.myFollower')}}</view>
          <view class="rightArrow"></view>
        </view>
        <view @tap="Jump('language')" class="head-box flex align-center justify-between mb-big">
          <view class="title-text"> {{$t('sideBar.changeLanguage')}}</view>
          <view class="rightArrow"></view>
        </view>
        <view class="footer-section">
          <button @tap="Jump('create')" class="create-btn"
            size="mini">{{$t('sideBar.create')}}</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data: function () {
    return {
      show: false,
    };
  },
  computed: {
    connected() {
      return this.$store.state.connected;
    },
    user: function () {
      var user = this.$store.state.user;
      return user;
    },
    defaultPaytoken() {
      return this.$store.getters.defaultSalePayToken();
    },
    erc20Balance() {
      let paytoken = this.$store.getters.payToken(this.defaultPaytoken.address);
      if (!paytoken) return { balance: 0, usdtBalance: 0 };
      let balance = this.$store.getters.getBalance(
        this.defaultPaytoken.address
      );
      balance = !balance ? 0 : balance;
      let usdtBalance = balance * paytoken.rate;
      return {
        balance: this.$tools.decimal(balance, 3),
        usdtBalance: this.$tools.decimal(usdtBalance, 2),
      };
    },
  },
  methods: {
    Jump(param) {
      this.show = false;
      if (
        (param == "item" || param == "myFollower" || param == "create") &&
        !this.connected
      ) {
        return this.$tools.messageConnect();
      }
      let url = "";
      switch (param) {
        case "myFollower":
          url = "/pages/follow?tab=following&address=" + this.user.coinbase;
          break;
        default:
          url = "/pages/" + param;
          break;
      }
      uni.navigateTo({
        url: url,
      });
    },
    toConnect() {
      this.$store.dispatch("connectAndSign");
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.sideButton {
  width: 50rpx;
  height: 32rpx;
}
img{
  filter: invert(100%);
}
.basis-lg {
  padding: 60rpx 43rpx 20rpx;
  flex-basis: 65%;
  overflow-y: auto;
  background-color: #242736;
}

.user-name {
  font-size: 38rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #1b1b1b;
  text-align: left;
}
.user-code {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 21rpx;
  text-align: left;
}
.user-img {
  margin-right: 21rpx;
}
.title-text{
  color: rgba(255, 255, 255, 0.8);
}
.mb-98 {
  margin-bottom: 98rpx;
}
.mb-big {
  margin-bottom: 60rpx;
}
.mb-sm {
  margin-bottom: 25rpx;
}
.special {
  right: 0;
  top: 0;
}
.wallet-section {
  border-bottom: $border;
  margin-bottom: 60rpx;
  padding-bottom: 60rpx;
  .icon-box {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: pink;
    margin-right: 18rpx;
  }
  .x-text-1B1B1B {
    font-size: 20rpx;
    color: $grayColor;
    margin-bottom: 8rpx;
  }
  .eth-box {
    font-size: 20rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
  .price-box {
    font-size: 20rpx;
    font-weight: 500;
    color: #666;
    background: #eeeeee;
    border-radius: 8rpx;
    padding: 4rpx 6rpx;
  }
}

.network-item {
  text-transform: capitalize;
}

.language-item {
  display: flex;
  align-items: center;
  .name {
    flex: 1;
    text-align: left;
    padding: 10rpx 0;
  }
}

.footer-section {
  margin-top: 80rpx;
  .create-btn {
    width: 100%;
    font-weight: bold;
    background: $primaryColor;
    color: #fff;
  }
}
</style>

