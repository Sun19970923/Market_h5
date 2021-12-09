<script>
import Vue from "vue";
export default {
  name: "App",
  beforeCreate: async function () {
    await this.$store.dispatch("config");
    let result = await this.$store.dispatch("connect", true);
    await this.$store.dispatch("categorys");
    await this.$store.dispatch("payTokens");
    this.$store.dispatch("countNotices");
    if (result) {
      await this.$store.dispatch("reload");
    }
    this.$store.commit("WEB_LOADING");
  },
  onLaunch: async function () {
    uni.navigateTo({ url: "/" });
    await this.setAppInfo();
  },
  onShow: function () {
    console.log("App Show");
    
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    async setAppInfo() {
      let platform = "";
      return new Promise((resolve, reject) => {
        uni.getSystemInfo({
          success: function (e) {
            Vue.prototype.StatusBar = 8;
            Vue.prototype.CustomBar = 45;

            uni.setStorageSync("platform", platform);
            resolve(platform);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/static/colorui/main.css";
@import "@/static/colorui/icon.css";
@import "@/static/style/common.css";
@import "@/styles/index.scss";

uni-radio:not([disabled]) .uni-radio-input:hover,
uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
  border-color: #ccc !important;
}
page {
  -webkit-overflow-scrolling: touch;
  background: #fff;
  width: 100%;
  font-size: 30upx;
  font-family: NotoSansHans-Bold;
  word-break: break-all;
  color: #333;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}

/*每个页面公共css */
.leftArrow:before {
  content: "\e60c";
}

.button::after {
  border: none;
}

/*每个页面公共css */
</style>
