<template>
  <view class="nft-preview">
    <view class="audio-preview" v-if="previewType=='audio'">
      <u-image :id="audioImgId"  class="nft-image fullImage" :src="$filters.fullImageUrl(imageIpfs)" @load="handleResize">
        <template v-slot:error>
          <img class="error-image" :src="require('@/static/images/util/non-existent.png')"/>
        </template>
      </u-image>
      <view class="audio-inner">
        <view class="audio-holder"></view>
        <free-audio class="free-audio" :activeColor="$store.state.primaryColor"
          :loopPlay="true" :url="$filters.fullImageUrl(animation_url)"
          audioId="1"
        >
        </free-audio>
        <!--
        <audio class="nft-audio" :src="$filters.fullImageUrl(animUrl)" autoplay
          :controls="controls" controlslist="nodownload" loop
          :muted="!preview" preload="none" :style="{width: audioWidth+'px', marginTop: audioTop + 'px'}"></audio>
        -->
      </view>
    </view>
    <view class="video-preview" v-else-if="previewType=='video'">
      <video class="nft-video" :src="$filters.fullImageUrl(animation_url)" autoplay
        :controls="controls" disablePictureInPicture controlslist="nodownload" loop
        :muted="!preview" :poster="$filters.fullImageUrl(imageIpfs)"
        ></video>
    </view>
    <view class="image-preview" v-else>
      <u-image mode="widthFix" class="nft-image fullImage" :src="$filters.fullImageUrl(imageIpfs)">
        <template v-slot:loading>
          <img class="error-image" :src="require('@/static/images/util/non-existent.png')"/>
        </template>
        <template v-slot:error>
          <img class="error-image" :src="require('@/static/images/util/non-existent.png')"/>
        </template>
      </u-image>
      <!-- <img class="nft-image" :src="$filters.fullImageUrl(imageIpfs)"/> -->
    </view>

  </view>
</template>
<script>
export default {
  name: "NFTPreview",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    animUrl: {
      type: String,
      default: ""
    },
    preview: {
      type: Boolean,
      default: false,
    },
    animation_url:{
      type: String,
      default:"",
    },
    imageIpfs:{
      type: String,
      default:"",
    }
  },
  data(){
    return {
      autoPlay: true,
      controls: true,
      audioWidth: 0,
      audioTop: 0,
      audioImgId: this.preview ? "audio-image-preview" : "audio-image"
    };
  },
  mounted(){
    console.log(this.imageIpfs,'imageIpfs')
    window.addEventListener("resize", this.handleResize);
  },
  unmounted(){
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    previewType(){
      if(!this.imgUrl) return;
      if(!this.animUrl) return "image"
      if(this.$tools.isAudioUrl(this.animUrl)) return 'audio';

      if(this.$tools.isVideoUrl(this.animUrl)) return 'video'
    },
  },
  methods: {
    handleResize(){
      let audioImg = document.getElementById(this.audioImgId);
      if(!audioImg) return;
      let width = audioImg.clientWidth;
      let height = audioImg.clientHeight;
      console.log("width", width, 'height', height)
      this.audioWidth = width * 0.9;
      this.audioTop = height * 0.5 - 50;
    },

  }
}
</script>

<style lang="scss">

.nft-preview, .image-preview, .audio-preview, .video-preview, .no-preview{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
}
.nft-audio{
  width:100%!important;
  height: 32px;
  margin-top:40rpx!important;
}

.nft-image, .nft-video{
  max-width: 100%;
  max-height: 100%;
  border-radius: $borderRadius;
}
.nft-preview{
  .audio-holder{
    width: 100%;
    // height: 50%;
  }
  .audio-inner{
    // position: absolute;
    left: 0;
    top: 0rpx;
    width: 100%;
    // height: 100%;
    text-align: center;
  }
}
.free-audio{
  margin-top: 20rpx;
}
.error-image{
  width:50%;
}
// .fullImage{
//   width: 100%;
//   height:400rpx!important;
//   min-height:400rpx;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
</style>
