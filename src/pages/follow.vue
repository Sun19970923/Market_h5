<template>
  <view>
    <cu-custom opcity="1" :isBack="true" :isFixed="true">
      <block slot="content"> {{$t('MesPopup.follow2')}}</block>
    </cu-custom>
    <view class="follow">

      <scroll-view scroll-x class="nav mb-24 header" scroll-with-animation
        :scroll-left="scrollLeft">
        <view class="cu-item" :class="tab==item.name?'text-black cur':''"
          v-for="(item,index) in tabs" :key="index" @tap="tabSelect" :data-id="item.name">
          <span>{{item.title}}</span>
          <span>({{stat[index]}})</span>
        </view>
      </scroll-view>

      <scroll-view scroll-y="true" lower-threshold='150' enable-back-to-top
        @scrolltolower="loadList" class="scroll-box">
        <view>
          <template v-if="list.length==0">
            <no-content :tip="$t('notifyDialog.noMessage')"></no-content>
          </template>
          <view v-else class="follow-item" v-for="(item,i) in list" :key="i">
            <view @click="goUser(item.address)">
              <avatar class="avatar" :imageUrl="$filters.fullImageUrl(item.avatar)"
                :address="item.address" :imgWidth="90" :imgHeight="90"></avatar>
            </view>
            <view class="dialog-u-info" @click="goUser(item.address)">
              <span>{{item.count}} {{$t('MesPopup.followers')}}</span>
              <span
                class="dialog-u-name">{{item.nickname || $filters.ellipsisAddress(item.address)}}</span>
            </view>
            <view class="right" v-if="!isLogin || user.coinbase != item.address">
              <button class="currency-button follow-btn" size="mini" v-if="!item.isFollow"
                @click="addFollow(item, i)">{{$t('MesPopup.follow')}}</button>
              <button class="currency-button follow-btn" size="mini" v-else
                @click="deleteFollow(item,i)">{{$t('MesPopup.followed')}}</button>
            </view>
          </view>
        </view>
        <load-status v-if="list.length!=0" :loadStatus="loadStatus" @loadmore="getList">
        </load-status>
      </scroll-view>
    </view>
  </view>
</template>
<script>
export default {
  name: "MesPopup",
  data() {
    return {
      list: [],
      followtext: "",
      total: 0,
      query: {
        page: 1,
        // limit: this.$store.state.pageLimit,
        limit: 3,
      },
      loadStatus: "",
      address: "",
      scrollLeft: 0,
      tabs: [
        { name: "following", title: this.$t("account.Following"), count: 0 },
        { name: "followers", title: this.$t("account.Followers"), count: 0 },
      ],
      tab: "following",
      stat: [],
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    user() {
      return this.$store.state.user;
    },
    title() {
      if (this.ftype == "follow") {
        return this.$t("account.Followers");
      }
      return this.$t("account.Following");
    },
  },
  onPullDownRefresh() {
    this.init(true);
  },
  onLoad(option) {
    this.address = option.address;
    if (option.tab) {
      this.tab = option.tab;
    }
  },
  onShow() {
    this.init();
  },
  methods: {
    tabSelect(e) {
      this.tab = e.currentTarget.dataset.id;
      this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      this.init();
    },
    goUser(address) {
      this.$emit("close");
      uni.navigateTo({
        url: "/pages/account?address=" + address,
      });
    },
    init(isRefresh) {
      this.query.page = 1;
      this.showFollownum();
      this.getList(isRefresh);
    },
    showFollownum() {
      this.$emit("showFollownum");
    },
    loadList() {
      if (this.loadStatus == "over") return;
      this.getList();
    },
    getList(isRefresh) {
      if (this.loadStatus == "loading") return;
      this.loadStatus = "loading";
      let url = this.tab == "followers" ? "user.follows" : "user.following";
      let params = {
        ...this.query,
        address: this.address,
      };
      this.$api(url, params).then((res) => {
        if (this.$tools.checkResponse(res)) {
          if (params.page == 1) this.list = [];
          this.list = this.list.concat(res.data.list);
          this.query.page += 1;
          this.total = res.data.total;
          this.loadStatus = res.data.list.length < res.data.limit ? "over" : "";
        } else {
          this.$tools.message(res.errmsg);
        }
        if (isRefresh) {
          uni.stopPullDownRefresh();
        }
      });
    },
    showFollownum() {
      let params = {
        address: this.address,
      };
      this.$api("user.stat", params).then((res) => {
        if (this.$tools.checkResponse(res)) {
          this.stat[0] = res.data.followingCount;
          this.stat[1] = res.data.followCount;
          this.stat = JSON.parse(JSON.stringify(this.stat));
        }
      });
    },
    deleteFollow(item, index) {
      let address = { address: item.address };
      var that = this;
      this.$api("follow.delete", address).then((res) => {
        if (that.$tools.checkResponse(res)) {
          this.list[index].isFollow = false;
          this.showFollownum();
        }
      });
    },
    addFollow(item, index) {
      let address = { address: item.address };
      var that = this;
      this.$api("follow.add", address).then((res) => {
        if (that.$tools.checkResponse(res)) {
          that.list[index].isFollow = true;
          this.showFollownum();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Montserrat-Regular";
  font-size: 48rpx;
  font-weight: 400;
}
.no-content-tip{
  color: rgba(255, 255, 255, 1) !important;
}
.dialog-title-colse {
  border: none;
  padding: 0;
  .close-icon {
    width: 64rpx;
    height: 64rpx;
  }
}
.dialog-title-num {
  font-size: 32rpx;
  padding-left: 30rpx;
}
.dialog-u-name {
  font-weight: 400;
  color: #1d1e22;
}
.scroll-box {
  height: 70vh;
  background-color: #242736;
  padding: 36rpx 20rpx 150rpx 20rpx;
}
.follow-item {
  display: flex;
  margin: 20rpx auto;
  align-items: center;
  .avatar {
    cursor: pointer;
  }
  .dialog-u-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-left: 20rpx;
    cursor: pointer;
  }
  .dialog-u-detail {
    display: flex;
    width: 160rpx;
    justify-content: space-between;
    .dialog-u-header {
      width: 116rpx;
      height: 116rpx;
      border-radius: 50%;
    }
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
}
.cu-item{
  color: rgba(255, 255, 255, 0.8);
}
.text-black {
  color: rgba(255, 255, 255, 1);
}
.follow {
  .nav {
    padding-top: 60rpx !important;
  }
}
</style>
