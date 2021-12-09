<template>
  <view>
    <cu-custom opcity="1" :isBack="true"  :isFixed="true" :isEdit="true" :data="data">
            <block slot="content"> {{$t('profile.title')}} </block>
  </cu-custom>
    <view class="body-wrapper">
    <view v-if="data.type=='imgSrc'">
      <view class="chooseFile-Content-RightSection">
        <avatar :imageUrl="$filters.fullImageUrl(data.newValue)" :address="$store.state.user.coinbase" :imgWidth="138"
          :imgHeight="138"></avatar>
        <button class="buttonClass" hover-class="buttonHover" @click="chooseFile">{{$t('profile.chooseFile')}}</button>

      </view>
    </view>
    <view v-if="data.type=='nickname'" class="item">
      <view class="title">{{$t('profile.displayName')}}</view>
      <input v-model="data.newValue" class="inputClass" :placeholder="$t('profile.enterNickname')" />
    </view>
    <view v-if="data.type=='bio'" class="item">
      <view class="title">{{$t('profile.bio')}}</view>
      <input v-model="data.newValue" class="inputClass" :placeholder="$t('profile.enterBrief')" />
    </view>
    <view v-if="data.type=='customUrl'" class="item">
      <view class="title">{{$t('profile.customURL')}}</view>
      <input v-model="data.newValue" class="inputClass" :placeholder="$t('profile.enterUrl')" />
    </view>
    </view>
  </view>
</template>
<script>
export default {
  data: function () {
    return {
      data: {
        type: "",
        newValue: this.$store.state.user.avatar,
        imageFile: null,
      },
    };
  },

  onLoad: function (option) {
    this.data.type = JSON.parse(option.data).type;
    this.data.newValue = JSON.parse(option.data).value;
  },
  methods: {
    chooseFile() {
      let that = this;
      uni.chooseFile({
        count: 1,
        type: "image",
        extension: [".jpg", ".jpeg", ".png", ".gif", ".svg"],
        success(res) {
          let file = new FileReader();
          that.data.imageFile = res.tempFiles[0];
          file.readAsDataURL(res.tempFiles[0]);
          file.onload = () => {
            that.data.newValue = file.result;
          };
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFiles
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  padding: 40rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
}
.inputClass {
  background: white;
  height: 80rpx;
  border-radius: 10rpx;
  padding-left: 20rpx;
  margin-top: 20rpx;
}
.chooseFile-Content-RightSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50rpx;
}

.buttonClass {
  width: 100%;
  height: 100rpx;
  background: rgba(235, 134, 49, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primaryColor;
  margin-left: 60rpx;
}
.buttonHover {
  opacity: 0.5;
}
</style>