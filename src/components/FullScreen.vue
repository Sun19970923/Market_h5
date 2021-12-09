<template>
  <uni-popup class="full-popup" ref='full' type="bottom" :animation="false">
  <view class="main-section">
    <text @click="exitClick" class="iconfont icon-fullscreen-exit"></text>
    <movable-area class="movable-area">
        <movable-view :scale="true"  class="movable-view" direction="all">
            <nft-preview :preview="true" v-if="visible" :imgUrl="info.imgUrl" :animUrl="info.animUrl" :animation_url='animation_url' :imageIpfs='imageIpfs'></nft-preview>
        </movable-view>
    </movable-area>  
     
    <view class="name">{{info.name}}</view>
  </view>
  </uni-popup>
</template>
<script>
import NftPreview from '@/components/NFTPreview'

export default {
  components: {
    NftPreview,
  },
  data: function(){
    return {
      visible: this.isFull,
    }
  },
  watch:{
    isFull(val){
      this.visible = this.isFull;
      if(this.visible==true){
          this.$refs.full.open()
      }
      else if(this.visible==false){
          this.$refs.full.close()
      }
    }
  },
  props:{
    isFull:{
      type: Boolean,
      default: false,
    },
    info:{
      type:Object,
      default:{}
    },
    animation_url:{
      type:String,
      default:''
    },
    imageIpfs:{
      type:String,
      default:''
    },
  },
  methods:{
    exitClick(){
      this.$emit("exitClick")
    }
  }
}
</script>
<style lang="scss" scoped>
  .nft-image{
    max-width: 80%;
    height: auto;
    border-radius: $borderRadius;
    align-self: center;
  }
  @media only screen and (max-width:992px) {
    .nft-image{
      width:90%;
    }
    .iconfont.icon-fullscreen-exit{
    }
  }
.name{
  margin-left:50%;
  transform:translateX(-50%);
  margin-top:20rpx;
  color:white;
      width: 100%;
    text-align: center;
}
.iconfont.icon-fullscreen-exit{
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  cursor: pointer;
  font-size:48rpx;
  color:white;
  align-self: flex-end;
  border-radius: 50%;
  border:1px solid #FFF;
  padding:10rpx;
  z-index: 100;
}

</style>
