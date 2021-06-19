<template>
  <div>
    <mt-header class="font-class" style="font-size: 18px; color: black" title="">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div style="height: 90vh">
      <!--      <div>-->
      <!--        <div class="hasContent">-->
      <!--            <span-->
      <!--              style="width: 50%; height: 50px; text-align: right; margin-left: auto"-->
      <!--              @click="picture"-->
      <!--            >-->
      <!--              <span style="border: 1px solid cornflowerblue; padding: 12px" class="font-class">图片识别</span>-->
      <!--            </span>-->

      <!--          <span-->
      <!--            style="width: 50%; height: 50px; text-align: left; margin-right: auto"-->
      <!--            @click="video"-->
      <!--          >-->
      <!--              <span style="border: 1px solid cornflowerblue; padding: 12px" class="font-class">视频识别</span>-->
      <!--            </span>-->
      <!--        </div>-->
      <!--      </div>-->
      <el-main style="height: 100%">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entry',
  data() {
    return {
      currentPage: this.$route.params.page,
    };
  },
  mounted() {
    if (this.currentPage === 'left') {
      this.$router.push({ path: '/Picture' });
    } else if (this.currentPage === 'right') {
      this.$router.push({ path: '/Video' });
    }
  },
  methods: {
    video() {
      if (this.currentPage === 'right') {
        return;
      }
      this.currentPage = 'right';
      this.$router.push({ path: '/Video' });
    },
    picture() {
      if (this.currentPage === 'left') {
        return;
      }
      this.currentPage = 'left';
      this.$router.push({ path: '/Picture' });
    },
  },
};
</script>

<style scoped>
.font-class {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  font-size: 18px;
  background: rgba(255, 255, 255, 0);
}

.mint-header {
  position: fixed;
  top: 5vh;
  left: 6vw;
}
/*.hasContent {*/
/*  padding: 12px;*/
/*  display: flex;*/
/*}*/
</style>
