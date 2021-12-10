<template>
  <view class="page-body">
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content">
        {{$t('footer.language')}}
      </block>
    </cu-custom>
    <view class="body-wrapper">
         <view class="language-item" v-for="(language, index) in languageArray" :key="index" @tap="selLanguage(index)">
            <view class="name">{{ language.name }}</view>
            <icon type="success_no_circle" size="20" :color="$store.state.primaryColor" v-if="language_index==index">
            </icon>
          </view>
    </view>
  </view>
</template>
<script>
export default {
  data:function(){
    let lang = localStorage.getItem("locale");
    return {
      language_index: lang == "zh" ? 1 : 0,
      languageArray: [{
          name: "English",
      },{
        name: "中文",
      }],
    }
  },
  methods:{
    selLanguage(index) {
      this.language_index = index;
      if (this.language_index == 0) {
        localStorage.setItem("locale", "en");
        this.$i18n.locale = localStorage.getItem("locale");
      } else if (this.language_index == 1) {
        localStorage.setItem("locale", "zh");
        this.$i18n.locale = localStorage.getItem("locale");
      }
      uni.navigateBack({
        delta: 1,
      });
    },
 
  }
}
</script>
<style lang="scss" scoped>
.language-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  font-size:40rpx;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: $border;
  .name {
    flex: 1;
    text-align: left;
    padding: 10rpx 0;
  }
}
</style>
