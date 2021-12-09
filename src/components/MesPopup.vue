<template>
  <uni-popup  class="popupClass" :ref='ftype' type="bottom"  >
     <view class="mainSection">
      <view class="clubart-dialog-title">
        <view class="left">
          <span>{{ title }}</span>
          <span class="dialog-title-num">({{ total }})</span>
        </view>
        <view class="right" @click="close">
          <img class="close-img" src="@/static/images/Popup/pop_shut.png">
        </view>
      </view>

      <view class="follow-items">
        <scroll-view scroll-y="true"  lower-threshold='150' enable-back-to-top @scrolltolower="loadList" class="scroll-box">
      <view >
        <view class="follow-item" v-for="(item,i) in list" :key="i" >
          <view @click="goUser(item.address)">
            <avatar class="avatar" :imageUrl="$filters.fullImageUrl(item.avatar)" :address="item.address" :imgWidth="90" :imgHeight="90"></avatar>
          </view>
            <view class="dialog-u-info" @click="goUser(item.address)">
              <span >{{item.count}} {{$t('MesPopup.followers')}}</span>
              <span class="dialog-u-name">{{item.nickname || $filters.ellipsisAddress(item.address)}}</span>
            </view>
            <view class="right" v-if="!isLogin || user.coinbase != item.address">
              <button class="currency-button follow-btn" size="mini"  v-if="!item.isFollow" @click="addFollow(item, i)" >{{$t('MesPopup.follow')}}</button>
              <button	class="currency-button follow-btn" size="mini" v-else @click="deleteFollow(item,i)" >{{$t('MesPopup.followed')}}</button>
            </view>
        </view>
                </view>
            <load-status :loadStatus="loadStatus"></load-status>
      <!-- </template> -->
      			</scroll-view>

    </view>

    </view>          
</uni-popup> 

</template>
<script>
import Avatar from './Avatar.vue';
export default {
  components: { Avatar },
  name: "MesPopup",
  props: {
    show:{
      type: Boolean,
      default: false,
    },
    ftype:{
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  watch:{
    show(val){
      this.visible = this.show;
    }
  },
  data(){
    return{
      list:[],
      followtext:"",
      total: 0,
      visible: this.show,
      query: {
        page: 1,
        // limit: this.$store.state.pageLimit,
        limit:3
      },
      loadStatus: "",
    }
  },
  computed:{
    isLogin(){
      return this.$store.state.isLogin;
    },
    user(){
      return this.$store.state.user;
    },
    title(){
      if(this.ftype == 'follow'){
        return this.$t('account.Followers')
      }
      return this.$t('account.Following')
    }
  },
  created(){
    this.init();
  },
  methods:{
    goUser(address) {
      this.$emit("close");
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
    init(){
      this.query.page = 1;
      this.getList();  
    },
    showFollownum(){
      this.$emit("showFollownum");
    },
    close(){
      this.query.page = 1;
      this.total=0;
      this.getList();
      this.$emit("close");
    },
    openDialog(){
      this.query.page = 1;
      this.getList();
    },
    loadList(){
      if(this.loadStatus == 'over') return;
      this.getList();
    },
    getList(){
      if(this.loadStatus == 'loading') return;
      this.loadStatus = 'loading'
      let url = this.ftype == "follow" ? 'user.follows' : 'user.following'
      let params = {
        ...this.query,
        address: this.address,
      }
      if(!this.address)return;
      this.$api(url, params).then(res => {
        this.loadStatus = 'loaded';
        if(this.$tools.checkResponse(res)){
          if(params.page == 1) this.list = []
          this.list = this.list.concat(res.data.list)
          this.query.page += 1;
          this.total = res.data.total;
          this.loadStatus = res.data.list.length < res.data.limit ? 'over' : this.loadStatus;
        }else{
          this.$tools.message(res.errmsg)
        }
      });
    },
    deleteFollow(item, index){
      let address = { address: item.address }
      var that = this;
      this.$api('follow.delete',address).then( res => {
        if(that.$tools.checkResponse(res)){
          this.list[index].isFollow = false;
          this.showFollownum()
        }
      })
    },
    addFollow(item,index){
      let address = { address : item.address }
      var that = this;
      this.$api('follow.add',address).then( res => {
        if(that.$tools.checkResponse(res)){
          that.list[index].isFollow = true; 
          this.showFollownum()
        }
      })
    },

  }
}
</script>
<style lang="scss" scoped>
.dialog-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Montserrat-Regular';
  font-size: 48rpx;
  font-weight: 400;
}
.dialog-title-colse{
  border: none;
  padding: 0;
  .close-icon{
    width:64rpx;
    height:64rpx;
  }
}
.dialog-title-num{
  font-size: 32rpx;
  padding-left: 30rpx;
}
.dialog-u-name{
  font-weight: 400;
  color: #1D1E22;
}
.scroll-box{
  height:70vh;
  background-color: #fff;
  padding: 36rpx 0rpx 150rpx 0rpx;
}
  .follow-item{
    display: flex;
    margin: 20rpx auto;
    align-items: center;
    .avatar{
      cursor: pointer;
    }
    .dialog-u-info{
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-left: 20rpx;
      cursor: pointer;
    }
    .dialog-u-detail{
      display: flex;
      width: 160rpx;
      justify-content: space-between;
      .dialog-u-header{
          width: 116rpx;
          height: 116rpx;
          border-radius: 50%;
      }
    }
  }

</style>
