<template>
  <uni-popup  class="popupClass" ref='burn' type="bottom">
    <view class="mainSection">
      <view class="clubart-dialog-title">
        <view class="left">
          <span>{{nft.name}}</span>
        </view>
        <view class="right" @click="close">
          <img class="close-img" src = "@/static/images/Popup/pop_shut.png">
        </view>
      </view>
    <view class="clubart-dialog-body" v-if="!confirm">
      <view class="all-error" v-if="formError.all"> {{ formError.all }} </view>
      <view class="process"  >
        <view class="step-info" >
          <view class="text" >
              <span>{{$t('dialog.burnToken')}}</span>
          </view>
        </view>
        <view class="confirm-text">
          {{$t('dialog.sureBurn')}}
        </view>

        <view class="input-group" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
          <view class="input-info">
            <view class="tip">
              <text>{{$t('dialog.burnQuantity')}}</text>
              <text class="gray-font">({{ asset.quantity}} {{$t('dialog.available')}})</text>
            </view>
            <input 
              class="my-input-class"
              placeholder=""
              v-model="form.quantity"
            />
 
            <view class="input-error" v-if="formError.quantity">{{ formError.quantity}}</view>
          </view>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" type="success" :loading="confirm">{{$t('dialog.burn')}}</button>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn cancel" size="mini" type="info" @click="close">{{$t('dialog.cancel')}}</button>
        </view>
      </view>
    </view>

    <view class="clubart-dialog-body" v-else>
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process">
        <view class="step-info">
          <view class="text" >
              <span>{{$t('dialog.burnToken')}}</span>
          </view>
          <span
            v-if="step.burn != 1"
            :class="step.burn == 2 ? 'finish': ''"
            class="step iconfont icon-seleted"
          ></span>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>

        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onCancel" type="success" v-if="step.burn== 0">{{$t('dialog.burn')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.burn== 1">{{$t('dialog.inProgress')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.burn">{{ error.burn}}</view>
      </view>
    </view>
</view>
  </uni-popup>
</template>

<script>
export default {
  data: function(){
    return {
      visible: this.show,
      confirm: false,
      form: {
        quantity: 1,
      },
      formError: {
        all: "",
        quantity: "",
      },
      step:{
        burn: 0,
      },
      error:{
        all: "",
        burn: "",
      },
    }
  },
  props: {
    show:{
      type: Boolean,
      default: false,
    },
    nft: {
      type: Object,
      default: {},
    },
    asset:{
      type: Object,
      default: ()=>{
        return {
          quantity:''
        }
      }
    },
  },
  watch:{
    show(val){
      this.visible = this.show;
      if(this.visible==true){
        this.$refs.burn.open()
      }
    },
  },
  computed: {
    user(){
      return this.$store.state.user;
    },
  },
  methods: {
    checkForm(){
      let error = false;
      if(!this.form.quantity){
        this.formError.quantity = "no Quanlity"
        error = true
      }
      if(parseFloat(this.form.quantity) > parseFloat(this.asset.quantity)){
        error = true;
        this.formError.quantity = this.$t('form.exceedValue');
      }
      return !error;
    },
    onSubmit(){
      if(!this.checkForm()) return;
      this.confirm = true;
      let that = this;
      setTimeout(async function(){
        await that.onBurn()
      }, 100);
    },
    async onBurn(){
      this.step.burn = 1
      let asset = {
        address: this.nft.address,
        type: this.nft.type,
        tokenId: this.nft.tokenId,
        owner: this.user.coinbase,
        quantity:this.form.quantity
      }
      let result = await this.burnToken(asset);
      if(result.error){
        this.error.burn = result.error;
        this.step.burn = 0;
      }else{
        this.error.burn = ""
        this.step.burn = 2;
        this.closed();
        this.$emit("confirm");
      }
    },
    async burnToken(asset){
      if(asset.type==3){
        return await this.$sdk.burnAsset(asset)
      }else if(asset.type==2){
        return await this.$sdk.burnAsset1155(asset)
      }
    },
    closed(){
      this.confirm = false;
      this.form = {
        quantity: 1,
      }
      this.formError = {
        all: "",
        quantity: "",
      }

      this.step = {
        burn: 0,
      }
      this.error = {
        all: "",
        burn: ""
      }
      this.$refs.burn.close()
    },
    close(){
      this.closed();
      this.$emit("close");
    },
    
  },
}

</script>
<style lang="scss" scoped>
</style>

