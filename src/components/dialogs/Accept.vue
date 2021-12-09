<template>
  <uni-popup @change="changeFunction"  class="popupClass" ref='accept' type="bottom"  >
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
              <text>{{$t('dialog.accept')}}</text>
          </view>
        </view>
        <view class="input-group">
          <view class="input-info">
            <view class="tip">{{$t('dialog.bidPrice')}}</view>
            <my-input :disabled="true" :placeholder="'0.0'" type="number"  v-model="form.price"
                :payAddress="payToken?payToken.address:''" >
            </my-input>
            <view class="stip" v-if="payToken">
              <view class="stip-item"> {{$t('dialog.serviceFee')}} <text class="bfont">{{serviceFee}}%</text> </view>
              <view class="stip-item">{{$t('dialog.receive')}}
                <text class="bfont"> {{receive.receive}} {{payToken.symbol}}</text>
                ${{receive.usdt}}
              </view>
            </view>
          </view>
          <view class="input-info" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
            <view class="tip">
              <text>{{$t('dialog.burnQuantity')}}</text>
              <text class="gray-font">({{ availableQuantity }} {{$t('dialog.available')}})</text>
            </view>
            <input 
              class="my-input-class"
              placeholder="0.0"
              type="number"
              v-model="form.quantity"
            />
            <view class="input-error" v-if="formError.quantity">{{ formError.quantity}}</view>
          </view>
        </view>

        <view class="confirm-text">
          {{$t('dialog.acceptNft')}}
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" type="success" :loading="confirm">{{$t('dialog.accept')}}</button>
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
              <text>{{$t('dialog.approveCollection')}}</text>
          </view>
          <text
            v-if="step.approve != 1"
            :class="step.approve== 2 ? 'finish': ''"
            class="step iconfont icon-seleted"
          ></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>

        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onApprove" type="success" v-if="step.approve == 0">{{$t('dialog.approve')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.approve == 1">{{$t('dialog.inProgress')}}</button>
          <button class="nft-dialog-btn disable" disabled size="mini" type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.approve">{{ error.approve }}</view>
      </view>

      <view class="process">
        <view class="step-info" >
          <view class="text" >
              <text >{{$t('dialog.signAccept')}}</text>
          </view>
          <text 
              v-if="step.accept!= 1"
              :class="step.accept== 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn disable" disabled size="mini" type="info" v-if="step.approve != 2">{{$t('dialog.accept')}}</button>
          <button class="nft-dialog-btn" @click="onAccept" size="mini" type="success" v-else-if="step.accept==0">{{$t('dialog.accept')}}</button>
          <button class="nft-dialog-btn disable" disabled size="mini" type="info" v-else-if="step.accept== 1">{{$t('dialog.inProgress')}}</button>
          <button class="nft-dialog-btn disable" disabled size="mini" type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.accept">{{ error.accept }}</view>
      </view>

    </view>
     </view>
  </uni-popup>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  data: function(){
    return {
      visible: this.show,
      confirm: false,
      form: {
        price: "",
        quantity: 1,
      },
      formError: {
        quantity: '',
      },
      step:{
        approve: 0,
        accept: 0,
      },
      error:{
        all: "",
        approve: 0,
        accept: "",
      },
      order: {},
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
    },
    myAsset: {
      type: Object,
      default: ()=>{},
    },
  },
  watch:{
    show(val){
      this.visible = this.show;
      if(this.visible==true){
        this.$refs.accept.open()
      }
    },
  },
  computed:{
    price(){
      if(!this.bid)return '';
      return this.$tools.singlePrice(this.bid.sellValue, this.bid.buyerValue);
    },
    availableQuantity(){
      if(!this.myAsset || !this.bid) return 0;
      if(!this.myAsset.quantity || !this.bid.bidQuantity) return 0;
      return this.myAsset.quantity < this.bid.bidQuantity ? this.myAsset.quantity : this.bid.bidQuantity;
    },
    user(){
      return this.$store.state.user;
    },
    config(){
      return this.$store.state.config;
    },
    serviceFee(){
      let fee = this.$tools.decimal(this.$store.state.config.sellerFee / 100, 2);
      return fee;
    },
    payToken(){
      if(!this.bid||!this.bid.sellToken) return '';
      return this.$store.getters.payToken(this.bid.sellToken)
    },
    receive(){
      let price = this.$tools.str2num(this.price);
      if(!price || !this.payToken){
        return {receive: 0, usdt: 0}
      }

      price = price * this.form.quantity;
      let payToken = this.payToken;
      let receive = this.$tools.decimal(price - (price * this.serviceFee / 100), 6)
      let usdt = this.$tools.decimal(payToken.rate * receive);
      return {receive, usdt}
    },
 
  },
  methods: {
    changeFunction(e){
      if(e.show == true){
        this.onOpen();
      }
    },
    onOpen(){
      this.form.price = this.$tools.singlePrice(this.bid.sellValue, this.bid.buyerValue);
    },
    checkForm(){
      let error = false;
      if(!this.form.quantity){
        this.formError.quantity = "no quantity"
        error = true;
      }
      if(parseFloat(this.form.quantity) > parseFloat(this.availableQuantity)){
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
        await that.onApprove();
      }, 100);
    },
    async onApprove(){
      this.step.approve = 1;
      let order = await this.getOrder();
      if(order.error){
        this.error.all = order.error;
        this.step.approve = 0;
        return;
      }
      let approved = await this.setApproveAll()
      if(approved.error){
        this.error.approve = approved.error;
        this.step.approve = 0;
      }else{
        this.error.approve = "";
        this.step.approve = 2;
      }
    },
    async setApproveAll(){
      let order = {
        type: this.order.buyerType,
        address: this.order.buyerToken,
        tokenId: this.order.buyerTokenId,
      }
      let isApproved = await this.$sdk.isApprovedForAll(order, this.user.coinbase, this.config.TransferProxy);
      if(typeof isApproved == 'object' && isApproved.error){
        return isApproved;
      }
      if(isApproved) return true;
      let result = await this.$sdk.setApprovalForAll(
        order,
        this.user.coinbase, 
        this.config.TransferProxy,
        true
      );
      return result;
    },
    async onAccept(){
      this.step.accept = 1;
      let result = await this.acceptOrder();
      if(result.error){
        this.error.accept = result.error;
        this.step.accept = 0;
      }else{
        this.error.accept = "";
        this.step.accept = 2;
        this.closed();
        this.$emit("confirm");
      }
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
    async acceptOrder(){
      let sellValue = new BigNumber(this.order.sellValue)
      sellValue = sellValue.multipliedBy(new BigNumber(10).exponentiatedBy(this.order.payToken.decimals))
      let amount = new BigNumber(this.form.quantity)
      amount = amount.multipliedBy(sellValue)
      amount = amount.dividedBy(new BigNumber(this.order.buyerValue)).toFixed();
      var order = {
        owner: this.order.owner,
        sellToken: this.order.sellToken,
        sellTokenId: this.order.sellTokenId,
        sellType: this.order.sellType,
        sellValue: sellValue.toFixed(),
        buyToken: this.order.buyerToken,
        buyTokenId: this.order.buyerTokenId,
        buyType: this.order.buyerType,
        buyValue: this.order.buyerValue,
        salt: this.order.salt,
        signature: this.order.signature,
        caddress: this.nft.address,
        tokenId: this.nft.tokenId,
        type: this.$sdk.valueOrderType('BID'),
        amount: amount,
        buyerFee: this.config.buyerFee,
        sellerFee: this.config.sellerFee,
        buyer: '0x0000000000000000000000000000000000000000',
        value: '0',
      }
      return await this.exchangeToken(order);
    },
    async exchangeToken(data){
      return new Promise((resolve, reject) => {
        var that = this;
        this.$api("order.buyerFee", {
          token: data.caddress,
          tokenId: data.tokenId,
          owner: data.owner,
          type: data.type,
          salt: data.salt,
        }).then(async function(res){
          if(that.$tools.checkResponse(res)){
            data.buyerFeeSig = {
              r: res.data.r,
              s: res.data.s,
              v: res.data.v
            }
            data.exchangeAddress = that.config.NftExchange;
            let result = await that.$sdk.exchangeOrder(that.user.coinbase, data);
            if(result.error){
              return resolve(result);
            }
            let txResult = await that.$web3.getTransaction(result.tx);
            if(txResult.error){
              return resolve(txResult)
            }
            resolve(txResult);
          }else{
            resolve({error: res.errmsg});
          }
        });
      });
    },
    closed(){
      this.confirm = false;
      this.form = {
        quantity: 1,
      }
      this.formError = {
        quantity: '',
      }
      this.step = {
        approve: 0,
        accept: 0,
      }
      this.error = {
        all: '',
        approve: '',
        accept: '',
      }
      this.order = {};
      this.$refs.accept.close()
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

