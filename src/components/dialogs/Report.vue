<template>
  <el-dialog :model-value="visible" :show-close="false" :close-on-click-modal="false"
    @close="$emit('close')"
    @closed="closed"
    custom-class="clubart-dialog"
    destroy-on-close
  >
    <template #title>
      <view class="clubart-dialog-title">
        <view class="left">
          <span>{{$t('dialog.followSteps')}}</span>
        </view>
        <view class="right" @click="$emit('close')">
          <img class="close-img" src = "@/assets/create-img/pop_shut.png ">
        </view>
      </view>
    </template>
    
    <view class="clubart-dialog-body">
      <view class="all-error" v-if="error.all"> {{ error.all }} </view>
      <view class="process"  >
        <view class="step-info" >
          <view class="text" >
              <span>{{$t('dialog.approveCollection')}}</span>
          </view>
          <span
            v-if="step.approve != 1"
            :class="step.approve== 2 ? 'finish': ''"
            class="step iconfont icon-seleted"
          ></span>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/assets/img/loading.png" />
          </view>
 
        </view>
        <view class="process-btn">
          <el-button  type="success" v-if="step.approve == 0">{{$t('dialog.approve')}}</el-button>
          <el-button  disabled type="info" v-else-if="step.approve == 1">{{$t('dialog.inProgress')}}</el-button>
          <el-button disabled type="info" v-else>{{$t('dialog.done')}}</el-button>
        </view>
        <view class="process-error" v-if="error.approve">{{ error.approve }}</view>
      </view>
      <view class="process">
        <view class="step-info" >
          <view class="text" >
              <span>{{$t('dialog.cyn')}}</span>
          </view>
          <span 
              v-if="step.mint != 1"
              :class="step.mint== 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></span>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/assets/img/loading.png" />
          </view>
        </view>
        <view class="process-btn">
          <el-button  disabled type="info" v-if="step.approve != 2">{{$t('dialog.mint')}}</el-button>
          <el-button  type="success" v-else-if="step.mint ==0">{{$t('dialog.mint')}}</el-button>
          <el-button  disabled type="info" v-else-if="step.mint == 1">{{$t('dialog.inProgress')}}</el-button>
          <el-button disabled type="info" v-else>{{$t('dialog.done')}}</el-button>
        </view>
        <view class="process-error" v-if="error.mint">{{ error.mint }}</view>
      </view>
      <view class="process">
        <view class="step-info" >
          <view class="text" >
              <span >{{$t('dialog.signsSale')}}</span>
          </view>
          <span 
              v-if="step.sale != 1"
              :class="step.sale == 2 ? 'finish': ''"
              class="step iconfont icon-seleted"></span>
          <view class="step loading" v-else>
            <img class="loading-animation" src="@/assets/img/loading.png" />
          </view>
        </view>
        <view class="process-btn">
          <el-button  disabled type="info" v-if="step.mint != 2">{{$t('dialog.sale')}}</el-button>
          <el-button  type="success" v-else-if="step.sale ==0">{{$t('dialog.sale')}}</el-button>
          <el-button  disabled type="info" v-else-if="step.sale == 1">{{$t('dialog.inProgress')}}</el-button>
          <el-button disabled type="info" v-else>{{$t('dialog.done')}}</el-button>
        </view>
        <view class="process-error" v-if="error.sale">{{ error.sale }}</view>
      </view>

    </view>
  </el-dialog>
</template>

<script>
export default {
  data: function(){
    return {
      visible: this.show,
      step:{
        approve: 0,
        mint: 0,
        sale: 0,
        report: 0,
      },
      error:{
        all: "All Error",
        approve: "Approve Error",
        mint: "Mint Error",
        sale: "Sale Error",
      }
    }
  },
  props: {
    show:{
      type: Boolean,
      default: false,
    },
    nft: {
      type: Object,
      default: {},
    },
    form: {
      type: Object,
      default: {},
    }
  },
  watch:{
    show(val){
      console.log("watch show", this.show, val);
      this.visible = this.show;
    },
  },
  methods: {
    confirm(data){
      this.$emit("confirm", data);
    },
    close(){
      this.$emit("close");
    },
    closed(){
      this.step = {
        approve: 0,
        mint: 0,
        sale: 0,
      }
    },
  },
}

</script>
<style lang="scss" scoped>
</style>

