<template>
  <div>
    <mt-header class="font-class" title="林业害虫识别">
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>

    <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
      <div style="height: 90vh">
        <div style="display: flex; flex-direction: row">
          <div style="width: 50%; text-align: center" @click="onSwipeRight">
            <touch-ripple
              class="typography-box"
              color="#999"
              :speed="2"
              :opacity="0.3"
              transition="ease-in-out"
            >
              <div class="font-class">图片识别</div>
            </touch-ripple>
          </div>

          <div style="width: 50%; text-align: center" @click="onSwipeLeft">
            <touch-ripple
              class="typography-box"
              color="#999"
              :speed="2"
              :opacity="0.3"
              transition="ease-in-out"
            >
              <div class="font-class">视频识别</div>
            </touch-ripple>
          </div>
        </div>
        <el-main>
          <router-view/>
        </el-main>
      </div>
    </v-touch>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentPage: 'left',
    };
  },
  methods: {
    onSwipeLeft() {
      if (this.currentPage === 'right') {
        return;
      }
      this.currentPage = 'right';
      this.$router.push({ path: '/Video' });
    },
    onSwipeRight() {
      if (this.currentPage === 'left') {
        return;
      }
      this.currentPage = 'left';
      this.$router.push({ path: '/Picture' });
    },
  },
};
</script>

<style lang="scss" scoped>
.font-class {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 18px;
}
</style>
