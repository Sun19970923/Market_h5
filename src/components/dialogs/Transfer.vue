<template>
  <uni-popup  class="popupClass" ref='transfer' type="bottom">
    <view class="mainSection">
      <view class="clubart-dialog-title">
        <view class="left">
          <text>{{ nft.name }}</text>
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
              <text>{{$t('dialog.transferCollection')}}</text>
          </view>
        </view>
        <view class="input-group">
          <view class="input-info">
            <view class="tip">{{$t('dialog.transferAddress')}}</view>
            <input 
              class="my-input-class"
              placeholder="0x"
              v-model="form.address"
                />
 
            <view class="input-error" v-if="formError.address">{{ formError.address }}</view>
          </view>
        </view>

        <view class="input-group" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
          <view class="input-info">
            <view class="tip">
              <text>{{$t('dialog.burnQuantity')}}</text>
              <text class="gray-font">({{ asset.quantity}} {{$t('dialog.available')}})</text>
            </view>
            <input 
              class="my-input-class"
              placeholder="quantity"
              v-model.number="form.quantity"
            />
            <view class="input-error" v-if="formError.quantity">{{ formError.quantity}}</view>
          </view>
        </view>

        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" type="success" :loading="confirm">{{$t('dialog.transfer')}}</button>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn cancel" size="mini" @click="close" type="info">{{$t('dialog.cancel')}}</button>
        </view>
      </view>
    </view>

    <view class="clubart-dialog-body" v-else>
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process">
        <view class="step-info">
          <view class="text" >
              <text>{{$t('dialog.transferCollection')}}</text>
          </view>
          <text
            v-if="step.transfer!= 1"
            :class="step.transfer == 2 ? 'finish': ''"
            class="step iconfont icon-seleted"
          ></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>

        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onTransfer" type="success" v-if="step.transfer== 0">{{$t('dialog.transfer')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.transfer== 1">{{$t('dialog.inProgress')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.transfer">{{ error.transfer}}</view>
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
        address: '',
        quantity: 1,
      },
      formError: {
        all: "",
        address: "",
        quantity: "",
      },
      step:{
        transfer: 0,
      },
      error:{
        all: "",
        transfer: "",
      }
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
        this.$refs.transfer.open()
      }
    },
  },
  computed:{
    user(){
      return this.$store.state.user;
    },
  },
  methods: {
    checkForm(){
      let error = false;
      if(!this.form.address){
        this.formError.address = this.$t("form.noAddress")
        error = true;
      }
      if(this.form.address.toLowerCase()==this.$store.state.user.coinbase.toLowerCase()){
        this.formError.address = this.$t("form.own")
        error = true;
      }
      if(!this.form.quantity){
        this.formError.address = this.$t("form.noQuantity")
        error = true;
      }
      if(parseFloat(this.form.quantity) > parseFloat(this.asset.quantity)){
        error = true;
        this.formError.quantity = this.$t("form.exceedValue");
      }
      return !error;
    },
    onSubmit(){
      if(!this.checkForm()) return;
      this.confirm = true;
      let that = this;
      setTimeout(async function(){
        await that.onTransfer()
      }, 100)
    },
    async onTransfer(){
      this.step.transfer = 1;
      let asset = {
        address: this.nft.address,
        tokenId: this.nft.tokenId,
        type: this.nft.type,
        to: this.form.address,
        quantity:this.form.quantity
      }
      let result = await this.transferToken(asset);
      if(result.error){
        this.error.transfer = result.error;
        this.step.transfer = 0;
      }else{
        this.error.transfer = "";
        this.step.transfer = 2;
        this.closed();
        this.$emit("confirm")
      }
    },
    async transferToken(asset){
      if(asset.type==3){
        return await this.$sdk.transferAsset(asset, this.user.coinbase, asset.to);
      }else if(asset.type==2){
        return await this.$sdk.transferAsset1155(asset, this.user.coinbase, asset.to);
      }
    },
    closed(){
      this.confirm = false;
      this.form = {
        address: '',
        quantity: 1,
      }
      this.formError = {
        all: "",
        address: "",
        quantity: ""
      }
      this.step = {
        transfer: 0,
      }
      this.error = {
        all: "",
        transfer: "",
      }
      this.$refs.transfer.close()
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

