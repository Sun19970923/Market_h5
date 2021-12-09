<template>
	<view v-if='url' class='flex justify-between align-center audio' >
		<view class='mr-3'  @click='start(audioId)'>
      <view class="play-icon iconfont icon-play-fill" v-show="!status"></view>
      <view class="play-icon iconfont icon-stop-fill" v-show="status"></view>
		</view>
		<view class='flex-1'>
			<slider block-size="20" @change='changeAudio' :activeColor='activeColor' :min='0' :max='duration.toFixed(0)' :value='currentTime.toFixed(0)' :step='0.1'></slider>
		</view>
		<view class='ml-3'>{{getTime(Math.round(currentTime))}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				context: null,
				currentTime: 0,
				duration: 100,
				status: false
			}
		},
		props: {
			url: String,
      loopPlay: {
        type: Boolean||String,
        default: false,
      },
      autoPlay: {
        type: Boolean||String,
        default: false,
      },
			activeColor: {
				type: String,
				default: '#0E7EFC'
			},
			startPic: String,
			endPic: String,
			audioId: [String,Number]
		},
		created() {
			this.context = uni.createInnerAudioContext();
			this.context.src = this.url;
			this.onTimeUpdate();
			this.onCanplay();
			this.onEnded();
			uni.$on('stop',(id)=> {
				if(id && id != this.audioId) {
					this.context.stop();
					this.status = false;
				} else if(!id){
					this.context.stop();
					this.status = false;
				}
			})
      if(this.autoPlay){
        this.start(this.audioId);
      }

		},
		methods: {
			start(id) { //点击播放
				let audioId = id;
				if(this.status) {
					this.context.pause();
					this.status = !this.status;
				}else {
					uni.$emit('stop',id)
					this.context.play()
					this.status = !this.status;
				}
			},
			onCanplay() { //进入可播放状态
				this.context.onCanplay(() => {
					this.context.duration;
					setTimeout(()=>{
						this.duration = this.context.duration;
					},1000)
				})
			},
			onTimeUpdate() { //音频播放进度
				this.context.onTimeUpdate(() => {
					this.duration = this.context.duration;
					this.currentTime = this.context.currentTime;
				})
			},
			onEnded() { //播放结束
				this.context.onEnded(()=> {
					this.status = false;
					this.currentTime = 0;
          if(this.loopPlay){
            this.start(this.audioId);
          }
				})
			},
			changeAudio(e) {
				let paused = this.context.paused;
				this.context.pause();
				this.context.seek(e.detail.value)
				if(!paused) {
					this.context.play();
				}
			},
			getTime(time) {
				let m = parseInt(time / 60);
				let s = time % 60;
				return this.towNum(m) + ':' + this.towNum(s);
			},
			towNum(num) {
				if(num >= 10) {
					return num;
				}else {
					return '0' + num;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.audio {
		background: #F4F4F4;
		padding: 10rpx;
	}
  .iconfont{
    font-size: 80rpx;
    color: $primaryColor;
  }

	.icon {
		width: 80rpx;
		height: 80rpx;
	}

	.flex {
		display: flex;
		flex-direction: row;
	}

	.justify-between {
		justify-content: between;
	}

	.align-center {
		align-items: center;
	}

	.flex-1 {
		flex: 1;
	}

	.ml-3 {
		margin-left: 30rpx;
	}

	.mr-3 {
		margin-right: 30rpx;
	}
</style>


