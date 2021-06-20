<template>
  <div>
    <mt-header class="font-class" style="font-size: 18px; color: black" title="">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div style="height: 100vh">
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
  background: rgba(255, 255, 255, 0);
}

.mint-header {
  position: fixed;
  top: 5vh;
  left: 6vw;
}
</style>
