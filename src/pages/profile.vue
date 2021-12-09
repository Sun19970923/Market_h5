<template>
  <view class="body">
    <cu-custom opcity="1" :isBack="true"  :isFixed="true" :isProfile="true">
            <block slot="content"> {{$t('profile.title')}} </block>
  </cu-custom>
    <view class="body-wrapper">
    <view @click="toEdit('imgSrc',user.avatar)" class="flex align-center justify-between item-box">
      <view class="title-text">{{$t('profile.updateAvatar')}}</view>
      <view  class="flex align-center">
        <view class="user-img mr-30">
          <avatar :imageUrl="$filters.fullImageUrl(user.avatar)" :address="user.coinbase" :imgWidth="88"
            :imgHeight="88">
          </avatar>
        </view>
        <view class="rightArrow"></view>
      </view>
    </view>

    <view @click="toEdit('nickname',user.nickname)" class="flex align-center justify-between item-box">
      <view class="title-text">{{$t('profile.displayName')}}</view>
      <view  class="flex align-center">
        <view class="information-text mr-30">{{user.nickname}}</view>
        <view class="rightArrow"></view>
      </view>
    </view>

    <view @click="toEdit('bio',user.brief)" class="flex align-center justify-between item-box">
      <view class="title-text">{{$t('profile.bio')}}</view>
      <view  class="flex align-center">
        <view class="information-text mr-30">{{user.brief}}</view>
        <view class="rightArrow"></view>
      </view>
    </view>

    <view @click="toEdit('customUrl',user.shortUrl)" class="flex align-center justify-between item-box">
      <view class="title-text">URL</view>
      <view  class="flex align-center">
        <view class="information-text mr-30">{{user.shortUrl}}</view>
        <view class="rightArrow"></view>
      </view>
    </view>
    <button @click="updateImage" class="buttonClass" hover-class="buttonHover">{{$t('profile.updateProfile')}}</button>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      id: "",
      address: "",
      pic_data: "",
      coinbase: "",
      networkId: "",
      defaultImgSrc: "",
    };
  },
  watch:{
    user(){
          this.init();
    }
  },
  created() {
    this.init()
  },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
  },
  methods: {
    init(){
      this.$api("user.profile").then((res) => {
      if (this.$tools.checkResponse(res)) {
        this.id = res.data.user.id;
        this.address = res.data.user.address;
      } else {
        this.$tools.message(res.errmsg);
      }
    });
    },
    toEdit(type, value) {
      let data = {
        type: type,
        value: value,
      };
      uni.navigateTo({
        url: "/pages/edit?data=" + encodeURIComponent(JSON.stringify(data)),
        success: (res) => {
          console.log("调用成功");
        },
        fail: () => {
          console.log("调用失败");
        },
        complete: () => {
          console.log("调用完成");
        },
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    async updateImage() {
      if (!this.user.imageFile) {
        this.UpdateProfile(this.$store.state.user.avatar);
      } else {
        const formData = new FormData();
        formData.append("file", this.user.imageFile);
        this.$api("storage.upload", formData).then((res) => {
          if (this.$tools.checkResponse(res)) {
            this.UpdateProfile(res.data.url);
          } else {
            this.$tools.message(res.errmsg);
          }
        });
      }
    },
    UpdateProfile(param) {
      let temporary = {
        address: this.address,
        id: this.id,
        avatar: param,
        nickname: this.$store.state.user.nickname,
        brief: this.$store.state.user.brief,
        shortUrl: this.$store.state.user.shortUrl,
      };
      this.$api("user.setprofile", temporary).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.$tools.message("修改成功", "success");
          this.$store.dispatch("authinfo");
          this.goBack();
        } else {
          this.$tools.message(res.errmsg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
button::after {
  border: none;
}
.body {
  min-height: 100%;
  background-color: #fff;
}
.item-box {
  width: 100%;
  padding: 61rpx 0rpx 55rpx;
  border-bottom: 1rpx solid #eeeeee;
}
.title-text {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
.user-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  // background-color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mr-30 {
  margin-right: 30rpx;
}
.information-text {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #888888;
}
.validation-box {
  height: 74rpx;
  line-height: 74rpx;
  font-size: 32rpx;
  color: $primaryColor;
  font-family: PingFang SC;
  font-weight: 500;
  // background: #ccf4dd;
  background: rgba(235, 134, 49, 0.2);
  border-radius: 10rpx;
}
.buttonClass {
  background: $primaryColor;
  color: white;
}
.buttonHover {
  opacity: 0.5;
}
</style>
