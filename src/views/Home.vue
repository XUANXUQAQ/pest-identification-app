<template>
  <div>
    <mt-header class="font-class" style="font-size: 18px; color: black" title="林业害虫识别">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div style="
      position: fixed;
      text-align: center;
      top: 40vw;"
    >
      <svg-icon style="width: 90%; height: 90%" icon-class="identify"></svg-icon>

      <div class="title">
        林业害虫识别 Demo
      </div>

      <div class="description">
        通过对大数据、智能识别、深度学习等技术的应用，针对常见林业害虫通过应用手机拍摄或选取相册中的害虫图像，经分析处理后可智能识别害虫种类、识别率、个数等信息。
      </div>
    </div>

    <div style="position: fixed; bottom: 5vh; text-align: center; width: 100%">
      <el-button @click="sheetVisible = true" type="primary">开始识别</el-button>
    </div>

    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      actions: [
        {
          name: '图片识别',
          method: this.picture,
        },
        {
          name: '实时识别',
          method: this.video,
        },
      ],
      sheetVisible: false,
    };
  },
  methods: {
    picture() {
      this.$router.push({ name: 'Entry', params: { page: 'left' } });
    },
    video() {
      this.$router.push({ name: 'Entry', params: { page: 'right' } });
    },
  },
};
</script>

<style lang="scss" scoped>
.description {
  font-size: 14px;
  text-shadow: 0 0 2px black;
  color: black;
  margin: 20px;
}
.title {
  font-size: 40px;
  text-shadow: 5px 5px 5px black, 0 0 2px black;
  color: white;
  margin-bottom: 20px;
}
</style>
