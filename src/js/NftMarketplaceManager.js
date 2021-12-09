import NftMarketplace from "../../build/contracts/NftMarketplace.json";
let nftmarketplace = null;
class NftMarketplaceManager {
    constructor() {
        nftmarketplace = nftmarketplace || this;
        return nftmarketplace;
    }

    getContractToUse() {
        return {
            NftMarketplace
        };
    }



}
nftmarketplace = new NftMarketplaceManager();
export default nftmarketplace;
