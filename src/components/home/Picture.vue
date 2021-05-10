<template>
  <div>
    <el-card class="content" id="imgContainer"
             v-bind:style="{ minWidth: canvasWidth, minHeight: canvasHeight, textAlign: 'center' }">
      <!--canvas截取流-->
      <canvas v-show="isConfirm" ref="canvas" :width="realVideoWidth / widthContractPercent"
              :height="realVideoHeight / widthContractPercent"></canvas>
      <!--图片展示-->
      <video v-show="!isConfirm && isStart" ref="video" :width="realVideoWidth / widthContractPercent"
             :height="realVideoHeight / widthContractPercent"
             autoplay></video>
      <svg-icon
        style="
        width: 100%;
        height: 100%;
        position: relative;
        bottom: 0;"
        icon-class="placeholder"
        v-show="!isStart && !isConfirm"
      ></svg-icon>
    </el-card>

    <div style="height: 20px"></div>

    <el-card
      class="msg"
      v-show="msgIsShow"
      style="
    width: 100%;
    height: 40vh;
    overflow-y: auto;
    font-size: 14px"
    >
      <mt-swipe style="width: 100%; height: 20vh; text-align: center; border-radius: 15px; box-shadow: 0 0 5px black">
        <mt-swipe-item v-for="(item, index) in pestInfo.imgSrcs" :key="index">
          <img :src="item" style="height: 100%" alt="">
        </mt-swipe-item>
      </mt-swipe>

      <div class="pestName" style="font-size: 24px">{{ pestInfo.name }}</div>

      <div class="ORG">
        <div class="order" style="font-size: 20px">目：{{ pestInfo.order }}</div>
        <div class="family" style="font-size: 18px">科：{{ pestInfo.family }}</div>
        <div class="genus" style="font-size: 16px">属：{{ pestInfo.genus }}</div>
      </div>
      <div class="plant">危害的植物：{{ pestInfo.plant }}</div>
      <div class="area">主要活动区域：{{ pestInfo.area }}</div>
    </el-card>

    <div style="height: 20px"></div>
    <div style="height: 5px"></div>
    <mt-button
      v-show="!isStart"
      type="primary"
      style="
        width: 27.5vw;
        margin-left: 31.25vw;"
      @click="callCamera"
    >开始识别
    </mt-button>

    <div
      style="justify-content: space-between; display: flex; text-align: center"
    >
      <div>
        <mt-button v-show="isStart" @click="changeCamera">
          <svg-icon icon-class="camera"></svg-icon>
        </mt-button>
      </div>

      <div>
        <el-button type="primary" v-show="isStart" @click="confirm">确定</el-button>
      </div>

      <div v-show="isStart">
        <el-upload
          :action="fakeImgPostUrl"
          :on-success="handleChange"
          :show-file-list="false"
          multiple
          ref="uploadImg"
          :file-list="fileList"
        >
          <el-button type="primary">本地上传</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import baseURLs from '@/network/baseURLs';

let loading;

function isEmpty(obj) {
  return typeof obj === 'undefined' || obj == null || obj === '';
}

export default {
  name: 'Picture',
  data() {
    return {
      isStart: false,
      isConfirm: false,
      imgCount: 0,
      msgIsShow: false,
      pestInfo: {
        name: '',
        order: '',
        family: '',
        genus: '',
        imgSrcs: [],
        plant: '',
        area: '',
      },
      imgData: '',
      realVideoWidth: 0,
      realVideoHeight: 0,
      widthContractPercent: 1,
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
      isFront: false,
      fakeImgPostUrl: '',
      fileList: [],
    };
  },
  mounted() {
    this.getDeviceId();
    this.getRealVideoSize();
    this.fakeImgPostUrl = `${baseURLs.databaseURL}/imgFake`;
  },
  computed: {
    canvasWidth() {
      return document.documentElement.clientWidth * 0.8;
    },
    canvasHeight() {
      return document.documentElement.clientHeight * 0.6;
    },
    currentDevice() {
      return this.constraints.video.deviceId;
    },
  },
  watch: {
    currentDevice: {
      handler() {
        if (this.isStart) {
          this.closeCamera();
          this.callCamera();
        }
      },
    },
  },
  methods: {
    getRealVideoSize() {
      const self = this;
      const video = document.querySelector('video');
      video.addEventListener('canplay', function () {
        self.realVideoWidth = this.videoWidth;
        self.realVideoHeight = this.videoHeight;
        const widthContractPercent = this.videoWidth / (document.documentElement.clientWidth * 0.8);
        self.widthContractPercent = widthContractPercent > 1 ? widthContractPercent : 1;
      });
    },
    clearData() {
      this.pestInfo.area = '';
      this.pestInfo.family = '';
      this.pestInfo.name = '';
      this.pestInfo.genus = '';
      this.pestInfo.order = '';
      this.pestInfo.imgSrcs = [];
      this.pestInfo.plant = '';
      this.imgData = '';
      this.fileList = [];
    },
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
    changeCamera() {
      if (this.isFront) {
        this.isFront = !this.isFront;
        this.constraints.video.deviceId = this.cameras[1].deviceId;
      } else {
        this.isFront = !this.isFront;
        this.constraints.video.deviceId = this.cameras[0].deviceId;
      }
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
      this.isConfirm = false;
      this.closeCamera();
    },
    confirm() {
      let imgBase64;
      if (isEmpty(this.imgData)) {
        const ctx = this.$refs.canvas.getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs.video, 0, 0, this.realVideoWidth / this.widthContractPercent, this.realVideoHeight / this.widthContractPercent);
        // 转base64格式、图片格式转换、图片质量压缩
        imgBase64 = this.$refs.canvas.toDataURL('image/jpeg', 1);
      } else {
        const ctx = this.$refs.canvas.getContext('2d');
        const img = new Image();
        img.src = this.imgData;
        const self = this;
        img.onload = function () {
          ctx.drawImage(img, 0, 0, self.realVideoWidth / self.widthContractPercent, self.realVideoHeight / self.widthContractPercent);
        };
        imgBase64 = this.imgData;
      }
      this.drawImage(imgBase64);
      this.isStart = false;
      this.isConfirm = true;
      this.closeCamera();
    },
    async callCamera() {
      this.openLoading();
      this.msgIsShow = false;
      this.isStart = true;
      this.isConfirm = false;
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
    handleChange(resp, file) {
      this.computeImgBase64(file);
    },
    computeImgBase64(file) {
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      // eslint-disable-next-line func-names
      reader.onload = function () {
        self.imgData = this.result;
        self.confirm();
      };
    },
    drawImage(imgBase64) {
      // 由字节转换为KB 判断大小
      const file = imgBase64.replace('data:image/jpeg;base64,', '');
      const name = `${this.imgCount}.jpg`;
      this.imgCount += 1;
      // 上传拍照信息  调用接口上传图片
      this.openLoading();
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
              this.closeLoading();
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
                    this.pestInfo.plant = tmp.plant;
                    this.pestInfo.area = tmp.area;
                    if (tmp.image) {
                      let images = tmp.image.split('|');
                      if (images.length === 2) {
                        images = images[1].split('&');
                        this.pestInfo.imgSrcs = images;
                      }
                    }
                  })
                  .catch(() => {
                    Toast({
                      message: '获取预测信息失败',
                      position: 'middle',
                      duration: 2000,
                    });
                    this.cancel();
                  });
              });
            })
            .catch(() => {
              Toast({
                message: '获取预测信息失败',
                position: 'middle',
                duration: 2000,
              });
              this.closeLoading();
              this.cancel();
            });
        })
        .catch((err) => {
          Toast({
            message: err.message,
            position: 'middle',
            duration: 2000,
          });
          this.closeLoading();
          this.cancel();
        });
    },
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
  background: rgba(255, 255, 255, .3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
  overflow: hidden;
}

.content::before {
  content: '';
  position: absolute;
  filter: blur(20px);
  z-index: -1;
}
</style>
