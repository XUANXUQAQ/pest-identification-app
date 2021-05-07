<template>
  <div>
    <el-card id="imgContainer" v-bind:style="{ width: canvasWidth, height: canvasHeight, textAlign: 'center' }">
      <!--canvas截取流-->
      <canvas v-show="isConfirm" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
      <!--图片展示-->
      <video v-show="!isConfirm && isStart" ref="video" :width="canvasWidth" :height="canvasHeight" autoplay></video>
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
      <!-- todo 信息显示 -->

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
      style="justify-content: space-between; width: 90%; display: flex;
      position: fixed; bottom: 3vh"
    >
      <div style="margin-left: 15vw">
        <mt-button type="primary" v-show="isStart" @click="confirm">确定</mt-button>
      </div>
      <div style="margin-right: 15vw">
        <mt-button type="primary" v-show="isStart" @click="cancel">取消</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

let loading;
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
    };
  },
  computed: {
    canvasWidth() {
      return document.documentElement.clientWidth * 0.8;
    },
    canvasHeight() {
      return document.documentElement.clientHeight * 0.3;
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
          this.openLoading();
          this.$yolov4Api
            .startPredict()
            .then((res) => {
              this.closeLoading();
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
    },
  },
};
</script>

<style scoped>

</style>
