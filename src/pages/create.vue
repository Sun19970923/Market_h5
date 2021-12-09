<template>
<!-- 创建页面 -->
<view class="page-body">
  <cu-custom opcity="1" :isBack="true" :isFixed="true">
    <block slot="content">
    {{$t('create.title')}}
    </block>
  </cu-custom>

  <view class="body-content">
  
    <view class="create-order">
      <view class="create-content" type="flex" justify="center">
        <view class="detail-sign" span="10">
          <view class="introduce">{{$t('create.introduce')}}</view>
          <view class="select">
            <view class="sel-row">
              <view @click="to721" class="inner">
                <view class="cover">
                  <view class="pic-img">
                    <img src="@/static/images/create/single.png"/>
                  </view>
                  <view class="border-box">
                    <view class="border-1"></view>
                    <view class="border-2"></view>
                    <view class="border-3"></view>
                  </view>
                </view>
                <view class="text">{{$t('create.single')}}</view>
              </view>
            </view>

            <view class="sel-row">
              <view @click="to1155" class="inner">
                <view class="cover">
                  <view class="pic-img">
                    <img src="@/static/images/create/multiple.png"/>
                  </view>
                  <view class="border-box">
                    <view class="border-1"></view>
                    <view class="border-2"></view>
                    <view class="border-3"></view>
                  </view>
                </view>
                <view class="text">{{$t('create.multiple')}}</view>
              </view>
            </view>
          </view>
          <view class="introduce">
            <text>{{$t('create.prompt')}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>

</view>
</template>

<script>
import { getLocalStorage } from "@/util/local-storage.js";

export default {
  name: "Create",
  data: function () {
    return {
      user: this.$store.state.user,
      myselfShow: false,
      notifyActive: -1,
    };
  },
  created() {
    const { Authorization } = getLocalStorage("Authorization");
    const { balance } = getLocalStorage("balance");
    if (Authorization) {
      this.user.isLoggedIn = true;
      this.user.balance = balance;
      this.user.token = Authorization;
    }
  },
  computed:{
    connected(){
      return this.$store.state.connected;
    },
    isLogin(){
      return this.$store.state.isLogin;
    },
  },
  methods: {
    checkLogin(){
      if(this.connected && this.isLogin) return true;
      if(!this.connected){
        this.$tools.messageConnect();
      }else{
        this.$store.dispatch("signLogin");
      }
      return false;
    },
    to721(){
      if(!this.checkLogin()) return;
      uni.navigateTo({
        url: "/pages/ERC721",
      });
    },
    to1155(){
      if(!this.checkLogin()) return;
      uni.navigateTo({
        url: "/pages/ERC1155",
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>

.body-content{
  min-height: 100%;
  background-color: #fff;
  padding: 0 20rpx 100rpx;
}

.create-order {
  padding: 50rpx 0 200rpx;
}
.detail-sign {
  font-weight: 500;
  font-size: 32rpx;
  margin: 0 auto;
}

.introduce {
  font-size: 32rpx;
  color: #777;
  word-break: break-word;
}

.select {
}
.sel-row {
  display: block;
  width: 100%;
  height: 260rpx;
  border: $border;
  border-radius: $borderRadius;
  margin: 50rpx 0;
  .inner {
    display: flex;
    cursor: pointer;
    width: 100%;
    height: 100%;
    align-items: center;
  }
  .cover {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .text {
    flex: 1;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .pic-img {
    flex: 1;
    margin-left: 60rpx;
    img {
      width: 180rpx;
    }
  }
}

.border-box {
  flex: 1;
  padding-left: 40rpx;
  display: flex;
  flex-direction: column;
  .border-1 {
    margin: 12rpx 0;
    width: 68rpx;
    height: 12rpx;
    background: #ebebeb;
    border-radius: 6rpx;
  }
  .border-2 {
    width: 110rpx;
    height: 7rpx;
    background: #ebebeb;
    border-radius: 4rpx;
  }
  .border-3 {
    margin: 9rpx 0 17rpx;
    width: 55rpx;
    height: 7rpx;
    background: #ebebeb;
    border-radius: 4rpx;
  }
}
.green-link {
  font-size: 16rpx;
  font-weight: 400;
  color: #00c657;
  line-height: 24rpx;
}
</style>

