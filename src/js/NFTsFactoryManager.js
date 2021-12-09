import NFTsFactory from "../../build/contracts/NFTsFactory.json";
let nftsfactoryManager = null;
class NFTsFactoryManager {
  constructor() {
      nftsfactoryManager = nftsfactoryManager || this;
    return nftsfactoryManager;
  }

  getContractToUse() {
    return {
        NFTsFactory
    };
  }



}
nftsfactoryManager = new NFTsFactoryManager();
export default nftsfactoryManager;
