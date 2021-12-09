<template>
  <view>
    <view class="cu-custom" :style="[{ height: CustomHei + 'px'}]">
      <view class="cu-bar" :style="style"
        :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor,isFixed?'fixed':'hide-bar']">
        <view class="action" @tap="BackPage" v-if="isBack">
          <text class="cuIcon-back text-bold" :class="backStyle"></text>
          <slot name="backText"></slot>
        </view>
        <view class="content" :class="titleLeft?'dir-left':''" :style="[{ top: StatusHei + 'px' }]">
          <slot name="content"></slot>
        </view>
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      StatusHei: "",
      CustomHei: "",
    };
  },

  mounted() {
    this.StatusHei = this.StatusBar;
    this.CustomHei = this.CustomBar;
  },
  name: "cu-custom",
  computed: {
    style() {
      var StatusBar = this.StatusHei;
      var CustomBar = this.CustomHei;
      var bgImage = this.bgImage;
      var opcity = this.opcity;
      var bgColor = "rgba(255, 255, 255," + opcity + ")";
      var style = `height:${CustomBar}px;padding-top:${StatusBar}px;background-color:${bgColor};`;
      if (this.bgImage) {
        style = `${style}background-image:url(${bgImage});`;
      }
      return style;
    },
  },
  props: {
    opcity: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "",
    },
    isBack: {
      type: [Boolean, String],
      default: false,
    },
    stopBack: {
      type: [Boolean, String],
      default: false,
    },
    bgImage: {
      type: String,
      default: "",
    },
    backStyle: {
      type: String,
      default: "",
    },
    titleLeft: {
      type: Boolean,
      default: false,
    },
    isFixed: {
      type: Boolean,
      default: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: null,
    },
    isProfile: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    BackPage() {
      if (this.stopBack) return;
      if (this.isEdit) {
        this.$store.dispatch("updateProfile", this.data);
      }
      if (this.isProfile) {
        this.$store.dispatch("reload");
      }
      let back = getCurrentPages();

      if(back[back.length-1].route=='pages/language'){
        uni.reLaunch({
          url:'/'+back[back.length-2].route
        });
      }
      if (back && back.length > 1) {
        uni.navigateBack({
          delta: 1,
        });
      } else {
        history.back();
      }
    },
  },
};
</script>
<style>
.dir-left {
  right: unset;
  left: 30rpx;
  text-align: left;
}
.hide-bar {
  z-index: 1100 !important;
}
</style>
