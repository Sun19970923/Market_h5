import NFT1155Tradable from "../../build/contracts/NFT1155Tradable.json";
let nft1155TradableManager = null;
class NFT1155TradableManager {
  constructor() {
    nft1155TradableManager = nft1155TradableManager || this;
    return nft1155TradableManager;
  }

  getContractToUse() {
    return {
      NFT1155Tradable
    };
  }

}
nft1155TradableManager = new NFT1155TradableManager();
export default nft1155TradableManager;
