<template>
  <div style="text-align: center; position: relative">
    <canvas v-show="false" ref="canvas" width="100%" height="100%"></canvas>
    <video class="content" v-show="isStart" ref="video" width="100%" height="100%" autoplay></video>
    <el-card
      v-show="querySuccessFlag"
      style="position: absolute; width: 30vw; height: 15vh; top: 3vh; right: 5vw; opacity: 0.5; z-index: 999"
    >
      <div class="name">{{ pestInfo.name }}</div>
      <div class="order">{{ pestInfo.order }}</div>
      <div class="family">{{ pestInfo.family }}</div>
      <div class="genus">{{ pestInfo.genus }}</div>
    </el-card>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

let loading;

export default {
  name: 'Video',
  data() {
    return {
      headImgSrc: '',
      isStart: false,
      imgCount: 0,
      msgIsShow: false,
      querySuccessFlag: false,
      pestInfo: {
        name: '',
        order: '',
        family: '',
        genus: '',
      },
      constraints: {
        audio: false,
        video: {
          deviceId: 'null',
          // 放在app里面需要下面配置一下
          permissions: {
            'video-capture': {
              description: 'Required to capture video using getUserMedia()',
            },
          },
        },
      },
      cameras: [],
    };
  },
  computed: {
    canvasWidth() {
      return document.documentElement.clientWidth;
    },
    canvasHeight() {
      return document.documentElement.clientHeight;
    },
  },
  methods: {
    async getDeviceId() {
      // 在页面加载完成后获得设备ID数组
      const res = await navigator.mediaDevices.enumerateDevices();
      res.forEach((each) => {
        if (each.kind === 'videoinput') {
          this.cameras.push(each);
          this.constraints.video.deviceId = each.deviceId;
        }
      });
    },
    openLoading() {
      loading = this.$vs.loading();
    },
    closeLoading() {
      if (loading) {
        loading.close();
      }
    },
    cancel() {
      this.isStart = false;
      this.closeCamera();
    },
    callCamera() {
      this.openLoading();
      this.isStart = true;
      // H5调用电脑摄像头API
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then((success) => {
          // 摄像头开启成功
          this.$refs.video.srcObject = success;
          // 实时拍照效果
          this.$refs.video.play();
          this.closeLoading();
        })
        .catch((error) => {
          console.error('摄像头开启失败，请检查摄像头是否可用！');
          console.error(error);
          this.closeLoading();
        });
    },
    closeCamera() {
      if (!this.$refs.video.srcObject) {
        return;
      }
      const stream = this.$refs.video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.$refs.video.srcObject = null;
    },
    drawImage() {
      setInterval(() => {
        if (!this.isStart) {
          return;
        }
        const { canvas } = this.$refs;
        const ctx = canvas.getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs.video, 0, 0, this.canvasWidth, this.canvasHeight);
        // 转base64格式、图片格式转换、图片质量压缩
        const imgBase64 = canvas.toDataURL('image/jpeg', 0.8);
        // 由字节转换为KB 判断大小
        const file = imgBase64.replace('data:image/jpeg;base64,', '');
        const name = `${this.imgCount}.jpg`;
        this.imgCount += 1;
        // 上传拍照信息  调用接口上传图片
        this.$yolov4Api
          .uploadImg({
            name,
            file,
          })
          .then(() => {
            this.$yolov4Api
              .startPredict()
              .then((res) => {
                const lastFileName = `${this.imgCount - 1}.jpg`;
                const result = res[lastFileName];
                if (result.hasOwnProperty('error')) {
                  throw 'error';
                }
                Object.keys(result).forEach((each) => {
                  this.$databaseApi
                    .selectSpeciesByCode(each)
                    .then((res2) => {
                      this.msgIsShow = true;
                      const tmp = res2.data[0];
                      this.pestInfo.name = tmp.name;
                      this.pestInfo.family = tmp.family_name;
                      this.pestInfo.order = tmp.order_name;
                      this.pestInfo.genus = tmp.genus_name;
                      this.querySuccessFlag = true;
                    })
                    .catch(() => {
                      this.querySuccessFlag = false;
                      Toast({
                        message: '获取预测信息失败',
                        position: 'middle',
                        duration: 2000,
                      });
                    });
                });
              })
              .catch(() => {
                this.querySuccessFlag = false;
                Toast({
                  message: '获取预测信息失败',
                  position: 'middle',
                  duration: 2000,
                });
              });
          })
          .catch((err) => {
            this.querySuccessFlag = false;
            Toast({
              message: err.message,
              position: 'middle',
              duration: 2000,
            });
          });
      }, 3000);
    },
  },
  mounted() {
    this.getDeviceId().then(() => {
      this.callCamera();
      this.drawImage();
    });
  },
  beforeDestroy() {
    this.cancel();
  },
};
</script>

<style scoped>
.content {
  line-height: 2;
  margin: auto;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.content::before {
  content: '';
  position: absolute;
  filter: blur(20px);
  z-index: -1;
}
</style>
