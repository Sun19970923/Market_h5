<template>
  <view>
    <view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight,'background-color': nav.bg}">
      <text class="iconfont leftArrow header-back" :style="{'color':nav.color}" v-if="nav.isdisPlayNavTitle"
        @click="back"></text>
      <view class="header-title " :style="{'color':nav.color}">{{nav.navTitle}}</view>
    </view>
    <view :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
  </view>
</template>
<script>
export default {
  props: {
    nav: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
	data:{
		type:Object,
		default:null
	},
	isProfile:{
		type:Boolean,
		default:false
	}
  },
  data() {
    return {
      statusBarHeight: 0,
      titleBarHeight: 0,
    };
  },
  created() {
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf("iPhone") !== -1) {
          that.titleBarHeight = 44 + "px";
        } else {
          that.titleBarHeight = 48 + "px";
        }
        that.statusBarHeight = res.statusBarHeight + "px";
      },
    });
  },
  methods: {
    // 回到上一页
    back: function () {
      if (this.isEdit) {
        this.$store.dispatch("updateProfile",this.data);
      }
	  if(this.isProfile){
		this.$store.dispatch("reload");
	  }
      let back = getCurrentPages();
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
.header {
  display: flex;
  align-items: center;
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
  left: 0;
}

.header .header-title {
  position: absolute;
  left: 50%;
  font-size: 36rpx;
  transform: translateX(-50%);
}
.header-back {
  position: absolute;
  left: 15upx;
  font-size: 30upx;
  padding: 10upx;
  border-radius: 50%;
}
</style>
