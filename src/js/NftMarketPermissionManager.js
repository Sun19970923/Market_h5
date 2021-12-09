import NftMarketPermission from "../../build/contracts/NftMarketPermission.json";
let nftmarketPermission = null;
class NftMarketPermissionManager {
    constructor() {
        nftmarketPermission = nftmarketPermission || this;
        return nftmarketPermission;
    }

    getContractToUse() {
        return {
            NftMarketPermission
        };
    }



}
nftmarketPermission = new NftMarketPermissionManager();
export default nftmarketPermission;
