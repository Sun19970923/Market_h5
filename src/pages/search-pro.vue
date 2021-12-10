<template>
  <view class="main-section">
    <view class="body-wrapper">
      <view class="flex align-center">
        <view class="search-box flex align-center" :class="isFocus ? 'focus' : ''">
          <text class="cuIcon-search"></text>
          <input :focus="focus" @focus="isFocus=true" @blur="isFocus=false" v-model="searchKey" :placeholder="$t('search.placeholder')" :adjust-position="false" type="text"
          confirm-type="search" @keydown.enter="searchClick" placeholder-class="placeholder-text" class="input-text"/>
        </view>
        <view  @tap="cancel" class="cancel-button"> {{$t('search.cancel')}} </view>
      </view>

      <view class="history-title">
        <view class="t">
        {{$t('search.history')}}
        </view>
        <view class="iconfont icon-ashbin" @tap="clear"></view>
      </view>
      <view class="history-list">
        <view v-for="(item,i) in list" :key="i" @click="chooseItem(item)" class="item">
            {{item}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function () {
    return {
      searchKey: "",
      isFocus: false,
      focus: false,
      searchHistory:[],
    };
  },
  watch: {
  },
  computed: {
    list() {
      if(!this.searchHistory) return [];
      const uniqueSet = new Set(this.searchHistory.filter((item) =>item != "" && item != null&&item!=" "&&item.toString().trim().length!=0).reverse())
      return uniqueSet;
    },
  },
  async onShow(){
    this.searchHistory=localStorage.getItem("searchHistory");
    if( this.searchHistory==null || this.searchHistory=='' ){
      this.searchHistory = []
    }else{
      this.searchHistory = this.searchHistory.split(",")
    }
    await this.$nextTick();
    this.focus = true;
  },
  methods: {
    focusFunc(){
      this.isFocus = true;
    },
    blurFunc(){
      this.isFocus = false;
    },
    clear(){
      this.searchHistory=[]
      localStorage.setItem("searchHistory", this.searchHistory);
    },
    chooseItem(param) {
      this.searchKey = param;
      this.searchClick();
    },
    async searchClick() {
        let searchHistory = this.searchHistory;
        if (this.searchHistory != "" || this.searchHistory != null) {
          searchHistory.push(this.searchKey);
          localStorage.setItem("searchHistory", searchHistory);
        }
        uni.navigateTo({
          url: "/pages/search?keyword=" + this.searchKey
        });
    },
    toSearch(){
      uni.navigateTo({
        url: "/pages/search?keyword=" + this.searchKey
      });
    },
    cancel() {
       uni.navigateTo({
        url: "/pages/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-section{
}
.search-box {
  font-size: 32rpx;
  flex: 1;
  padding: 10rpx;
  padding: 10rpx 20rpx;
  margin-right: 20rpx;
  border-radius: 30rpx;
  border: $border;
  color: rgba(255, 255, 255, 0.8);
  &.focus{
    border: 1rpx solid $primaryColor;
  }
}

.input-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
}
.placeholder-text {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #cccccc;
}
.cancel-button {
  // color: $grayColor;
  color: rgba(255, 255, 255, 0.8);
}
.history-list {
  display: flex;
  flex-wrap:wrap;
  margin-top: 20rpx;

  .item {
    padding:5rpx 20rpx;
    margin: 10rpx 0rpx;
    margin-right:20rpx;
    font-size: 36rpx;
    background:#f0f0f0;
    color: #999;
    border-radius: 15rpx;
  }
}
.history-title{
  display: flex;
  margin-top: 40rpx;
  align-items: center;
  justify-content: center;
  .t{
    flex: 1;
    color: rgba(255, 255, 255, 0.8);
  }
  .iconfont{
    font-size: 44rpx;
    color: $grayColor;
  }
    
}
</style>
