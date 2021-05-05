<template>
  <el-container class="el-body">
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import networkUtils from '@/utils/networkUtils';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      path: '',
      name: '',
      username: networkUtils.username.getUsername(),
      sideBarHeight: '100vh',
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    setPathAndName(path, name) {
      this.path = path;
      this.name = name;
    },
    logout() {
      networkUtils.token.removeToken();
      this.$router.push({
        path: '/Login',
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>

.el-body {
  height: 90vh;
}

.title {
  font-size: 35px;
}

.el-aside {
  background-color: #304156;
  overflow: hidden;
}

.el-main {
  overflow-x: hidden;
}

.svg-container {
  padding: 6px 5px 6px 5px;
  vertical-align: middle;
  width: 18px;
  display: inline-block;
}

.user {
  font-size: 18px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  position:relative;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);
}
</style>
