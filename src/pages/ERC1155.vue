<template>
  <!-- 创建-详细界面 -->
  <view class="page-body">
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{$t('erc721.title')}} </block>
    </cu-custom>

    <view class="body-content">
      <view class="detail-left">

        <view class="upload-file">
          <view class="form-item-label">
            <view class="c">{{$t('erc721.uploadFile')}}</view>
          </view>

          <view class="upload-pic" v-if="!tempImg&&!temAnim">
            <view class="upload-tip">{{$t('erc721.text1')}}</view>
             <file-picker @select="chooseFile" file-mediatype="all" :limit="1" :auto-upload="false">
                    <button size="mini" class="choose-btn" type="success" plain>
                      {{$t('erc721.chooseFile')}}
                    </button>
                </file-picker>
          </view>

          <view class="preview-pic upload-pic" v-else-if="tempImg&&!temAnim">
            <view class="preview-pic-left">
              <img id="preview-image" class="img" :src="tempImg" @load="onLoadPreview" />
            </view>
            <view class="preview-pic-right">
              <text class="text-gray mb10">{{$t('erc721.measurement')}}</text>
              <text class="text-gray mb10"> {{previewImage.width}} × {{previewImage.height}}px </text>
              <button class="choose-btn" size="mini" type="success" @tap="deletePic" plain>
                {{$t('erc721.deletePicture')}}
              </button>
            </view>
          </view>
          <view class="preview-pic upload-pic audio-section" v-else-if="temAnim">
            <free-audio v-if="animFile.type.indexOf('audio') != -1" class="free-audio"
              :activeColor="$store.state.primaryColor" :loopPlay="true" :url="temAnim" audioId="1"></free-audio>
            <video :src="temAnim" :poster="tempImg" controls disablePictureInPicture controlslist="nodownload"
              v-if="animFile.type.indexOf('video') != -1">
            </video>
            <button class="choose-btn" size="mini" type="success" @tap="deleteAV" plain>
              {{$t('erc721.deleteAV')}}
            </button>
          </view>

          <view class="form-error-tip error-position" v-if="errorForm.file&&!temAnim">
            {{errorForm.file}}
          </view>

        </view>

        <view class="upload-file" v-if="temAnim">
          <view class="form-item-label">
            <view class="c">
              {{$t('erc721.chooseCover')}}
            </view>
          </view>

          <view class="upload-pic" v-if="temAnim&&!tempImg" accept="image/gif,image/png,image/jpeg,image/webp"
            :limit="1" :auto-upload="false" :on-change="uploadChange" name="image">
            <view class="upload-tip">{{$t('erc721.chooseImage')}}</view>
              <file-picker @select="chooseFile" class="file-picker-class" file-mediatype="image" :limit="1" :auto-upload="false">
                    <button size="mini" class="choose-btn" type="success" plain>
                      {{$t('erc721.chooseFile')}}
                    </button>
                </file-picker>
          </view>

          <view class="preview-pic upload-pic" v-if="tempImg&&temAnim">
            <view class="preview-pic-left">
              <img id="preview-image" class="img" :src="tempImg" @load="onLoadPreview" />
            </view>
            <view class="preview-pic-right">
              <text class="text-gray mb10">{{$t('erc721.measurement')}}</text>
              <text class="text-gray mb10">
                {{previewImage.width}} × {{previewImage.height}}px
              </text>
              <button class="choose-btn" size="mini" type="success" @tap="deletePic" plain>
                {{$t('erc721.deletePicture')}}
              </button>
            </view>
          </view>
          <view class="form-error-tip error-position" v-if="errorForm.file">
            {{errorForm.file}}
          </view>
        </view>

        <view class="put-on-sale">
          <view class="put-on-title">
            <text>{{$t('erc721.pos')}}</text>
            <switch class="switchClass" :checked="createForm.onSale" @change="switchChange" />

          </view>

          <view class="flex align-center">
            <input class="production-input" v-if="createForm.onSale" placeholder="0.0" type="number"
              v-model="createForm.price" />
            <picker class="input-suffix" @change="salePickerChange" :value="sale_index" :range="payTokens"
              :range-key="'symbol'">
              <view class="uni-input">
                <view class="t"> {{payTokens[sale_index]?payTokens[sale_index].symbol:''}}</view>
                <view class="iconfont icon-arrow-down"></view>
              </view>
            </picker>
          </view>

          <view class="form-error-tip error-position" v-if="errorForm.price">{{errorForm.price}}
          </view>
          <view class="sale-introduce" v-if="createForm.onSale">
            <view class="form-tip">
              <text class="text">{{$t('erc721.serviceFee')}}</text>
              <text class="bfont"> {{ serverFee }}%</text>
            </view>
            <view class="form-tip">
              <text class="text">{{$t('erc721.ywr')}} </text>
              <text class="bfont" v-if="payToken"> {{profit}} {{payToken?payToken.symbol:""}}</text>
            </view>
          </view>
        </view>

        <view class="choose-collection">
          <view class="form-item-label">
            <view class="c">
              {{$t('erc721.chooseCollection')}}
            </view>
          </view>
          <view class="collection-group">
            <view class="collection-item active">
              <view class="a">{{ contract.name }}</view>
              <view class="b">(ERC-1155)</view>
            </view>
          </view>

        </view>
        <view class="production-name">
          <view class="form-item-label">
            <text class="c">
              {{$t('erc721.name')}}
            </text>
          </view>
          <input class="production-input" :placeholder="$t('erc721.placeholder1')" v-model="createForm.name" />
          <view class="form-error-tip error-position" v-if="errorForm.name">{{errorForm.name}}
          </view>
        </view>
        <view class="production-description">
          <view class="form-item-label">
            <text class="c">{{$t('erc721.description')}}</text>
            <text class="d">({{$t('erc721.optional')}})</text>
          </view>

          <input class="production-input" :placeholder="$t('erc721.placeholder2')" v-model="createForm.description" />
        </view>
        <view class="production-quantity">
          <view class="form-item-label">
            <text class="c">{{$t('erc1155.number')}}</text>
          </view>
          <input class="production-input" placeholder='0' v-model.number="createForm.quantity" />
          <view class="form-tip">{{$t('erc1155.amountOfTokens')}}</view>
          <view class="form-error-tip error-position" v-if="errorForm.quantity">{{errorForm.quantity}}
            </view>
        </view>

        <view class="production-classification">
          <view class="production-title">
            <text class="c">{{$t('erc721.classification')}}</text>
            <text class="d">({{$t('erc721.optional')}})</text>
          </view>
          <picker class="classification-select" @change="sortPickerChange" :value="category_index" :range="categorys"
            :range-key="'name'">
            <view class="uni-input">
              <view class="t"> {{categorys[category_index].name}} </view>
              <view class="iconfont icon-arrow-down"></view>
            </view>
          </picker>

          <view class="form-error-tip error-position" v-if="errorForm.category">
            {{ errorForm.category }}</view>
        </view>

        <view class="production-royalties">
          <view class="form-item-label">
            <view class="c">
              {{$t('erc721.royalties')}}
            </view>
          </view>
          <view class="flex align-center">
            <input class="production-input" placeholder="10" type="number" v-model.number="createForm.royalties" />
            <view class="input-suffix">%</view>
          </view>
          <view class="form-tip">{{$t('erc721.suggested')}}: 2%, 5%, 8%</view>
          <view class="form-error-tip error-position" v-if="errorForm.royalties">
            {{ errorForm.royalties }}</view>
        </view>
        <view class="production-properties">
          <view class="form-item-label">
            <view class="c">
              {{$t('erc721.properties')}}
            </view>
          </view>
          <view class="property-group" v-for="(property, i) in createForm.properties" :key="'property-group'+i">
            <view class="property left">
              <input class="production-input" v-model="property.key" :placeholder="$t('erc721.placeholder4')"
                @input="propertyInput" />
            </view>
            <view class="property right">
              <input class="production-input" v-model="property.value" :placeholder="$t('erc721.placeholder5')"
                @input="propertyInput" />
            </view>
          </view>
        </view>
        <view class="submit-section">
          <button width="100%" @tap="onSubmit('createForm')" class="submit-btn" type="success">
            {{$t('erc721.createItem')}}
          </button>
        </view>
        <view class="form-error-tip error-position" v-if="errorForm.all">{{errorForm.all}}</view>

      </view>

    </view>

    <mint-dialog :show="showMint" @close="showMint=false" @confirm="confirm" ref="mintDialog" :file="file"
      :animFile="animFile" :nft="nft">
    </mint-dialog>
  </view>

</template>
<script>
import MintDialog from "@/components/dialogs/Mint";
import NftDialog from "@/mixins/NftDialog";
import BigNumber from 'bignumber.js'

export default {
  name: "ERC1155",
  components: {
    MintDialog,
  },
  mixins: [NftDialog],
  data: function () {
    let paytoken = this.$store.getters.defaultSalePayToken();
    return {
      previewImage: {
        width: 0,
        height: 0,
      },
      contract: {},
      previewFixed: false,
      previewLeft: 0,
      createForm: {
        price: "",
        payAddress: paytoken.address,
        onSale: true,
        isUnlock: false,
        unlockUrl: "",
        royalties: 2,
        type: 2,
        name: "",
        description: "",
        category: "",
        quantity: 1,
        properties: [
          {
            key: "",
            value: "",
          },
        ],
      },
      errorForm: {
        all: "",
        file: "",
        price: "",
        unlockUrl: "",
        category: "",
        royalties: "",
        quantity:"",
        name: "",
      },
      temAnim: null,
      tempImg: null,
      file: null,
      nft: {},
      showMint: false,
      animFile: null,
      category_index: 0,
      chooseFile_Type: "",
      chooseFile_NewValue: null,
      chooseFile_ImageFile: null,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    sale_index: function () {
      if (!this.payTokens.length) return 0;
      for (var i = 0; i < this.payTokens.length; i++) {
        var token = this.payTokens[i];
        if (token.address == this.createForm.payAddress) {
          return i;
        }
      }
      return 0;
    },
    user: function () {
      return this.$store.state.user;
    },
    clubartState: function () {},
    serverFee: function () {
      var fee = this.$store.state.config.sellerFee;
      if (!fee) return 0;
      return fee / 100;
    },
    payTokens() {
      return this.$store.state.payTokens;
    },
    payToken() {
      let payToken = this.$store.getters.payToken(
        this.createForm.payAddress
      );
      return payToken;
    },
    categorys(){
      return this.$store.state.categorys;
    },
    profit: function () {
      let quantity = 1;
      if(this.createForm.quantity > 1){
        quantity = this.createForm.quantity;
      }
      var price = this.createForm.price;
      price = this.$tools.str2num(price);
      if (!price) return 0;
      price = new BigNumber(this.createForm.price).multipliedBy(new BigNumber(quantity));

      let fee = new BigNumber(this.serverFee);
      fee = fee.multipliedBy(price);
      fee = fee.dividedBy(new BigNumber(100));
      let profit = price.minus(fee).toFixed();
      return profit;
    },
    config: function () {
      return this.$store.state.config;
    },
  },
  watch: {
    chooseFile_NewValue(val) {
      if (this.chooseFile_NewValue != null) {
        this.uploadChange(this.chooseFile_ImageFile);
      }
    },
  },
  methods: {
    chooseFile(tempFiles) {
      let file = new FileReader();
      this.chooseFile_ImageFile = tempFiles.tempFiles[0].file;
      file.readAsDataURL(tempFiles.tempFiles[0].file);
      file.onload = () => {
      this.chooseFile_NewValue = file.result;
      };
    },
    salePickerChange(e) {
      // this.sale_index = e.target.value
      this.createForm = Object.assign({}, this.createForm, {
        payAddress: this.payTokens[e.target.value].address,
      });
    },
    sortPickerChange: function (e) {
      this.category_index = e.target.value;
    },
    switchChange: function (e) {
      this.createForm.onSale = !this.createForm.onSale;
    },
    deleteAV() {
      this.temAnim = null;
      // this.audioFile = null;
      this.tempImg = null;
      this.file = null;
      this.chooseFile_NewValue=null;
    },
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 滚动条偏移量
      let top = 83;

      if (scrollTop > top && !this.previewFixed) {
        this.previewFixed = true;
      } else if (scrollTop <= top && this.previewFixed) {
        this.previewFixed = false;
      }
    },
    handleResize() {
      var width = document.body.clientWidth;
      if (width < 1120) width = 1120;
      this.previewLeft = width / 2 + 200;
    },
    onLoadPreview(e, e1) {
      var img = document.getElementById("preview-image");
      this.previewImage = {
        height: img.naturalHeight,
        width: img.naturalWidth,
      };
    },
    goBack() {
      this.$router.go(-1);
    },
    init() {
      let data = {
        address: this.user.coinbase,
      }
      this.$api("user.listcontract", data).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.contract = res.data.filter(function (contract) {
            return contract.type == 2;
          })[0];
        }
      });
      this.$store.dispatch("payTokens");
      this.$store.dispatch("categorys");
    },
    propertyInput(e) {
      let emptyC = 0;
      for (var i = 0; i < this.createForm.properties.length; i++) {
        var property = this.createForm.properties[i];
        if (!property.key || !property.value) emptyC += 1;
      }
      if (emptyC != 1) {
        this.createForm.properties = this.createForm.properties.filter(
          function (property) {
            return property.key || property.value;
          }
        );
        this.createForm.properties.push({ key: "", value: "" });
      }
    },
    fullProperties(properties) {
      var _properties = [];
      for (var i = 0; i < properties.length; i++) {
        var key = properties[i].key.trim();
        var value = properties[i].value.trim();
        var trait_type = key;
        if (!key || !value) continue;
        _properties.push({ key, trait_type, value });
      }
      return _properties;
    },
    uploadChange(file) {
      if (
        file.type.indexOf("video") != -1 ||
        file.type.indexOf("audio") != -1
      ) {
        this.animFile = file;
        // var event = event || window.event;
        // var file = event.target.files[0];

        var reader = new FileReader();
        var _this = this;
        reader.onload = function (e) {
          _this.temAnim = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (file.type.indexOf("image") != -1) {
        this.file = file;
        // var event = event || window.event;
        // var file = event.target.files[0];
        var reader = new FileReader();
        var _this = this;
        reader.onload = function (e) {
          _this.tempImg = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    deletePic() {
      this.tempImg = null;
      this.file = null;
      this.chooseFile_NewValue=null;
    },
    checkForm() {
      this.errorForm = {
        all: "",
        file: "",
        price: "",
        unlockUrl: "",
        category: "",
        royalties: "",
        name: "",
        quantity:""
      };
      let result = true;
      if (!this.tempImg) {
        this.errorForm.file = this.$t("form.noFile");
        result = false;
      }
      if(this.createForm.onSale){
        if( !this.$tools.str2num(this.createForm.price)){
          this.errorForm.price = this.$t("form.noPrice");
          result = false;
        }else if(!this.$tools.minPriceLimit(this.createForm.price, this.payToken)){
          this.errorForm.price = this.$t("form.minPriceLimit");
          result = false;
        }
      }

      if (!this.createForm.unlockUrl && this.createForm.isUnlock) {
        this.errorForm.unlockUrl = this.$t("form.noUnlockUrl");
        result = false;
      }
      if (!this.createForm.name) {
        this.errorForm.name = this.$t("form.noName");
        result = false;
      }
      let category = this.categorys[this.category_index];
      if(!category && !category.id){
        this.errorForm.category = this.$t("form.noCategory");
        result = false;
      }
      if (!this.createForm.quantity) {
        this.errorForm.quantity = this.$t("form.noQuantity");
        result = false;
      }
      if (!result) {
        this.errorForm.all = this.$t("form.validateForm");
      }
      return result;
    },
    onSubmit() {
      if (!this.payToken) {
        this.errorForm.all = this.$t("form.noPayToken");
        return;
      }

      if (!this.checkForm()) return;

      let contract = this.contract;
      if (!contract) {
        this.errorForm.all = this.$t("form.noContract");
        return;
      }
      var royalties = this.createForm.royalties;
      royalties = this.$tools.str2num(royalties);
      royalties = !royalties ? 0 : royalties;

      if (royalties > 10) {
        this.errorForm.royalties = this.$t("form.royalties");
        this.errorForm.all = this.$t("form.royalties");
        return;
      }

      this.nft = {
        payToken: this.payToken,
        contract: contract,
        form: {
          ...this.createForm,
          category: this.categorys[this.category_index].id,
          royalties: this.$tools.decimal(royalties * 100, 0),
          properties: this.fullProperties(this.createForm.properties),
        },
        file: this.file,
      };
      let that = this;
      this.showMint = true;
      setTimeout(async function () {
        await that.$refs.mintDialog.start();
      }, 100);
    },
    confirm() {
      let url = "/pages/item?tab=";
      if (!this.createForm.onSale) {
        url += "collectibles";
      } else {
        url += "sale";
      }
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.body-content {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20rpx 100rpx;
}

.icon-add {
  font-size: 48rpx;
}
.audio-section {
  flex-direction: column !important;
  align-items: center;
  justify-content: center;
  height: fit-content !important;
  box-sizing: border-box;
  padding: 20rpx;
  audio {
    margin-bottom: 20rpx;
  }
  video {
    margin-bottom: 20rpx;
    width: 100%;
    // height: 60%;
  }
}
.free-audio {
  width: 100%;
  margin-bottom: 20rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin: 60rpx 0 20rpx;
}
.go-back {
  margin-top: 20rpx;
}
.form-item-label {
  padding: 30rpx 0;
  font-size: 32rpx;
  font-weight: 400;
  color: #333;
}
.upload-pic {
  height: 280rpx;
  border: 1rpx solid #eeeeee;
  border-radius: $borderRadius;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
  .choose-btn {
    background: lighten($primaryColor, 40%);
    border: none;
    color: $primaryColor;
    font-size: 30rpx;
    width: 410rpx;
  }
  .delete-btn {
    width: 80%;
  }
  &.preview-pic {
    display: flex;
    flex-direction: inherit;
  }
  .preview-pic-left {
    flex: 1;
    display: flex;
    justify-content: center;
    .img {
      max-width: 80%;
      height: 170rpx;
      border-radius: $borderRadius;
      object-fit: cover;
    }
  }
  .preview-pic-right {
    display: flex;
    flex-direction: column;
    flex: 2;
    align-items: center;
  }
  .text-gray {
    color: $grayColor;
  }
  .upload-tip {
    margin-top: 30rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: $grayColor;
    text-align: center;
  }
}
.mb10 {
  margin-bottom: 10rpx;
}
.put-on-title {
  padding: 20rpx 0;
  font-size: 32rpx;
  font-weight: bold;
  color: #709fe5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  color: #999;
  font-size: 30rpx;
  margin-top: 4rpx;
  font-weight: 400;
  .bfont {
    margin-left: 4rpx;
    color: #333;
    font-weight: bold;
  }
}
.nft-primary-btn {
  background: lighten($primaryColor, 10%);
}
.collection-group {
  display: flex;
}
.collection-item {
  margin-right: 30rpx;
  width: 340rpx;
  cursor: pointer;
  border: $border;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  line-height: 28rpx;
  &.active {
    border: 1rpx solid $primaryColor;
    border-radius: 16rpx;
  }
  .a {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  .b {
    font-size: 28rpx;
    font-weight: 400;
    color: #999;
  }
}
.input-suffix {
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  color: #999;
  margin-left: -150rpx;
}
.submit-section {
  margin-top: 40rpx;
}

.submit-btn {
  background: $primaryColor;
  border: none;
  color: #fff;
  width: 100%;
}
.property-group {
  display: flex;
  .property {
    flex: 1;
    &.left {
      padding-right: 20rpx;
    }
    &.right {
      padding-left: 20rpx;
    }
  }
}
.property-group {
  margin-bottom: 20rpx;
}

.collection-detail {
  position: relative;
  font-weight: 900;
  padding-top: 50rpx;
  padding-bottom: 128rpx;
  font-weight: 900;
  font-size: 32rpx;
  width: 100%;
  // max-width: 100%;
  margin: 0 auto;
  .detail-left {
    max-width: 968rpx;
  }
  .create-form {
    .sale-introduce {
      line-height: 2;
    }
  }
}

.upload-file {
  .upload-label-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
    line-height: 132rpx;
  }
}
.put-on-sale {
  .sale-introduce-text {
    font-size: 28rpx;
    font-weight: 400;
    color: #999;
    line-height: 48rpx;
  }
  .sale-introduce-num {
    width: 144rpx;
    height: 2rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #000000;
    line-height: 48rpx;
    margin-left: 4rpx;
  }
}
.unlock-once-purchased {
  .purchased-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #000000;
    line-height: 132rpx;
    background: linear-gradient(0deg, #6e7cf8 0%, #709fe5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .purchased-inreoduce {
    width: 674rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
    line-height: 56rpx;
  }
  .purchased-tip {
    width: 494rpx;
    height: 28rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #999;
    line-height: 64rpx;
  }
}

.production-name {
  .production-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
  }
}
.production-description {
  .c {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
  }
}
.production-classification {
  .view#el-popper-5721 {
    z-index: 2030;
    position: absolute;
    left: 1400rpx;
    top: 404rpx;
    margin: 0rpx;
  }
  .el-select-dropdown {
    min-width: 200rpx;
  }
  .production-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
    line-height: 132rpx;
  }
  .classification-select {
    width: 100%;
    border: none;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    line-height: 80rpx;
    outline: none;
    padding: 0 30rpx;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    height: 100rpx;
    background: #eee;
    border-radius: 16rpx;
    display: block;
    cursor: pointer;
    padding-right: 60rpx;
    .uni-input {
      line-height: 100rpx;
      .t {
        flex: 1;
      }
      .iconfont {
        font-size: 36rpx;
      }
    }
  }
}

.uni-input {
  display: flex;
  align-items: center;
  .t {
    flex: 1;
  }
  .iconfont {
    font-size: 36rpx;
  }
}

.production-properties {
  .properties-input {
    width: 42%;
    margin-right: 72rpx;
  }
}

.submit-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10rpx;
}

.detail-right {
  position: absolute;
  left: 400rpx !important;
  top: 60rpx !important;
  z-index: 100;
  .preview-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #333;
    margin-bottom: 20rpx;
  }
  .pre-box {
    width: 240rpx;
    background: #ffffff;
    box-shadow: 0rpx 6rpx 30rpx 2rpx rgba(153, 153, 153, 0.25);
    border-radius: $borderRadius;

    .preview-none {
      width: 292rpx;
      height: 70rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #1d1e22;
      line-height: 48rpx;
      text-align: center;
    }
    .pre-detail {
      width: 404rpx;
      height: 608rpx;
      background: #ffffff;
      box-shadow: 0rpx 3rpx 15rpx 1rpx rgba(153, 153, 153, 0.25);
      border-radius: 24rpx;
      .pre-introduction {
        width: 404rpx;
        position: absolute;
        bottom: 0;
        height: 204rpx;
        padding-left: 24rpx;
        .flex {
          display: flex;
          align-items: center;
        }
        .user-name {
          padding-top: 40rpx;
          resize: none;
          overflow: hidden;
          background: border-box;
          width: 80%;
          height: 32rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #1d1e22;
          border: none;
          text-overflow: ellipsis;
        }
        .nft-symbol {
          max-width: 60%;
          resize: none;
          overflow: hidden;
          min-width: 20rpx;
          height: 30rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #1d1e22;
          line-height: 36rpx;
          margin-left: 4rpx;
        }
      }
      .user-header {
        display: flex;
        position: absolute;
        z-index: 111;
        margin-left: 18rpx;
        margin-top: 20rpx;
        .user-box {
          display: flex;
          flex-direction: row;
          position: relative;
        }
        .top-imgs {
          .user-header-left {
            width: 48rpx;
            height: 48rpx;
            border-radius: 100%;
            border: 1rpx solid #ffffff;
            display: flex;
            flex-direction: row;
          }
        }
      }
      .pre-img {
        width: 404rpx;
        height: 404rpx;
        border-radius: 24rpx;
        object-fit: cover;
      }
    }
  }
  .pre-box-inner {
    --coverWidth: 100%;
  }
  .cover-padding {
    position: relative;
    padding-bottom: calc(var(--coverWidth) / 1.33);
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: $borderRadius;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-cover {
    position: absolute;
    margin-top: -14rpx;
    top: 50%;
    left: 0;
    width: 100%;
    line-height: 28rpx;
    cursor: pointer;
    border-radius: $borderRadius;
    text-align: center;
    color: #999;
    font-size: 28rpx;
  }
  .descript {
    padding: 10rpx 0;
    font-size: 24rpx;
  }
  .d {
    padding: 10rpx;
    display: flex;
    .d-left {
      display: flex;
      flex: 1;
      align-items: center;
    }
    .d-top {
      width: 50%;
      flex: 0 !important;
    }
    .avatar {
      margin-right: 10rpx;
    }
    .price {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 24rpx;
      font-weight: 400;
      color: #1d1e22;
      margin-right: 10rpx;
    }
    .stock {
      display: flex;
      flex: 1;
      margin-left: 8rpx;
      margin-right: 12rpx;
      white-space: nowrap;
      font-size: 24rpx;
      font-weight: 400;
      color: #999;
      text-align: center;
    }
  }

  .e {
    width: 58rpx;
    height: 20rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #1d1e22;
    line-height: 24rpx;
    margin-left: 20rpx;
  }
}
.form-error-tip {
  margint-top: 10rpx;
}

.error-position {
  display: flex;
  justify-content: flex-end;
}
.pre-btn {
  display: none;
}

.production-input {
  border: none;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 80rpx;
  outline: none;
  padding: 0 30rpx;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  height: 100rpx;
  background: #eee;
  border-radius: 16rpx;
}
</style>
