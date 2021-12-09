import Web3 from "web3";
import app from '@/main';
import store from "@/store";
import tools from "@/util/tools.js"
import { readonlyWeb3 } from '@/api/index.js'


const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );


export default {
  async connectWeb3() {
    var error = "";
    if (window.ethereum) {
      try {
        var t = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!t) {
          error = "MetaMask enable Error";
          return { error };
        }
        var web3 = new Web3(window.ethereum);
        window.wallet  = web3;
        // var isListening = await promisify(cb => web3.eth.net.isListening(cb))
        // var networkId = await promisify(cb => web3.eth.net.getId(cb));
        var networkId = await promisify(cb => web3.eth.getChainId(cb));
        var coinbase = await promisify(cb => web3.eth.getCoinbase(cb));

        window.ethereum.once("accountsChanged", this.accountsChanged);
        window.ethereum.on("chainChanged", this.chainChanged);
        window.ethereum.on("disconnect", this.disconnect);
        let isListening = true;
        return { isListening, networkId, coinbase }
      } catch(e) {
        error = e.message;
      }
    } else {
      error = "MetaMask not Install";
    }
    return { error };
  },
  accountsChanged(accounts) {
    if(!store.state.connected) return;
    store.dispatch("logout")
    if(accounts.length){
      location.reload();
    }
  },
  chainChanged(channelId) {
    let config = store.state.config;
    if (parseInt(channelId) != parseInt(config.networkId) ) {
      tools.messageBox(app.$t('global.errNetwork'),
        app.$t('global.changeNetworkTo') +
        tools.networkName(config.networkId));
    }
  },
  disconnect(error) {
    if(!store.state.connected) return;
    store.dispatch("logout");
  },
  async getTransaction(tx) {
    let web3 = this.getWeb3();
    try {
      return await promisify(cb => web3.eth.getTransaction(tx, cb));
    } catch (e) {
      return { error: e.message }
    }
  },
  getWeb3() {
    return window.wallet;
  },
  async loginWallet(address) {
    let timestamp = parseInt(new Date().getTime()/1000);
    var message = store.state.signMessage + " " + timestamp;
    try {
      let signature = await this.sign(message, address);
      return {
        signature: signature,
        timestamp: timestamp,
      }
    } catch (e) {
      return { error: e.message }
    }
  },
  async sign(message, address) {
    var web3 = window.wallet;
    try {
      let signature = await promisify(cb => web3.eth.personal.sign(message, address, cb));
      return signature;
    } catch (e) {
      return { error: e.message }
    }
  },
  async checkWeb3(web3) {
    if (window.ethereum) {
      try {
        // var isListening = await promisify(cb => web3.eth.net.isListening(cb))
        // if (!isListening) return false;
        return true;
      } catch {
      }
    }
    return false;
  },
  async monitorWeb3() {
    let web3 = window.wallet;
    if (typeof web3 == "undefined" || !web3) return;
    var result = await this.checkWeb3(web3);
    if (!result) {
      var result = await this.connectWeb3();
      if (result.error) return;
      web3 = window.wallet;
    }
    let config = store.state.config;
    var networkId = await promisify(cb => web3.eth.getChainId(cb));

    if (networkId != config.networkId) {
      tools.messageBox(app.$t('global.errNetwork'),
        app.$t('global.changeNetworkTo') + tools.networkName(config.networkId));
    }
  },
  async changeNetwork(network){
    try{
      let result = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + network.channelId.toString(16) }],
      });
      return result;
    }catch(e){
      if(e.code == 4001) return { error: e.message  };
      try{
        let result = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x" + network.channelId.toString(16),
            chainName: network.name,
            nativeCurrency:{
              name: network.coinSymbol,
              symbol: network.coinSymbol,
              decimals: 18,
            },
            rpcUrls: [ network.rpc ],
          }]
        });
        return result;
      }catch(e){
        return { error: e.message }
      }
    }
  },

}
