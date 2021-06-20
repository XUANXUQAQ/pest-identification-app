<template>
  <div>
    <div class="circle" style="background: white; position: fixed; left: 42%; top: 2vh">
      <svg-icon
        style="width: 150%; height: 150%; position: relative; left: 23%; top: 4%"
        icon-class="butterfly"
      ></svg-icon>
      <span style="font-size: 22px; position: relative; top: -30%; color: #5FAABE"> Identify </span>
    </div>
    <div class="content" style="text-align: center; position: relative; top: 15vh">
      <canvas
        v-show="false"
        ref="canvas"
        :width="realVideoWidth / widthContractPercent"
        :height="realVideoHeight / widthContractPercent"
      ></canvas>
      <video
        v-show="isStart"
        ref="video"
        :width="realVideoWidth / widthContractPercent"
        :height="realVideoHeight / widthContractPercent"
        autoplay
      ></video>
      <el-card
        style="
          position: fixed;
          top: 54vh;
          width: 85%;
          font-size: 16px;
          overflow-y: auto;
          border-radius: 15px"
      >
        <div v-for="each in pestInfoList" :key="each.name">
          <div class="pestName" style="font-size: 18px; text-align: center; color: #5FAABE">
            <h2>{{ each.name }}</h2>
          </div>
          <div class="ORG">
            <div class="order">
              <h5>目：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.order }}</h5>
            </div>
            <div class="family">
              <h5>科：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.family }}</h5>
            </div>
            <div class="genus">
              <h5>属：&nbsp;&nbsp;&nbsp;&nbsp;{{ each.genus }}</h5>
            </div>
          </div>
          <div style="margin: 15px"></div>
          <hr />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

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

export default {
  name: 'Video',
  data() {
    return {
      headImgSrc: '',
      isStart: false,
      isStillPredicting: false,
      imgCount: 0,
      msgIsShow: false,
      querySuccessFlag: false,
      realVideoWidth: 0,
      realVideoHeight: 0,
      widthContractPercent: 1,
      pestInfo: {
        name: '',
        order: '',
        family: '',
        genus: '',
      },
      pestInfoList: [],
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
      preImage: undefined,
    };
  },
  methods: {
    back() {
      this.cancel();
      this.$router.push({ path: '/' });
    },
    sendDataAndPredict() {
      if (!this.isStart || this.isStillPredicting) {
        return;
      }
      this.isStillPredicting = true;
      const { canvas } = this.$refs;
      const ctx = canvas.getContext('2d');
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(
        this.$refs.video,
        0,
        0,
        this.realVideoWidth / this.widthContractPercent,
        this.realVideoHeight / this.widthContractPercent,
      );
      // 转base64格式、图片格式转换、图片质量压缩
      const imgBase64 = canvas.toDataURL('image/jpeg', 1);
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
              const result = res[lastFileName].statistics;
              if (result.hasOwnProperty('error')) {
                this.isStillPredicting = false;
                throw new Error('error');
              }
              this.pestInfoList = [];
              Object.keys(result).forEach((each) => {
                this.$databaseApi
                  .selectSpeciesByCode(each)
                  .then((res2) => {
                    this.isStillPredicting = false;
                    this.msgIsShow = true;
                    const tmp = res2.data[0];
                    this.pestInfo.name = tmp.name;
                    this.pestInfo.family = tmp.family_name;
                    this.pestInfo.order = tmp.order_name;
                    this.pestInfo.genus = tmp.genus_name;
                    let tmpData = {};
                    this.pestInfoList.push(tmpData);
                    tmpData = copy(this.pestInfo, tmpData);
                    this.querySuccessFlag = true;
                  })
                  .catch(() => {
                    this.querySuccessFlag = false;
                    this.isStillPredicting = false;
                    this.pestInfoList = [];
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
              this.pestInfoList = [];
              Toast({
                message: '获取预测信息失败',
                position: 'middle',
                duration: 2000,
              });
            });
        })
        .catch((err) => {
          this.querySuccessFlag = false;
          this.pestInfoList = [];
          Toast({
            message: err.message,
            position: 'middle',
            duration: 2000,
          });
        });
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
      setInterval(this.sendDataAndPredict, 5000);
    },
  },
  mounted() {
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL);
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.back, false); // false阻止默认事件
    }
    this.getRealVideoSize();
    this.getDeviceId().then(() => {
      this.callCamera();
      this.drawImage();
    });
  },
  destroyed() {
    window.removeEventListener('popstate', this.back, false);
  },
  beforeDestroy() {
    this.cancel();
  },
};
</script>

<style scoped>
.content {
  line-height: 2;
  padding: 10px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  /*overflow: hidden;*/
}

.content::before {
  content: '';
  position: absolute;
  filter: blur(20px);
  z-index: -1;
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
  text-align: left;
  color: #5FAABE;
}
</style>
