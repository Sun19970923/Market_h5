import NFT1155s from "../../build/contracts/NFT1155s.json";
let nft1155sManager = null;
class NFT1155Manager {
  constructor() {
    nft1155sManager = nft1155sManager || this;
    return nft1155sManager;
  }

  getContractToUse() {
    return {
      NFT1155s
    };
  }





}
nft1155sManager = new NFT1155Manager();
export default nft1155sManager;
