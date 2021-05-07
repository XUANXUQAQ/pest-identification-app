<template>
  <div>
    <mt-header class="font-class" style="font-size: 18px; color: black" title="林业害虫识别">
      <router-link to="/" slot="left">
        <mt-button @click="currentPage = '', hasContent = false" icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div>
      <div style="height: 90vh">
        <div v-show="hasContent">
          <div class="hasContent">
            <span
              style="width: 50%; height: 50px; text-align: right; margin-left: auto"
              @click="picture"
            >
              <span style="border: 1px solid cornflowerblue; padding: 12px" class="font-class">图片识别</span>
            </span>

            <span
              style="width: 50%; height: 50px; text-align: left; margin-right: auto"
              @click="video"
            >
              <span style="border: 1px solid cornflowerblue; padding: 12px" class="font-class">视频识别</span>
            </span>
          </div>
        </div>
        <el-main>
          <router-view />
        </el-main>
      </div>
    </div>

    <div style="position: fixed; bottom: 5vh; text-align: center; width: 100%">
      <el-button @click="sheetVisible = true" type="primary" v-show="!hasContent">开始识别</el-button>
    </div>

    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentPage: '',
      hasContent: false,
      actions: [
        {
          name: '拍照识别',
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
    video() {
      this.hasContent = true;
      if (this.currentPage === 'right') {
        return;
      }
      this.currentPage = 'right';
      this.$router.push({ path: '/Video' });
    },
    picture() {
      this.hasContent = true;
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
  color: #7ba7cc;
}
.hasContent {
  padding: 12px;
  display: flex;
}
</style>
