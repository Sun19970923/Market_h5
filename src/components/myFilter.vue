<template>
  <view class="filter-wrapper">
    <view v-popover:filter class="filter-box" :class="{'active': category}">
      <image class="img" mode="heightFix" src='@/static/images/index/filter.png'></image>
      <span v-if="!category">{{$t('hindex.filter')}}</span>
      <span class="category-text" v-else>
        <span>
          {{ category }}
        </span>
        <span @click.stop="selectFilter('')" class="close-icon iconfont icon-close"></span>
      </span>
    </view>

    <popover class="index-Filter" name="filter">
     <view class="popover-filters-item" v-for="(filter, i) in filters" :key="i"
        @click="selectFilter( filter.id)" :class="filterId == filter.id ? 'active' : ''">
        {{ filter.name }}
      </view>
    </popover>

  </view>
</template>

<script>
export default {
  name: "myFilter",
  props: {
    filters: {
      type: Array,
      default:[],
    },
    filterId: {
      type: [String, Number],
      default: "",
    },
  },
  computed: {
    category() {
      for (var i = 0; i < this.filters.length; i++) {
        let filter = this.filters[i];
        if (filter.id == this.filterId) return filter.name;
      }
      return "";
    },
  },
  methods: {
    selectFilter(id) {
      this.$emit("selectFilter", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1rpx solid #eeeeee;
  border-radius: 12rpx;
  font-size: 26rpx;
  padding: 16rpx 20rpx;
  font-weight: 400;
  color: #333;
  &.active {
    background: #f8f8f8;
  }
  .filter-icon {
    height: 20rpx;
    padding-right: 10rpx;
  }
  .close-icon {
    position: absolute;
    font-size: 30rpx;
    font-weight: bold;
    color: $primaryColor;
    padding-left: 10rpx;
    right: 0;
    padding: 1rpx;
    z-index: 100;
  }
  .category-text {
    display: flex;
    position: relative;
    padding-right: 40rpx;
  }
}
.popover-filters {
  padding: 22rpx;
  box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(153, 153, 153, 0.3);
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #444444;
  line-height: 24rpx;
  width: 280rpx;
  background: #ffffff;
  border: 1rpx solid #eeeeee;
  border-radius: 10rpx;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.popover-filters-item {
  white-space: nowrap;
  cursor: pointer;
  margin-right: 14rpx;
  margin-bottom: 14rpx;
  background: #f4f4f4;
  border-radius: 10rpx;
  padding: 12rpx 14rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    color: white !important;
    background: $primaryColor !important;
  }
}
.filter-box {
  font-size: 14rpx;
  font-weight: 400;
  // color: #1b1b1b;
  color: rgba(255, 255, 255, .8);
  text-align: center;
  border: 1rpx solid #eeeeee;
  border-radius: 10rpx;
  padding:8rpx 16rpx;
  display:flex;
  align-items: center;
  .img{
    height:16rpx;
    margin-right:10rpx;
  }
}
.filter-wrapper{
  position: relative;
}
</style>
