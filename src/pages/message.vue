<template>
  <!-- <view class="body"> -->
    <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top @scrolltolower="loadNotifyList"
            class="scroll-box2">
    <cu-custom opcity="1" :isBack="true"  :isFixed="true">
            <block slot="content"> {{$t('message.title')}} </block>
  </cu-custom>
    <view class="body-wrapper">
    <scroll-view scroll-x class="nav mb-24 header" scroll-with-animation :scroll-left="scrollLeft">
      <view class="cu-item" :class="tab==item.name?'text-black cur':''" v-for="(item,index) in tabs"
        :key="index" @tap="tabSelect" :data-id="item.name">
        <span>{{item.title}}</span>
        <span v-if="item.name=='all'">({{ message.total }})</span>
        <span v-else>({{ message.unread }})</span>
      </view>
    </scroll-view>

    <view class="tab-content-info"
          v-for="(item,i) in tabs"
          :key="i"
          :name="item.name"
        >
        <view v-if="tab==item.name">
          <template #label>
            <span>{{item.title}}</span>
            <span>({{item.count}})</span>
          </template>

          <view class="message-box">
            <template v-if="notifyLoadStatus != 'loading' && !list[item.name].length">
              <no-content :tip="$t('notifyDialog.noMessage')"></no-content>
            </template>
            <template v-else>
              <view v-if="item.name=='unread'" class="read-all">
                <span @click="readAll" class='cpointer link bfont'>{{$t('message.readAll')}}</span>
              </view>
              <notify-item v-for="(notify, i) in list[item.name]" :key="i" :notify="notify" size="big" 
                @close="$emit('close')">
              </notify-item>
            </template>
          </view>
        </view>
        </view>
        <load-status :loadStatus="notifyLoadStatus"></load-status>
    </view>
        </scroll-view>

  <!-- </view> -->
</template>

<script>
import NotifyItem from "@/components/NotifyItem";
export default {
  components: {
    NotifyItem,
  },
  data() {
    return {
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多",
      },
      downOption: {
        auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
      },
      tabs: [
        { name: "all", title: "All", count: 0 },
        { name: "unread", title: "UnRead", count: 0 },
      ],
      tab: "all",
      page: 1,
      limit: 6,
      scrollLeft: 0,
      list: {
        all: [],
        unread: [],
      },
      notifyLoadStatus:""
    };
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    connected(){
      return this.$store.state.connected;
    },
    message(){
      return this.$store.state.message;
    },
    isLogin(){
      return this.$store.state.isLogin;
    }
  },
  watch:{
    isLogin(){
      if(this.connected && this.isLogin){
         this.init() 
      }
    },
    user(){
      if(this.user.coinbase){
          this.init()
      }
    }
  },
  onPullDownRefresh(){
    if(this.$mp.query.tab){
      this.tab = this.$mp.query.tab;
    }
    this.init(true);
  },
  onShow(){
    if(this.$mp.query.tab){
      this.tab = this.$mp.query.tab;
    }
    this.init();
  },
  methods: {
    queryMedia(nfts,tab){
      let _nfts=[];
      for(let i=0;i<nfts.length;i++){
        let item=nfts[i];
        _nfts.push(item.content)
      }
      _nfts = this.$tools.serializeNfts2(_nfts);
      let data={ info:_nfts }
      if(data.info.length){
        this.$api('nft.getmedia',data).then((res)=>{
          if(this.$tools.checkResponse(res)){
            this.setNftMedia(res.data,tab);
          }
        })
      }
    },
    setNftMedia(nfts,tab){
      for(let i = 0; i < this.list[tab].length; i++){
        let nft = this.list[tab][i];
        for(let key in nfts){
          let item = key.split(":");
          if (nft.content.token == item[0] && nft.content.tokenId == item[1]) {
            this.list[tab][i].media = nfts[key];
          }
        }
      }
      this.list[tab] = JSON.parse(JSON.stringify(this.list[tab]));
    },
    tabSelect(e) {
      this.tab = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.page = 1;
      this.getList();
    },
    init(isRefresh){
      this.$store.dispatch("countNotices");
      this.page = 1;
      this.getList(isRefresh);
    },
    readAll(){
      this.$api("notice.readall").then((res) => {
        if(this.$tools.checkResponse(res)){
          this.init();
        }
      });
    },
    loadList(){
      if(this.notifyLoadStatus == 'over') return;
      this.getList();
    },
    loadNotifyList(){
      if (this.notifyLoadStatus == "over") return;
      this.getList();
    },
    getList(isRefresh){
      if(this.notifyLoadStatus == 'loading') return;
      this.notifyLoadStatus = 'loading';
      let params = {
          page: this.page,
          limit: 32,
          address:this.$store.state.user.coinbase
            }
      let tab = this.tab == 'unread' ? 'unread' : 'all';
      if(tab == 'unread') params.isRead = 0;
      this.$api("notice.list", params).then((res) => {
        // this.notifyLoadStatus = 'loaded'
        if(this.$tools.checkResponse(res)){
          if(params.page == 1) this.list[tab] = []
          this.list[tab] = this.list[tab].concat(res.data.list);
          this.queryMedia(res.data.list,tab);
          if (res.data.list.length < this.limit) {
            this.notifyLoadStatus = "over";
          } else {
            this.page += 1;
            this.notifyLoadStatus = "";
          }
        }else{
          this.$tools.message(res.errmsg)
        }
        if(isRefresh){
          uni.stopPullDownRefresh();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page{
  background:#fff!important;
}
.tab-content-info{
}
.header {
  background: #fff;
  display: flex;
  align-items: center;
  top: 120rpx;
  position: fixed;
  width: 100%;
  z-index: 100;
  left: 0;
}
button::after {
  border: none;
}
.body {
  min-height: 100%;
  background-color: #fff;
  padding: 29rpx 22rpx 100rpx;
}
.nocontent-box {
  margin-top: 20%;
  text-align: center;
}
.nocontent-img {
  width: 50%;
}
.nocontent-title {
  color: #606266;
  font-size: 30rpx;
}
.scroll-box2 {
    height: 86vh;
    position: absolute;
    background-color: #fff;
    z-index: 100;
    bottom: 0;
}
.read-all{
  padding-bottom: 20rpx;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20rpx;
  text-align: right;
  .link{
    color: $primaryColor;
  }
}
</style>
