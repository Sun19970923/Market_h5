<template>
  <uni-popup  class="popupClass" ref='cancel_bid' type="bottom"  >
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
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process"  >
        <view class="step-info" >
          <view class="text" >
              <text>{{$t('dialog.cancelABid')}}</text>
          </view>
        </view>
        <view class="confirm-text">
          {{$t('dialog.sureCancelBid')}}
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" type="success" :loading="step==1">{{$t('dialog.confirm')}}</button>
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
              <text>{{$t('dialog.cancelBid')}}</text>
          </view>
          <text
            v-if="step.cancel!= 1"
            :class="step.cancel== 2 ? 'finish': ''"
            class="step iconfont icon-seleted"
          ></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>

        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onCancel" type="success" v-if="step.cancel== 0">{{$t('dialog.cancel')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.cancel== 1">{{$t('dialog.inProgress')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.cancel">{{ error.cancel }}</view>
      </view>
    </view>
</view>
  </uni-popup>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  name: "CancelBid",
  data: function(){
    return {
      visible: this.show,
      confirm: false,
      formError:{
        all: "",
        cancel: "",
      },
      step: {
        cancel: 0,
      },
      error: {
        all: "",
        cancel: "",
      },
      order: {}
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
    bid: {
      type: Object,
      default: ()=>{},
    }
  },
  watch:{
    show(val){
      this.visible = this.show;
      if(this.visible==true){
      this.$refs.cancel_bid.open()
      }
    },
  },
  computed: {
    user(){
      return this.$store.state.user;
    },
    config(){
      return this.$store.state.config;
    }
  },
  methods: {
    async onSubmit(){
      this.confirm = true;
      let that = this;
      setTimeout(async function(){
        await that.onCancel();
      }, 100);
    },
    async onCancel(){
      this.step.cancel = 1;
      let order = await this.getOrder();
      if(order.error){
        this.error.all = order.error
        this.step.cancel = 0;
        return;
      }
      let result = await this.cancelBid()
      if(result.error){
        this.error.cancel = result.error;
        this.step.cancel = 0;
      }else{
        this.error.cancel = "";
        this.step.cancel = 2;
        this.closed();
        this.$emit("confirm");
      }
    },
    async cancelBid(){
      let sellValue = new BigNumber(this.order.sellValue)
      sellValue = sellValue.multipliedBy(new BigNumber(10).exponentiatedBy(this.order.payToken.decimals))
      var order = {
        owner: this.order.owner,
        sellToken: this.order.sellToken,
        sellTokenId: this.order.sellTokenId,
        sellType: this.order.sellType,
        sellValue: sellValue,
        buyToken: this.order.buyerToken,
        buyTokenId: this.order.buyerTokenId,
        buyType: this.order.buyerType,
        buyValue: this.order.buyerValue,
        salt: this.order.salt,
        exchangeAddress: this.config.NftExchange,
      }
      return await this.cancelOrder(order)
    },
    async cancelOrder(order){
      let that = this;
      return new Promise(async function(resolve, reject){
        let result = await that.$sdk.cancelOrder(that.user.coinbase, order);
        let txResult = await that.$web3.getTransaction(result.tx);
        if(txResult.error){
          return resolve(txResult)
        }
        resolve(txResult);
      });
    },
    async getOrder(){
      return new Promise((resolve, reject) => {
        var data = {
          caddress: this.nft.address,
          tokenId: this.nft.tokenId,
          owner: this.bid.address,
          type: this.$sdk.valueOrderType("BID"),
        }
        var that = this;
        this.$api("order.get", data).then(res=>{
          if(that.$tools.checkResponse(res)){
            that.order = res.data;
            that.order.payToken = that.$store.getters.payToken(res.data.sellToken)
            resolve(res.data);
          }else{
            resolve({error: res.errmsg})
          }
        });
      });
    },
    closed(){
      this.confirm = false;
      this.formError = {
        all: "",
        cancel:"",
      }
      this.step = {
        cancel: 0,
      }
      this.error = {
        all: "",
        cancel: "",
      }
      this.order = {}
      this.$refs.cancel_bid.close()
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

