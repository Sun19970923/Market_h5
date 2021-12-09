// import { ElMessageBox, ElMessage } from "element-plus";
import app from '@/main';
import store from '@/store'
import web3 from '@/util/web3'
import BigNumber from 'bignumber.js'
import i18n from "@/i18n/i18n.js";

const NETWORKS = {
  "1": "Main",
  "2": "Morden",
  "3": "Ropsten",
  "4": "Rinkeby",
  "42": "Kovan",
  "5777": "Ganache",
  "56": "Bnb",
  "97": "Bnb Testnet",
  "137": "Polygon",
  "80001": "Polygon Mumbai",
};
const NOTIFY_TYPE = {
  "1": "FOLLOW",
  "2": "LIKE",
  "3": "TRADE",
}


const NOTIFY_SUB_TYPE = {
  "1": "SALE",  // 无
  "2": "EDIT_SAlE", // 无
  "3": "CANCEL_SALE", // 自己
  "4": "BUY", // 通知卖方
  "5": "BID",   // onwers
  "6": "EDIT_BID",  // onwers
  "7": "CANCEL_BID", // onwers + 自己
  "8": "ACCEPT_BID",  // 卖方
  "9": "MINT",  // 自己
  "10": "LIKING", // 无
  "11": "LIKEd",  // creator
  "12": "FOLLOWING",    // 无
  "13": "FOLLOWED",   // 被关注者
  "14": "BURN",   // 自己
  "15": "TRANSFER",   // 发送者
  "16": "RECEIVE",    // 接收者
  "17": "BOUGHT",   // 通知买方
  "18": "BIDDEN",   // 买方
}

let messageBoxStatus = true;

export default {
  messageConnect(){
    uni.showModal({
      content: app.$t('global.connect'),
      confirmText: app.$t('global.confirm'),
      cancelText: app.$t('global.cancel'),
      confirmColor: store.state.primaryColor,
      success: function(res){
        if (res.confirm) {
          store.dispatch("connectAndSign");
        }
      }
    });
  },
  needLogin(){
    if(!store.state.connected){
      this.messageConnect();
      return false;
    }
    if(!store.state.isLogin){
      store.dispatch("signLogin");
      return false;
    }
    return true;
  },
  needConnected(){
    if(!store.state.connected){
      this.messageConnect();
      return false;
    }
    return true;
  },
  minPriceLimit(price, paytoken){
    let value = new BigNumber(price);
    value = value.multipliedBy(new BigNumber(10).exponentiatedBy(paytoken.decimals));
    value = value.toFixed();
    if(value >= 1) return true;
    return false;
  },
  singlePrice(price, quanlity){
    let value = new BigNumber(price);
    value = value.dividedBy(new BigNumber(quanlity)).toFixed();
    return value;
  },
  getNotifyType(type){
    return NOTIFY_TYPE[type];
  },
  getNotifySubType(subType){
    return NOTIFY_SUB_TYPE[subType];
  },
  checkResponse(response) {
    if (!response.errno) {
      return true;
    }
    return false;
  },
  serializeNfts(nfts){
    let _nfts = [];
    for (var i = 0; i < nfts.length; i++) {
      let nft = nfts[i];
      _nfts.push(nft.nft.address + ":" + nft.nft.tokenId);
    }
    return _nfts.join(",");
  },
  serializeNfts2(nfts){
    let _nfts = [];
    for (var i = 0; i < nfts.length; i++) {
      let nft = nfts[i];
      _nfts.push(nft.token + ":" + nft.tokenId);
    }
    return _nfts.join(",");
  },
  str2num(n) {
    var _n = parseFloat(n);
    if (isNaN(_n) || _n != n) return;

    if (!(Number(_n) === _n && _n % 1 !== 0) && !(Number(_n) === _n && _n % 1 === 0)) {
      return;
    }
    return _n;
  },
  isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  },
  decimal(num, v) {
    if(!v) v = store.state.decimal;
    var vv = Math.pow(10, v);
    return Math.round(num * vv) / vv;
  },
  // fullImageUrl(url) {
  //   var staticPath = store.state.config.ipfsUrl;
  //   staticPath = staticPath + url
  //   return staticPath;
  // },
  isAudioUrl(url){
    return [".mp3", ".wav", ".oga"].some(function(ext){
      return url.endsWith(ext)
    })
  },
  isVideoUrl(url){
    return [".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".mov"].some(function(ext){
      return url.endsWith(ext)
    })
  },
  networkName(networkId) {
    var name = NETWORKS[networkId];
    if (!name) {
      return "unknown network";
    }
    return name;
  },
  delHashFormat(hash) {
    if (hash.startsWith('0x')) return hash.slice(2, hash.length)
    return hash;
  },
  message(message, type = "") {
    uni.showToast({
      title: message,
      icon: "none"
    })
  },
  messageBox(title, content, confirmText = "") {
    if (!messageBoxStatus) return;
    messageBoxStatus = false;
    uni.showModal({
      title: title,
      content: content,
      confirmText: confirmText || app.$t('global.confirm'),
      confirmColor: store.state.primaryColor,
      showCancel: false,
      success: function(res){
        messageBoxStatus = true;
      },
      fail: function(res){
        messageBoxStatus = true;
      },
      complete: function(res){
        messageBoxStatus = true;
      }
    });
  },
  time(item) {
    let nowTimeStamp = new Date().getTime();
    let updateTimeStamp = new Date(item.addtime).getTime();
    let newTime = nowTimeStamp - updateTimeStamp;
    let finallyTime;
    if (newTime / 1000 / 3600 / 24 < 1) {
      if (newTime / 1000 / 3600 < 1) {
        if (newTime / 1000 / 60 < 1) {
          finallyTime = parseInt(newTime / 1000) + " seconds ago";
        } else {
          finallyTime = parseInt(newTime / 1000 / 60) + " minutes ago";
        }
      } else {
        finallyTime = parseInt(newTime / 1000 / 3600) + " hours ago";
      }
    } else {
      finallyTime = parseInt(newTime / 1000 / 3600 / 24) + " days ago";
    }
    return finallyTime;
  },
  formatTime(time) {
    if((time+'').length == 10){
      time = time * 1000
    }
    let nowTimeStamp = new Date().getTime();
    let updateTimeStamp = new Date(time).getTime();
    let newTime = nowTimeStamp - updateTimeStamp;
    let finallyTime;
    if (newTime / 1000 / 3600 / 24 < 1) {
      if (newTime / 1000 / 3600 < 1) {
        if (newTime / 1000 / 60 < 1) {
          finallyTime = parseInt(newTime / 1000) + " seconds ago";
        } else {
          finallyTime = parseInt(newTime / 1000 / 60) + " minutes ago";
        }
      } else {
        finallyTime = parseInt(newTime / 1000 / 3600) + " hours ago";
      }
    } else {
      finallyTime = parseInt(newTime / 1000 / 3600 / 24) + " days ago";
    }
    return finallyTime;
  },
  changeTime(time){
    if((time+'').length == 10){
        time = time * 1000
    }
    let year = new Date(time).getFullYear();
    let month = new Date(time).getMonth()+1;
    let day = new Date(time).getDate();
    let hour = new Date(time).getHours();
    let minute = new Date(time).getMinutes();
    let second = new Date(time).getSeconds();
    if(month<10){
        month = '0'+month;
    }
    if(day<10){
        day = '0'+day;
    }
    if(hour<10){
        hour = '0'+hour;
    }
    if(minute<10){
        minute = '0'+minute;
    }
    if(second<10){
        second = '0'+second;
    }
    let str = year+"/"+month+"/"+day+"  "+hour+":"+minute+":"+second
    return str;
  },
  analysis(param){
    if(!param)return '';
    let data=JSON.parse(param)
    return data;
  },
  formatSecond(second) {
    var days = Math.floor(second / 86400);
    var hours = Math.floor((second % 86400) / 3600);

    var minutes = Math.floor(((second % 86400) % 3600) / 60);
    var seconds = Math.floor(((second % 86400) % 3600) % 60);
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;
    var str = "";
    if(days){
      str = days + " " +  i18n.t('time.days') + " ";
    }
    str = str + hours + ":" + minutes + ":" + seconds;
    return str;
  },
  countData(leadTime){
    let hours;
    let minutes;
    let seconds;
    let countDown;
    hours = parseInt((leadTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = parseInt((leadTime % (1000 * 60 * 60)) / (1000 * 60));
    seconds = (leadTime % (1000 * 60)) / 1000;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    countDown = hours + ":" + minutes + ":" + seconds;
    return countDown;
  },
  parseMetaData(content){
    if(typeof(content) != "string") return content;
    try{
      return JSON.parse(content);
    }catch(e){
      return {};
    }
  },
};
