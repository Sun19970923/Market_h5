<script>
export default {
  computed:{
    connected(){
      return this.$store.state.connected;
    },
    user(){
      return this.$store.state.user;
    },
    payTokens() {
        return JSON.parse(JSON.stringify(this.$store.state.payTokens));
    }
  },
  methods: {
    getAddressAsset(owners, address){
      for(var i = 0; i < owners.length; i++){
        let owner = owners[i];
        owner.address = owner.address.toLocaleLowerCase();
        if(address.toLocaleLowerCase() == owner.address){
          return owner;
        }
      }
    },
    getLowestAsset(owners){
      let lowestAsset;
      for(var i = 0; i < owners.length; i++){
        let owner = owners[i];
        owner.address = owner.address.toLocaleLowerCase();
        if(!owner.onsell) continue;

        owner.singlePrice = this.$tools.singlePrice(
          owner.price,
          owner.sellValue,
        )
        owner.singleUsdtPrice = this.$tools.decimal(
         owner.payToken? owner.singlePrice * owner.payToken.rate:'0',
        );
        if(
          !lowestAsset ||
          parseFloat(lowestAsset.singleUsdtPrice) > 
            parseFloat(owner.singleUsdtPrice)
        ){
          lowestAsset = owner;
        }
      }
      return lowestAsset;
    },
    getActiveAddressBid(bids, address){
      for(var i = 0; i < bids.length; i++){
        let bid = bids[i];
        bid.address = bid.address.toLocaleLowerCase();
        if (
          bid.expired ||
          bid.status != 0 ||
          bid.type == this.$sdk.valueCommonType("CANCEL_BID") ||
          bid.type == this.$sdk.valueCommonType("ACCEPT")
        )
          continue;
        if(address.toLocaleLowerCase() == bid.address.toLocaleLowerCase()) return bid;
      }
    },
    getHighestBid(bids){
      let highestBid;
      for(var i = 0; i < bids.length; i++){
        let bid = bids[i];
        bid.address = bid.address.toLocaleLowerCase();
        if (
          bid.expired ||
          bid.status != 0 ||
          bid.type == this.$sdk.valueCommonType("CANCEL_BID") ||
          bid.type == this.$sdk.valueCommonType("ACCEPT")
        )
          continue;
        bid.singlePrice = this.$tools.singlePrice(
          bid.sellValue,
          bid.buyerValue,
        );
        bid.singleUsdtPrice = this.$tools.decimal(
          bid.payToken?bid.singlePrice * bid.payToken.rate:'0'
        );
        if(
          !highestBid ||
          parseFloat(highestBid.singleUsdtPrice) <
            parseFloat(bid.singleUsdtPrice)
        ) {
          highestBid = bid;
        }
      }
      return highestBid;
    },


  },
}
</script>
