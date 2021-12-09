<template>
  <view class="my-input-relative my-input-flex">
    <input :value="value"
      ref="myInput"
      @input="(e) => $emit('input', e.target.value)"
      :disabled="disabled" :placeholder="placeholder" :type="type" class="my-input-class" :class="disabled?'disable':''"/> 
    <view v-if="!payTokens.length"  class="input-span my-input-absolute">{{ !payToken ? "" : payToken.symbol }}</view>
    <view v-else  class="relative flex justify-center">
      <view v-popover:mySelect class="input-span my-input-absolute">
        <text>{{ !payToken ? "" :  payToken.symbol }}</text>
        <text class="iconfont icon-arrow-down"></text>
      </view>
      <popover name="mySelect" class="selectClass">
        <view class="item" :class="payAddress == token.address ? 'active':''" @click="payAddressChange(token.address)" v-for="(token, i) in payTokens" :key="i" >
          {{token.symbol}}
        </view>
      </popover>
    </view> 
  </view>
</template>
<script>
export default {
  data(){
    return {
    }
  },
  props:{
    disabled:{
      type:Boolean,
      default:false
    },
    value:{
      type: [String,Number],
      default:""
    },
    placeholder:{
      type:String,
      default:""
    },
    type:{
      type:String,
      default:""
    },
    isSelect:{
      type:Boolean,
      default:false
    },
    payAddress:{
      type: String,
      default: "",
    },
    payTokenId: {
      type: [String, Number],
      default: '0'
    },
    payTokens:{
      type:Array||Object,
      default:()=>[]
    },
  },
  computed: {
    payToken(){
      return this.$store.getters.payToken(this.payAddress);
    },
  },
  methods:{
    payAddressChange(param){
      this.$emit('payAddressChange', param);
    }
  }
}
</script>
<style lang="scss" scoped>
.disable{
  color: #C0C4CC;
  cursor: not-allowed;
  background-color: #F5F7FA;
}
</style>
