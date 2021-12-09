<template>
  <uni-popup @change="changeFunction" class="popupClass" ref='buy' type="bottom">
    <view class="mainSection">
      <view class="clubart-dialog-title">
        <view class="left">
          <text>{{nft.name}}</text>
        </view>
        <view class="right" @click="close">
          <img class="close-img" src="@/static/images/Popup/pop_shut.png">
        </view>
      </view>

      <view class="clubart-dialog-body" v-if="!confirm">
        <view class="all-error" v-if="formError.all"> {{ formError.all }} </view>
        <view class="process">
          <view class="step-info">
            <view class="text">
              <text>{{$t('dialog.buy')}}</text>
            </view>
          </view>

          <view class="input-group">
            <view class="input-info">
              <view class="tip">{{$t('dialog.salePrice')}}</view>
              <my-input :placeholder="'0.0'" type="number" :disabled="true" v-model="price"
                :payAddress="asset&&asset.payToken ?  asset.payToken.address: ''"></my-input>
              <view class="stip" v-if="asset&&asset.payToken?asset.payToken:''">
                <view class="stip-item">{{$t('dialog.yourBalance')}} <text
                    class="bfont">{{ pay.balance }} {{asset.payToken.symbol}}</text> </view>
                <view class="stip-item">{{$t('dialog.serviceFee')}}<text
                    class="bfont">{{serviceFee}}%</text> </view>
                <view class="stip-item flex wrap">{{$t('dialog.pay')}}
                  <text class="bfont"> {{pay.pay}} {{asset.payToken.symbol}}</text>
                  ${{pay.usdt}}
                </view>
              </view>
            </view>

            <view class="input-info" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
              <view class="tip">{{$t('dialog.buyQuantity')}}                 
              <text class="ml10 gray-font">({{asset?asset.sellQuantity:''}} {{$t('dialog.available')}})</text>
              </view>
              <input class="my-input-class" placeholder="0" type="number" v-model="form.quantity" />
              <view class="input-error" v-if="formError.quantity">{{ formError.quantity}}</view>
            </view>
          </view>
          <view class="input-error" v-if="formError.balance">{{ formError.balance}}</view>
          <view class="process-btn">
            <button class="nft-dialog-btn" size="mini" @click="onSubmit" type="success"
              :loading="confirm">{{$t('dialog.buy')}}
            </button>
          </view>
          <view class="process-btn">
            <template v-if="pay && parseFloat(pay.pay) > parseFloat(pay.balance)">
              <button class="nft-dialog-btn cancel disable" disabled size="mini" type="info"
                @click.native="close">{{$t('dialog.cancel')}}
              </button>
            </template>
            <template v-else>
              <button class="nft-dialog-btn cancel" size="mini" type="info"
                @click.native="close">{{$t('dialog.cancel')}}
              </button>
            </template>
          </view>
        </view>
      </view>

      <view class="clubart-dialog-body" v-else>
        <view class="all-error" v-if="error.all"> {{ error.all }} </view>

        <view class="process" v-if="isERC20">
          <view class="step-info">
            <view class="text">
              <text>{{$t('dialog.approveCollection')}}</text>
            </view>
            <text v-if="step.approve != 1" :class="step.approve== 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></text>
            <view class="step loading" v-else>
              <img class="loading-animation" src="@/static/images/Popup/loading.png" />
            </view>
          </view>
          <view class="process-btn">
            <button class="nft-dialog-btn" size="mini" @click="onApprove" type="success"
              v-if="step.approve == 0">{{$t('dialog.approve')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else-if="step.approve == 1">{{$t('dialog.inProgress')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else>{{$t('dialog.done')}}</button>
          </view>
          <view class="process-error" v-if="error.approve">{{ error.approve }}</view>
        </view>

        <view class="process">
          <view class="step-info">
            <view class="text">
              <text>{{$t('dialog.stb')}}</text>
            </view>
            <text v-if="step.buy!= 1" :class="step.buy== 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></text>
            <view class="step loading" v-else>
              <img class="loading-animation" src="@/static/images/Popup/loading.png" />
            </view>
          </view>

          <view class="process-btn" v-if="!isERC20">
            <button class="nft-dialog-btn" size="mini" @click="onBuy" type="success"
              v-if="step.buy==0">{{$t('dialog.buy')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else-if="step.buy== 1">{{$t('dialog.inProgress')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else>{{$t('dialog.done')}}</button>
          </view>

          <view class="process-btn" v-else>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-if="step.approve != 2">{{$t('dialog.buy')}}</button>
            <button class="nft-dialog-btn" size="mini" @click="onBuy" type="success"
              v-else-if="step.buy==0">{{$t('dialog.buy')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else-if="step.buy== 1">{{$t('dialog.inProgress')}}</button>
            <button class="nft-dialog-btn disable" size="mini" disabled type="info"
              v-else>{{$t('dialog.done')}}</button>
          </view>
          <view class="process-error" v-if="error.buy">{{ error.buy}}</view>
        </view>
      </view>

    </view>
  </uni-popup>
</template>

<script>
import BigNumber from "bignumber.js";
export default {
  data: function () {
    return {
      visible: this.show,
      confirm: false,
      form: {
        price: "",
        quantity: 1,
      },
      formError: {
        all: "",
        quantity: "",
        balance: ""
      },
      step:{
        approve: 0,
        buy: 0,
      },
      error: {
        all: "",
        approve: "",
        buy: "",
      },
      order: {},
    };
  },
  props: {
    show: {
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
        return {
          price:1,
          sellValue:1
        }
      },
    },
  },
  watch: {
    show(val) {
      this.visible = this.show;
      console.log(this.asset)
      if (this.visible == true) {
        this.$refs.buy.open();
      }
    },
  },
  computed: {
    price(){
      if(!this.asset)return '';
      return this.$tools.singlePrice(this.asset.price, this.asset.sellValue);
    },
    user() {
      return this.$store.state.user;
    },
    config() {
      return this.$store.state.config;
    },
    isERC20(){
      let payToken = this.asset.payToken;
      if(!payToken) return false;
      return payToken.erc20;
    },
    serviceFee(){
      let fee = this.$tools.decimal(this.$store.state.config.buyerFee / 100, 2);
      return fee;
    },
    pay(){
      if(!this.asset)return;
      let price = this.$tools.str2num(this.price);
      let payToken = this.asset.payToken;
      if(!price || !payToken){
        return {pay: 0, usdt: 0, balance: 0}
      }
      price = price * this.form.quantity;

      let balance = this.$store.getters.getBalance(payToken.address);
      balance = this.$tools.decimal(balance, 4)
      let pay = this.$tools.decimal(price + (price * this.serviceFee / 100));
      let usdt = this.$tools.decimal(payToken.rate * pay);
      return {pay, usdt, balance}
    },
  },
  methods: {
    changeFunction(e) {
      if (e.show == true) {
        this.onOpen();
      }
    },
    onOpen() {
      this.form.price = this.$tools.singlePrice(
        this.asset.price,
        this.asset.sellValue
      );
    },
    checkForm() {
      let error = false;
      if (!parseInt(this.form.quantity)) {
        this.formError.quantity = this.$t("form.noQuantity");
        error = true;
      }
      if(parseFloat(this.form.quantity) > parseFloat(this.asset.sellQuantity)){
        error = true;
        this.formError.quantity = this.$t("form.exceedValue");
      }
      if(this.pay.balance < this.pay.pay) {
        error = true;
        this.formError.balance = this.$t("dialog.noBalance");
      }
      return !error;
    },
    async onSubmit() {
      if (!this.checkForm()) return;
      this.confirm = true;
      let that = this;
      setTimeout(async function(){
        if(that.isERC20){
          await that.onApprove();
        }else{
          await that.onBuy();
        }
      }, 100);
    },
    async getOrder() {
      return new Promise((resolve, reject) => {
        var data = {
          caddress: this.nft.address,
          tokenId: this.nft.tokenId,
          owner: this.asset.address,
          type: this.$sdk.valueOrderType("SALE"),
        };
        var that = this;
        this.$api("order.get", data).then((res) => {
          if (that.$tools.checkResponse(res)) {
            that.order = res.data;
            that.order.payToken = that.$store.getters.payToken(
              res.data.buyerToken
            );
            resolve(res.data);
          } else {
            resolve({ error: res.errmsg });
          }
        });
      });
    },
    async onApprove(){
      this.step.approve = 1;
      let result = await this.approvePayToken();
      if(result.error){
        this.error.approve = result.error;
        this.step.approve = 0;
      }else{
        this.error.approve = "";
        this.step.approve = 2;
      }
    },
    async approvePayToken(){
      let order = {
        address: this.asset.payToken.address,
        type: this.asset.payToken.type,
      }
      let isAllowance = await this.$sdk.allowancePayToken(order,
        this.user.coinbase,
        this.config.ERC20TransferProxy);
      if(isAllowance.error){
        return isAllowance;
      }
      isAllowance = isAllowance.toString();
      if(isAllowance != '0' && isAllowance){
        return true;
      }
      return await this.$sdk.approvePayToken(order,
        this.user.coinbase,
        this.config.ERC20TransferProxy);
    },
    async onBuy(){
      if(this.isERC20 && this.step.approve != 2) return;
      this.step.buy = 1;
      let order = await this.getOrder();
      if (order.error) {
        this.error.all = order.error;
        this.step.buy = 0;
        return;
      }
      let result = await this.buyOrder();
      if (result.error) {
        this.error.buy = result.error;
        this.step.buy = 0;
      } else {
        this.error.buy = "";
        this.step.buy = 2;
        this.closed();
        this.$emit("confirm");
      }
    },
    async buyOrder() {
      let value = "0";
      if (this.$sdk.keyAssetType(this.order.buyerType) == "ETH" || this.$sdk.keyAssetType(this.order.buyerType) == "ERC20") {
        let realValue = new BigNumber(this.order.buyerValue);
        realValue = realValue.dividedBy(new BigNumber(this.order.sellValue));
        realValue = realValue.multipliedBy(new BigNumber(this.form.quantity));
        let fee = realValue.multipliedBy(new BigNumber(this.config.sellerFee));
        fee = fee.dividedBy(new BigNumber(10000));
        value = realValue.plus(fee).toFixed();
      }
      let buyerValue = new BigNumber(this.order.buyerValue);
      buyerValue = buyerValue.multipliedBy(
        new BigNumber(10).exponentiatedBy(this.order.payToken.decimals)
      );
      var order = {
        owner: this.order.owner,
        sellToken: this.order.sellToken,
        sellTokenId: this.order.sellTokenId,
        sellType: this.order.sellType,
        sellValue: this.order.sellValue,
        buyToken: this.order.buyerToken,
        buyTokenId: this.order.buyerTokenId,
        buyType: this.order.buyerType,
        buyValue: buyerValue.toFixed(),
        salt: this.order.salt,
        signature: this.order.signature,
        caddress: this.nft.address,
        tokenId: this.nft.tokenId,
        type: this.$sdk.valueOrderType("SALE"),
        amount: this.form.quantity,
        buyerFee: this.config.buyerFee,
        sellerFee: this.config.sellerFee,
        buyer: "0x0000000000000000000000000000000000000000",
        value: value,
      };
      return await this.exchangeToken(order);
    },
    async exchangeToken(data) {
      return new Promise((resolve, reject) => {
        var that = this;
        this.$api("order.buyerFee", {
          token: data.caddress,
          tokenId: data.tokenId,
          owner: data.owner,
          type: data.type,
          salt: data.salt,
        }).then(async function (res) {
          if (that.$tools.checkResponse(res)) {
            data.buyerFeeSig = {
              r: res.data.r,
              s: res.data.s,
              v: res.data.v,
            };
            data.exchangeAddress = that.config.NftExchange;
            let result = await that.$sdk.exchangeOrder(
              that.user.coinbase,
              data
            );
            if (result.error) {
              return resolve(result);
            }
            that.$store.dispatch("updatePayToken",that.asset.payToken);
            let txResult = await that.$web3.getTransaction(result.tx);
            if (txResult.error) {
              return resolve(txResult);
            }
            resolve(txResult);
          } else {
            resolve({ error: res.errmsg });
          }
        });
      });
    },
    closed(){
      this.confirm = false;
      this.form = {
        quantity: 1,
      };
      this.formError = {
        all: "",
        quantity: "",
        balance: ""
      };
      this.step = {
        approve: 0,
        buy: 0,
      };
      this.error = {
        all: "",
        approve: "",
        buy: "",
      };
      this.order = {};
      this.$refs.buy.close();
    },
    close() {
      this.closed();
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  flex-wrap: wrap;
}
</style>

