<template>
  <view>

    <img v-if="imageUrl" :width="newWidth" :height="newHeight"
        class="avatar-image"
      :class=" shape=='circular' ? 'circular':'' " :src="thumbnail(imageUrl)" />
    <jazzicon class="avatar-image" :shape="shape" v-else :address="address"
      :diameter="newWidth">
    </jazzicon>

  </view>
</template>
<script>
export default {
  name: "HeadPortrait",
  props: {
    imageUrl: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    imgWidth: {
      type: Number,
      default: 50,
    },
    imgHeight: {
      type: Number,
      default: 50,
    },
    shape: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed:{
    theRpx(){
      return document.body.clientWidth/750;
    },
    newWidth(){
      return this.theRpx*this.imgWidth;
    },
    newHeight(){
      return this.theRpx*this.imgHeight;
    }
  },
  methods: {
    thumbnail(url){
      if(url){
        if(url.endsWith('.gif')) return url;
        if(url.indexOf("ipfs") != -1) return url;
        if(url.startsWith("data:image")) return url;
        return url + '!100x100';
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-image{
  display: flex;
  border-radius: $borderRadius;
  &.circular{
    border-radius: 50%;
  }
}
</style>
