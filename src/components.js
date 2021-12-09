import Vue from 'vue'
import Avatar from '@/components/Avatar';
import Jazzicon from '@/components/components';
import cuCustom from '@/static/colorui/components/cu-custom.vue'
import myFilter from '@/components/myFilter';
import popup from '@/components/uni-popup/components/uni-popup/uni-popup';
import transition from '@/components/uni-transition/components/uni-transition/uni-transition';
import MesPopup from '@/components/MesPopup';
import Share from "@/components/Share";
import myInput from '@/components/my-input';
import FreeAudio from '@/components/FreeAudio';
import NoContent from "@/components/NoContent";
import FullScreen from "@/components/FullScreen";
import PageLoading from "@/components/PageLoading";

import BuyDialog from "@/components/dialogs/Buy";
import BidDialog from "@/components/dialogs/Bid";
import SaleDialog from "@/components/dialogs/Sale";
import CancelSaleDialog from "@/components/dialogs/CancelSale";
import CancelBidDialog from "@/components/dialogs/CancelBid";
import TransferDialog from "@/components/dialogs/Transfer";
import BurnDialog from "@/components/dialogs/Burn";
import AcceptDialog from "@/components/dialogs/Accept";




import SideBar from "@/components/SideBar"
import LoadStatus from "@/components/LoadStatus";
import searchPro from "@/pages/search-pro";
import NFTItem from "@/components/NFTItem";
import NFTItemLoad from "@/components/loading/NFTItemLoad";
import filePicker from '@/components/uni-file-picker/components/uni-file-picker/uni-file-picker.vue';
Vue.component('page-loading', PageLoading);
Vue.component('free-audio', FreeAudio);
Vue.component('Avatar', Avatar);
Vue.component('jazzicon', Jazzicon);
Vue.component('myFilter', myFilter);
Vue.component('uni-popup', popup);
Vue.component('uni-transition', transition);
Vue.component('MesPopup',MesPopup);
Vue.component('Share',Share)
Vue.component('my-input',myInput)
Vue.component("cu-custom", cuCustom)


Vue.component("buy-dialog", BuyDialog);
Vue.component("bid-dialog", BidDialog);
Vue.component("sale-dialog", SaleDialog);
Vue.component("cancel-sale-dialog", CancelSaleDialog);
Vue.component("cancel-bid-dialog", CancelBidDialog);
Vue.component("transfer-dialog", TransferDialog);
Vue.component("burn-dialog", BurnDialog);



Vue.component("side-bar", SideBar);
Vue.component("no-content", NoContent);
Vue.component("full-screen", FullScreen);
Vue.component("accept-dialog", AcceptDialog);
Vue.component("load-status", LoadStatus);
Vue.component("search-pro", searchPro);
Vue.component("nft-item", NFTItem);
Vue.component("nft-item-load", NFTItemLoad);
Vue.component("file-picker", filePicker);

export default Vue;
