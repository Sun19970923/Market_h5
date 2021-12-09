<template>
  <uni-popup  @change="changeFunction" class="popupClass" ref='sale' type="bottom"  >
     <view class="mainSection">
      <view class="clubart-dialog-title">
        <view class="left">
          <text>{{nft.name}}</text>
        </view>
        <view class="right" @click="close">
          <img class="close-img" src = "@/static/images/Popup/pop_shut.png">
        </view>
      </view>

    <view class="clubart-dialog-body" v-if="!confirm">
      <view class="all-error" v-if="formError.all"> {{ formError.all }} </view>
      <view class="process">
        <view class="step-info" >
          <view class="text" >
            <text>{{$t('dialog.putOnSale')}}</text>
          </view>
        </view>
        <view class="input-group">
          <view class="input-info">
            <view class="tip">{{ $t('dialog.salePrice')}}</view>

            <my-input :placeholder="'0.0'" type="number" v-if="!asset.onsell"  v-model="form.price" :payAddress="form.payAddress"
                :payTokens="payTokens"  :isSelect="true" @payAddressChange="payAddressChange">
            </my-input>
            <my-input :placeholder="'0.0'" type="number" v-else  v-model="form.price"
              :payAddress="form.payAddress">
            </my-input>

            <view class="input-error" v-if="formError.price">{{ formError.price}}</view>
            <view class="stip">
              <view class="stip-item"> {{ $t('dialog.serviceFee') }} <text class="bfont">{{serviceFee}}%</text> </view>
              <view class="stip-item">{{ $t('dialog.receive') }}
                <text class="bfont"> {{receive.receive}}{{ payToken?payToken.symbol:'' }}</text>
                ${{receive.usdt}}
              </view>
            </view>
          </view>

          <view class="input-info" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
            <view class="tip">{{ $t('dialog.enterQuantity') }}<text class="ml10 gray-font">( {{asset.quantity}} {{ $t('dialog.available') }} )</text></view>
            <input 
              class="my-input-class"
              placeholder="0.0"
              type="number"
              v-model="form.quantity"
            />
            <view class="input-error" v-if="formError.quantity">{{formError.quantity}}</view>
          </view>

        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" v-if="!asset.onsell" type="success" :loading="confirm">{{ $t('dialog.confirm') }}</button>
          <button class="nft-dialog-btn" size="mini" @click="onSubmit" v-else type="success" :loading="confirm">{{ $t('dialog.change') }}</button>
        </view>
      </view>
    </view>

    <view class="clubart-dialog-body" v-else>
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process">
        <view class="step-info">
          <view class="text" >
            <text>{{ $t('dialog.approveCollection') }}</text>
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
          <button class="nft-dialog-btn" size="mini" @click="onApprove" type="success" v-if="step.approve == 0">{{ $t('dialog.approve') }}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.approve == 1">{{ $t('dialog.inProgress') }}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{ $t('dialog.done') }}</button>
        </view>
        <view class="process-error" v-if="error.approve">{{ error.approve }}</view>
      </view>

      <view class="process">
        <view class="step-info" >
          <view class="text" >
            <text >{{ $t('dialog.signsSale') }}</text>
          </view>
          <text
              v-if="step.sale != 1"
              :class="step.sale == 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn disable" size="mini"  disabled type="info" v-if="step.approve != 2">{{ $t('dialog.sale') }}</button>
          <button class="nft-dialog-btn" size="mini" @click="onSale" type="success" v-else-if="step.sale ==0">{{ $t('dialog.sale') }}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.sale == 1"> {{ $t('dialog.inProgress') }}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{ $t('dialog.done') }}</button>
        </view>
        <view class="process-error" v-if="error.sale">{{ error.sale }}</view>
      </view>

    </view>
</view>
  </uni-popup>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  name: "Sale",
  data: function(){
    let paytoken = this.$store.getters.defaultSalePayToken();
    return {
      visible: this.show,
      confirm: false,
      form: {
        price: '',
        payAddress: paytoken.address ||'',
        quantity: '',
      },
      formError:{
        all: "",
        price: "",
        quantity: "",
      },
      step: {
        approve: 0,
        sale: 0,
      },
      error: {
        all: "",
        approve: "",
        sale: "",
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
    asset: {
      type: Object,
      default: ()=>{
        return{
          quantity:''
        }
      },
    },
  },
  watch:{
    show(val){
      this.visible = this.show;
      if(this.visible==true){
        this.$refs.sale.open()
      }
    },
  },
  computed:{
    user(){
      return this.$store.state.user;
    },
    config(){
      return this.$store.state.config;
    },
    payTokens (){
      return this.$store.state.payTokens;
    },
    payToken(){
      if(!this.form.payAddress)return '';
      this.form.payAddress = this.$store.getters.payToken(this.form.payAddress).address;
      return this.$store.getters.payToken(this.form.payAddress);
    },
    serviceFee(){
      let fee = this.$tools.decimal(this.$store.state.config.sellerFee / 100);
      return fee;
    },
    receive(){
      let price = this.$tools.str2num(parseInt(this.form.price));
      if(!price||!this.form.payAddress) return { receive: 0, usdt: 0}
      if(this.$sdk.keyAssetType(this.nft.type) == 'ERC721'){
        this.form.quantity=1
      }
      price = price * this.form.quantity;
      let payToken = this.$store.getters.payToken(this.form.payAddress);
      let receive = this.$tools.decimal(price - (price * this.serviceFee / 100), 6);
      let usdt = this.$tools.decimal(payToken?payToken.rate * receive:'');
      return {receive, usdt}
    },
  },
  methods: {
    payAddressChange(param){
      this.form.payAddress = param;
    },
    changeFunction(e){
      if(e.show==true){
        this.onOpen()
      }
    },
    onOpen(){
      if(!this.asset.onsell){
        if(this.$sdk.keyAssetType(this.nft.type) == 'ERC721'){
          this.form.quantity = '1';
        }else{
          this.form.quantity = '';
        }
      }else{
        this.form.quantity = this.asset.sellQuantity;
        this.form.payAddress = this.asset.payTokenAddress;
        this.form.price = this.$tools.singlePrice(this.asset.price, this.asset.sellValue);
      }
    },
    checkForm(){
      var error = false;
      if(!parseFloat(this.form.price)){
        error = true;
        this.formError.price = this.$t("form.noPrice");
      }
      if(this.asset.onsell && (parseFloat(this.form.price) >= parseFloat(
        this.$tools.singlePrice(this.asset.price, this.asset.sellValue)
      ))){
        error = true
        this.formError.price = this.$t("form.granterPrice");
      }
      if(!this.form.quantity){
        error = true;
        this.formError.quantity = this.$t("form.noQuantity");
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
        await that.onApprove();
      }, 100);
    },
    async getOrder(){
      return new Promise((resolve, reject) => {
        var data = {
          caddress: this.nft.address,
          tokenId: this.nft.tokenId,
          owner: this.asset.address,
          type: this.$sdk.valueOrderType("SALE"),
        }
        let that = this;
        this.$api("order.get", data).then(res => {
          if(that.$tools.checkResponse(res)){
            that.order = {
              address: res.data.sellToken,
              tokenId: res.data.sellTokenId,
              type: res.data.sellType,
              payToken: that.$store.getters.payToken(res.data.buyerToken),
              salt: res.data.salt,
            }
            resolve(true)
          }else{
            resolve({error: res.errmsg});
          }
        });
      });
    },
    async onApprove(){
      this.step.approve = 1;
      if(!this.asset.onsell){
        let payToken = this.$store.getters.payToken(this.form.payAddress);
        this.order = {
          address: this.nft.address,
          tokenId: this.nft.tokenId,
          type: this.nft.type,
          payToken: payToken,
          salt: '0',
        }
      }else{
        let result = await this.getOrder();
        if(result.error){
          this.error.all = result.error;
          this.step.approve = 0;
          return;
        }
      }
      let approved = await this.setApproveAll();
      if(approved.error){
        this.error.approve = approved.error;
        this.step.approve = 0;
      }else{
        this.error.approve = ""
        this.step.approve = 2;
      }
    },
    async setApproveAll(){
      let order = {
        type: this.order.type,
        address: this.order.address,
        tokenId: this.order.tokenId,
      }
      let isApproved = await this.$sdk.isApprovedForAll(order, this.user.coinbase, this.config.TransferProxy);
      if(typeof isApproved == 'object' && isApproved.error){
        return isApproved;
      }
      if(isApproved) return true;
      let result = await this.$sdk.setApprovalForAll(order, this.user.coinbase, this.config.TransferProxy, true);
      return result;
    },
    async onSale(){
      this.step.sale = 1;
      let order = {
        ...this.order,
        price: this.form.price,
        sellerFee: this.config.sellerFee
      }
      let result = await this.saleToken(order)
      if(result.error){
        this.error.sale = result.error;
        this.step.sale = 0;
      }else{
        this.error.sale = "";
        this.step.sale = 2;
        this.closed();
        this.$emit("confirm")
      }
    },
    async saleToken(order){
      return new Promise((resolve, reject) => {
        let buyValue = new BigNumber(this.form.price);
        buyValue = buyValue.multipliedBy(new BigNumber(this.form.quantity)).toFixed();
        var data = {
          owner: this.user.coinbase,
          sellToken: order.address,
          sellTokenId: order.tokenId,
          sellValue: this.form.quantity,
          sellType: order.type,
          buyToken: order.payToken.address,
          buyTokenId: "0",
          buyValue: buyValue,
          buyType: order.payToken.type,
          salt: order.salt,
          type:this.$sdk.valueCommonType("SALE")
        }
        let that = this;
        this.$api("order.prepare", data).then(async function(res){
          if(that.$tools.checkResponse(res)){
            let message = res.data.message;
            if(message.startsWith('0x')){
              message = message.slice(2, message.length)
            }
            let salt = res.data.salt;
            let signature = "";
            try{
              signature = await that.$web3.sign(message, that.user.coinbase);
              if(signature.error){
                return resolve(signature);
              }
            }catch(e){
              return resolve({error: e.message})
            }
            var _data = {
              type: !that.asset.onsell ? that.$sdk.valueCommonType("SALE") : that.$sdk.valueCommonType('EDIT_SALE'),
              owner: data.owner,
              sellToken: data.sellToken,
              sellTokenId: data.sellTokenId,
              sellValue: data.sellValue,
              sellType: data.sellType,
              buyToken: data.buyToken,
              buyTokenId: data.tokenId ? data.tokenId : 0,
              buyValue: data.buyValue,
              buyType: data.buyType,
              salt: salt,
              message: message,
              signature: signature,
            }
            that.$api("order.add", _data).then(function(res){
              if(that.$tools.checkResponse(res)){
                that.$tools.message(that.$t('request.saleSuccess'), "success");
                resolve(res);
              }else{
                resolve({error: res.errmsg});
              }
            });
          }else{
            that.$tools.message(res.errmsg);
            resolve({error: res.errmsg})
          }
        });
      });
    },
    closed(){
      let paytoken = this.$store.getters.defaultSalePayToken();
       this.step = {
        approve: 0,
        sale: 0,
      }
      this.form = {
        price: '',
        payAddress: paytoken.address,
        quantity: '',
      }
      this.formError = {
        all: "",
        price: "",
        quantity: "",
      }
      this.error = {
        all: "",
        approve: "",
        sale: "",
      }
      this.confirm = false;
      this.$refs.sale.close()
    },
    close(){
      this.closed();
      this.$emit("close");
    },
  },
}

</script>
<style lang="scss" scoped>
.wrap {
  flex-wrap: wrap;
}
</style>

