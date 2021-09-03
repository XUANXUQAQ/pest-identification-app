<template>
  <div>
    <div class="circle" style="background: white; position: fixed; left: 42%; top: 2vh">
      <svg-icon
        style="width: 150%; height: 150%; position: relative; left: 23%; top: 4%"
        icon-class="butterfly"
      ></svg-icon>
      <span style="font-size: 22px; position: relative; top: -30%; font-family: 华文琥珀, sans-serif; color: #5FAABE"> Identify </span>
    </div>

    <div style="position: relative; top: 16vh">
      <el-card
        class="content"
        id="imgContainer"
        v-bind:style="{ minWidth: canvasWidth, minHeight: canvasHeight, textAlign: 'center' }"
      >
        <!--canvas截取流-->
        <canvas
          v-show="isConfirm"
          ref="canvas"
          :width="realVideoWidth / widthContractPercent"
          :height="realVideoHeight / widthContractPercent"
        ></canvas>
        <!--图片展示-->
        <video
          v-show="!isConfirm && isStart"
          ref="video"
          :width="realVideoWidth / widthContractPercent"
          :height="realVideoHeight / widthContractPercent"
          autoplay
        ></video>
      </el-card>

      <div style="height: 20px"></div>

      <el-card
        class="msg"
        v-show="msgIsShow"
        style="width: 100%; height: 40vh; overflow-y: auto; font-size: 14px; border-radius: 15px"
      >
        <mt-swipe
          style="
            width: 100%;
            height: 20vh;
            text-align: center;
            border-radius: 15px;
            box-shadow: 0 0 5px black;
          "
        >
          <mt-swipe-item v-for="(item, index) in pestInfo.imgSrcs" :key="index">
            <img :src="item" style="height: 100%" alt />
          </mt-swipe-item>
        </mt-swipe>

        <div v-for="each in pestInfoList" :key="each.name">
          <div class="pestName" style="font-size: 35px; text-align: center; color: #5FAABE">
            <h2>{{ each.name }}</h2>
            <h4>数量：{{ each.num }}</h4>
          </div>
          <div class="ORG">
            <div class="order">
              <h4>目：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.order }}</h4>
            </div>
            <div class="family">
              <h4>科：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.family }}</h4>
            </div>
            <div class="genus">
              <h4>属：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.genus }}</h4>
            </div>
          </div>
          <div class="plant"><h4>危害的植物：</h4></div>
          <div style="margin-left: 5vw; margin-right: 5vw; text-indent: 2em; font-size: 16px; color: #5FAABE">
            {{ each.plant }}
          </div>
          <div style="margin: 15px"></div>
          <div class="area"><h4>主要活动区域：</h4></div>
          <div style="margin-left: 5vw; margin-right: 5vw; text-indent: 2em; font-size: 16px; color: #5FAABE">
            {{ each.area }}
          </div>
        </div>
        <div style="margin: 15px">
          <hr />
        </div>
      </el-card>
      <div style="text-align: center">
        <mt-button v-show="isStart" @click="changeCamera">
          <svg-icon icon-class="camera"></svg-icon>
        </mt-button>
      </div>

      <div style="height: 25px"></div>

      <div
        style="justify-content: space-between; display: flex; text-align: center; margin: 0 10vw"
      >
        <div>
          <el-button
            class="function-button"
            type="primary"
            v-show="isStart"
            @click="confirm"
            style="width: 25vw; height: 8vh"
            >确定</el-button
          >
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
            <el-button class="function-button" type="primary" style="width: 25vw; height: 8vh">本地上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import baseURLs from '@/network/baseURLs';

let loading;

function copy(obj1, objDest) {
  const obj2 = objDest || {}; // 最初的时候给它一个初始值=它自己或者是一个json
  for (const name in obj1) {
    if (typeof obj1[name] === 'object') {
      // 先判断一下obj[name]是不是一个对象
      obj2[name] = obj1[name].constructor === Array ? [] : {}; // 我们让要复制的对象的name项=数组或者是json
      copy(obj1[name], obj2[name]); // 然后来无限调用函数自己 递归思想
    } else {
      obj2[name] = obj1[name]; // 如果不是对象，直接等于即可，不会发生引用。
    }
  }
  return obj2; // 然后在把复制好的对象给return出去
}

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
        num: 0,
      },
      pestInfoList: [],
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
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL);
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.back, false); // false阻止默认事件
    }
    this.fakeImgPostUrl = `${baseURLs.databaseLocalURL}/imgFake`;
    this.getRealVideoSize();
    this.getDeviceId().then(() => {
      this.callCamera();
    });
  },
  destroyed() {
    window.removeEventListener('popstate', this.back, false);
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
    back() {
      this.cancel();
      this.$router.push({ path: '/' });
    },
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
      this.pestInfoList = [];
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
      // this.isStart = false;
      // this.isConfirm = false;
      this.closeCamera();
      location.reload();
    },
    confirm() {
      let imgBase64;
      if (isEmpty(this.imgData)) {
        const ctx = this.$refs.canvas.getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(
          this.$refs.video,
          0,
          0,
          this.realVideoWidth / this.widthContractPercent,
          this.realVideoHeight / this.widthContractPercent,
        );
        // 转base64格式、图片格式转换、图片质量压缩
        imgBase64 = this.$refs.canvas.toDataURL('image/jpeg', 1);
      } else {
        const ctx = this.$refs.canvas.getContext('2d');
        const img = new Image();
        img.src = this.imgData;
        const self = this;
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            self.realVideoWidth / self.widthContractPercent,
            self.realVideoHeight / self.widthContractPercent,
          );
        };
        imgBase64 = this.imgData;
      }
      this.drawImage(imgBase64);
      this.isStart = false;
      this.isConfirm = true;
      this.closeCamera();
    },
    callCamera() {
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
              const result = res[lastFileName].statistics;
              const processedImage = new Image();
              processedImage.src = `data:image/jpeg;base64,${res[lastFileName].img}`;
              if (result.hasOwnProperty('error')) {
                throw new Error('error');
              }
              this.closeLoading();
              this.pestInfo.imgSrcs = [];
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
                    this.pestInfo.num = result[each];
                    const ctx = this.$refs.canvas.getContext('2d');
                    // 把当前视频帧内容渲染到canvas上
                    ctx.drawImage(
                      processedImage,
                      0,
                      0,
                      this.realVideoWidth / this.widthContractPercent,
                      this.realVideoHeight / this.widthContractPercent,
                    );
                    if (tmp.image) {
                      let images = tmp.image.split('|');
                      if (images.length === 2) {
                        images = images[1].split('&');
                        images.forEach((eachImg) => {
                          this.pestInfo.imgSrcs.push(eachImg);
                        });
                      }
                    }
                    let tmpData = {};
                    tmpData = copy(this.pestInfo, tmpData);
                    this.pestInfoList.push(tmpData);
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
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.circle {
  border-radius: 50%;
  width: 65px;
  height: 65px;
  /* 宽度和高度需要相等 */
}

.ORG {
  font-size: 20px;
  margin-left: 5vw;
  color: #5FAABE;
}

.plant {
  margin-left: 5vw;
  font-size: 18px;
  color: #5FAABE;
}

.area {
  margin-left: 5vw;
  font-size: 18px;
  color: #5FAABE;
}

.content::before {
  content: '';
  position: absolute;
  filter: blur(20px);
  z-index: -1;
}

.function-button {
  background-color: #e8f9ff;
  background-image: linear-gradient(90deg, #e8f9ff 0%, #fdffe8 100%);
  border-width: 0;
  color: #45CBED;
}
</style>
