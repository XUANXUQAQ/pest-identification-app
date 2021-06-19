<template>
  <div>
    <!--    <mt-header class="font-class" style="font-size: 18px; color: black" title="林业害虫识别">-->
    <!--      <router-link to="/" slot="left">-->
    <!--        <mt-button icon="back"></mt-button>-->
    <!--      </router-link>-->
    <!--    </mt-header>-->

    <div style="position: fixed; text-align: center; top: 40vw">
      <div class="circle" style="background: white; position: fixed; left: 35%; top: 30vh">
        <svg-icon
          style="width: 160%; height: 166%; position: relative; left: 17%"
          icon-class="butterfly"
        ></svg-icon>
      </div>

      <div class="title" style="position: fixed; bottom: 43vh; left: 33vw">Welcome!</div>

      <div class="description" style="position: fixed; bottom: 40vh; left: 20vw">
        Click the bottom to start identifying
      </div>
    </div>

    <div style="position: fixed; bottom: 27vh; text-align: center; width: 100%">
      <el-button style="width: 70vw; height: 8vh" @click="sheetVisible = true" type="primary"
        >START</el-button
      >
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
  font-size: 16px;
  text-shadow: 0 0 2px black;
  color: black;
  margin: 20px;
}

.circle {
  border-radius: 50%;
  width: 125px;
  height: 125px;
  /* 宽度和高度需要相等 */
}

.title {
  font-size: 35px;
  text-shadow: 5px 5px 5px black, 0 0 2px black;
  color: white;
  margin-bottom: 20px;
}
</style>
