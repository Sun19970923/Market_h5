<template>
<uni-popup  @change="changeFunction" class="popupClass" ref='bid' type="bottom"  >
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
            <text>{{$t('dialog.pab')}}</text>
          </view>
        </view>
        <view class="input-group">
          <view class="input-info">
            <view class="tip">{{$t('dialog.bidPrice')}}</view>
            
            <my-input v-if="!bid" :placeholder="'0.0'" type="number" v-model="form.price" :payAddress="form.payAddress"
                :payTokens="payTokens"  :isSelect="true" @payAddressChange="payAddressChange">
            </my-input>
            <my-input v-else :placeholder="'0.0'" type="number" v-model="form.price" :payAddress="form.payAddress"  :isSelect="true" >
            </my-input>

            <view class="input-error" v-if="formError.price">{{formError.price}}</view>

            <view class="stip">
              <view class="stip-item"> {{ $t('dialog.yourBalance')}} <text class="bfont">{{ pay.balance }}{{ payToken.symbol }}</text> </view>
              <view class="stip-item"> {{ $t('dialog.serviceFee')}} <text class="bfont">{{serviceFee}}%</text> </view>
              <view class="stip-item flex wrap">{{ $t('dialog.pay')}}
                <text class="bfont"> {{pay.pay}}{{ payToken.symbol }}</text>
                ${{pay.usdt}}
              </view>
            </view>
 
          </view>

          <view class="input-info" v-if="$sdk.keyAssetType(nft.type) != 'ERC721'">
            <view class="tip">{{$t('dialog.enterQuantity')}} 
              <text class="gray-font">({{ myAsset&&myAsset.quantity ? nft.quantity - myAsset.quantity : nft.quantity }} {{$t('dialog.available')}})</text>
            </view>
            <input class="my-input-class" placeholder="0.0" type="number"
              v-model="form.quantity"/>

            <view class="input-error" v-if="formError.quantity">{{formError.quantity}}</view>
          </view>

        </view>
        <view class="process-btn">
          <template v-if="pay && parseFloat(pay.pay) > parseFloat(pay.balance)">

            <button class="nft-dialog-btn disable" disabled size="mini" @click="onSubmit"  type="success" :loading="confirm">
              {{$t('dialog.confirm')}}</button>
            <view class="input-error center-font">{{$t('dialog.noBalance')}}</view>
          </template>
          <template v-else>
            <button class="nft-dialog-btn"  size="mini" @click="onSubmit" type="success" :loading="confirm">
              {{$t('dialog.confirm')}}</button>
          </template>
        </view>
      </view>
    </view>

    <view class="clubart-dialog-body" v-else>
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process">
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
          <button class="nft-dialog-btn" size="mini" @click="onApprove" type="success" v-if="step.approve == 0">
            {{$t('dialog.approve')}}</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.approve == 1">
            {{$t('dialog.inProgress')}}...</button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.approve">{{ error.approve }}</view>
      </view>

      <view class="process">
        <view class="step-info">
          <view class="text">
            <text>{{$t('dialog.signsBid')}}</text>
          </view>
          <text v-if="step.bid != 1" :class="step.bid == 2 ? 'finish': ''"
            class="step iconfont icon-seleted"></text>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/static/images/Popup/loading.png" />
          </view>
        </view>
        <view class="process-btn">
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-if="step.approve != 2">{{$t('dialog.bid')}}
          </button>
          <button class="nft-dialog-btn" size="mini" @click="onBid" type="success" v-else-if="step.bid==0">{{$t('dialog.bid')}}
          </button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else-if="step.bid == 1">{{$t('dialog.inProgress')}}...
          </button>
          <button class="nft-dialog-btn disable" size="mini" disabled type="info" v-else>{{$t('dialog.done')}}</button>
        </view>
        <view class="process-error" v-if="error.bid">{{ error.bid}}</view>
      </view>
    </view>
    </view>
  </uni-popup>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  name: "Bid",
  data: function () {
    let  paytoken = this.$store.getters.defaultBidPayToken();
    return {
      visible: this.show,
      confirm: false,
      form: {
        price: "",
        payAddress: paytoken.address || '',
        quantity: "",
      },
      formError: {
        all: "",
        price: "",
        quantity: "",
      },
      step: {
        approve: 0,
        bid: 0,
      },
      error: {
        all: "",
        approve: "",
        bid: "",
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
    bid: {
      type: Object,
      default: null,
    },
    myAsset: {
      type: Object,
      default: null,
    },
  },
  watch: {
    show(val) {
      this.visible = this.show;
      if(this.visible==true){
        this.$refs.bid.open()
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    config() {
      return this.$store.state.config;
    },
    payTokens() {
      var payTokens = this.$store.state.payTokens;
      let tokens = [];
      for (var i = 0; i < payTokens.length; i++) {
        let payToken = payTokens[i];
        if (payToken.address == this.$sdk.NULL_ADDRESS() ) continue;
        tokens.push(payToken);
      }
      this.payAddress = tokens[0].address;
      return tokens;
    },
    serviceFee(){
      let fee = this.$tools.decimal(this.$store.state.config.buyerFee / 100, 2);
      return fee;
    },
    payToken(){
      let payToken = this.$store.getters.payToken(
        this.form.payAddress,
      );
      return payToken;
    },
    pay(){
      let balance = this.$store.getters.getBalance(this.form.payAddress)
      let price = this.$tools.str2num(this.form.price)
      if(!price) return {balance: balance, pay: 0, usdt: 0}
      price = price * this.form.quantity;
      let payToken = this.$store.getters.payToken(this.form.payAddress);
      let pay = this.$tools.decimal(price + (price * this.serviceFee / 100), 6)
      let usdt = this.$tools.decimal(payToken.rate * pay, 2);
      return {pay, usdt, balance}
    }
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
    onOpen() {
      if (!this.bid) {
        if (this.$sdk.keyAssetType(this.nft.type) == "ERC721") {
          this.form.quantity = "1";
        } else {
          this.form.quantity = "";
        }
      } else {
        this.form.payAddress = this.$store.getters.payToken(this.bid.sellToken).address;
        this.form.quantity = this.bid.buyerValue;
        this.form.price = this.$tools.singlePrice(this.bid.sellValue, this.bid.buyerValue);
      }
    },
    checkForm() {
      let error = false;
      if (!parseFloat(this.form.price)) {
        error = true;
        this.formError.price = this.$t("form.noPrice");
      }
      if(this.bid && (parseFloat(this.form.price) <= parseFloat(
          this.$tools.singlePrice(this.bid.sellValue, this.bid.buyerValue)
        ) ) ){
        error = true
        this.formError.price = this.$t("form.lessPrice")
      }
      if(!this.form.quantity){
        error = true;
        this.formError.quantity = this.$t("form.noQuantity")
      }
      let quantity = this.nft.quantity;
      if(this.myAsset) quantity = quantity - this.myAsset.quantity;

      if(parseFloat(this.form.quantity) > parseFloat(quantity)){
        error = true;
        this.formError.quantity = this.$t("form.exceedValue");
      }
      return !error;
    },
    onSubmit() {
      if (!this.checkForm()) return;
      this.confirm = true;
      let that = this;
      setTimeout(async function () {
        await that.onApprove();
      }, 100);
    },
    async onApprove() {
      this.step.approve = 1;
      if (!this.bid) {
        let payToken = this.$store.getters.payToken(this.form.payAddress);
        this.order = {
          address: this.nft.address,
          tokenId: this.nft.tokenId,
          type: this.nft.type,
          payToken: payToken,
          salt: "0",
        };
      } else {
        let result = await this.getOrder();
        if (result.error) {
          this.error.all = result.error;
          this.step.approve = 0;
          return;
        }
      }
      let result = await this.approvePayToken();
      if (result.error) {
        this.error.approve = result.error;
        this.step.approve = 0;
      } else {
        this.error.approve = "";
        this.step.approve = 2;
      }
    },
    async approvePayToken() {
      let order = {
        address: this.order.payToken.address,
        type: this.order.payToken.type,
      };
      let isAllowance = await this.$sdk.allowancePayToken(
        order,
        this.user.coinbase,
        this.config.ERC20TransferProxy
      );
      if (isAllowance.error) {
        return isAllowance;
      }
      isAllowance = isAllowance.toString();
      if (isAllowance != "0" && isAllowance) {
        return true;
      }
      return await this.$sdk.approvePayToken(
        order,
        this.user.coinbase,
        this.config.ERC20TransferProxy
      );
    },
    async getOrder() {
      return new Promise((resolve, reject) => {
        var data = {
          caddress: this.nft.address,
          tokenId: this.nft.tokenId,
          owner: this.bid.address,
          type: this.$sdk.valueOrderType("BID"),
        };
        let that = this;
        this.$api("order.get", data).then((res) => {
          if (that.$tools.checkResponse(res)) {
            that.order = {
              address: res.data.buyerToken,
              tokenId: res.data.buyerTokenId,
              type: res.data.buyerType,
              payToken: that.$store.getters.payToken(res.data.sellToken),
              salt: res.data.salt,
            };
            resolve(true);
          } else {
            resolve({ error: res.errmsg });
          }
        });
      });
    },
    async onBid(){
      if(this.step.approve != 2) return;
      this.step.bid = 1;
      let order = {
        ...this.order,
        price: this.form.price,
        sellerFee: this.config.sellerFee,
      };
      let result = await this.bidToken(order);
      if (result.error) {
        this.error.bid = result.error;
        this.step.bid = 0;
      } else {
        this.error.bid = "";
        this.step.bid = 2;
        this.closed();
        this.$emit("confirm");
      }
    },
    async bidToken(order) {
      return new Promise((resolve, reject) => {
        let sellValue = new BigNumber(this.form.price);
        sellValue = sellValue.multipliedBy(new BigNumber(this.form.quantity)).toFixed();
        var data = {
          owner: this.user.coinbase,
          sellToken: order.payToken.address,
          sellTokenId: "0",
          sellValue: sellValue,
          sellType: order.payToken.type,
          buyToken: order.address,
          buyTokenId: order.tokenId,
          buyValue: this.form.quantity,
          buyType: order.type,
          salt: order.salt,
          type:this.$sdk.valueCommonType("BID")
        };
        let that = this;
        this.$api("order.prepare", data).then(async function (res) {
          if (that.$tools.checkResponse(res)) {
            let message = res.data.message;
            if (message.startsWith("0x")) {
              message = message.slice(2, message.length);
            }
            let salt = res.data.salt;
            let signature = "";
            try {
              signature = await that.$web3.sign(message, that.user.coinbase);
              if(signature.error){
                return resolve(signature);
              }
            } catch (e) {
              return resolve({ error: e.message });
            }
            var _data = {
              type: !that.bid
                ? that.$sdk.valueCommonType("BID")
                : that.$sdk.valueCommonType("EDIT_BID"),
              owner: data.owner,
              sellToken: data.sellToken,
              sellTokenId: data.sellTokenId,
              sellValue: data.sellValue,
              sellType: data.sellType,
              buyToken: data.buyToken,
              buyTokenId: data.buyTokenId,
              buyValue: data.buyValue,
              buyType: data.buyType,
              salt: salt,
              message: message,
              signature: signature,
            };
            that.$api("order.add", _data).then(function (res) {
              if (that.$tools.checkResponse(res)) {
                that.$tools.message(that.$t('request.bidSuccess'), "success");
                resolve(res);
              } else {
                resolve({ error: res.errmsg });
              }
            });
          } else {
            that.$tools.message(res.errmsg);
            resolve({ error: res.errmsg });
          }
        });
      });
    },
    closed(){
      let  paytoken = this.$store.getters.defaultBidPayToken();
      this.confirm = false;
      this.form = {
        price: "",
        payAddress: paytoken.address,
        quantity: "",
      };
      this.formError = {
        all: "",
        price: "",
        quantity: "",
      };

      this.step = {
        approve: 0,
        bid: 0,
      };
      this.error = {
        all: "",
        approve: "",
        bid: "",
      };
      this.order = {};
      this.$refs.bid.close()
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

