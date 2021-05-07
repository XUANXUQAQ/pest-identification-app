<template>
  <div>
    <mt-header class="font-class" title="林业害虫识别">
      <router-link to="/" slot="left">
        <mt-button @click="currentPage = ''" icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div>
      <div style="height: 90vh">
        <div style="display: flex; flex-direction: row">
          <div style="width: 50%; text-align: center" @click="video">
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

          <div style="width: 50%; text-align: center" @click="picture">
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
          <router-view />
        </el-main>
      </div>
    </div>
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
  mounted() {
    this.$router.push({ path: '/Picture' });
  },
  methods: {
    picture() {
      if (this.currentPage === 'right') {
        return;
      }
      this.currentPage = 'right';
      this.$router.push({ path: '/Video' });
    },
    video() {
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
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  font-size: 18px;
}
</style>
