<template>
  <div>
    <el-card
      id="imgContainer"
      v-bind:style="{ width: canvasWidth, height: canvasHeight, textAlign: 'center' }"
    >
      <canvas v-show="false" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
      <video
        v-show="!isConfirm && isStart"
        ref="video"
        :width="canvasWidth"
        :height="canvasHeight"
        autoplay
      ></video>
    </el-card>

    <el-card
      style="position: fixed; width: 30vw; height: 15vh; top: 15vh; right: 8vw; opacity: 0.5;"
    >
      <div class="name">{{pestInfo.name}}</div>
      <div class="order">{{pestInfo.order}}</div>
      <div class="family">{{pestInfo.family}}</div>
      <div class="genus">{{pestInfo.genus}}</div>
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
      isConfirm: false,
      imgCount: 0,
      msgIsShow: false,
      pestInfo: {
        name: '',
        order: '',
        family: '',
        genus: '',
      },
    };
  },
  computed: {
    canvasWidth() {
      return document.documentElement.clientWidth * 0.8;
    },
    canvasHeight() {
      return document.documentElement.clientHeight * 0.75;
    },
  },
  methods: {
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
      this.drawImage();
      this.isStart = false;
      this.isConfirm = true;
      this.closeCamera();
    },
    callCamera() {
      this.openLoading();
      this.isStart = true;
      this.isConfirm = false;
      // H5调用电脑摄像头API
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          facingMode: 'environment',
        })
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
        const ctx = this.$refs.canvas.getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs.video, 0, 0, this.canvasWidth, this.canvasHeight);
        // 转base64格式、图片格式转换、图片质量压缩
        const imgBase64 = this.$refs.canvas.toDataURL('image/jpeg', 0.8);
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
                      console.log(111111);
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
                this.cancel();
              });
          })
          .catch((err) => {
            Toast({
              message: err.message,
              position: 'middle',
              duration: 2000,
            });
            this.cancel();
          });
      }, 3000);
    },
  },
  mounted() {
    this.callCamera();
    this.drawImage();
  },
  beforeDestroy() {
    console.log(11111);
    this.cancel();
  },
};
</script>

<style scoped>
</style>
