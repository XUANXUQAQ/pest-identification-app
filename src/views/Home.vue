<template>
  <div>
    <div style="position: fixed; text-align: center; top: 40vw">
      <div class="circle" style="background: white; position: fixed; left: 33.5%; top: 30vh">
        <svg-icon
          style="width: 160%; height: 166%; position: relative; left: 17%"
          icon-class="butterfly"
        ></svg-icon>
      </div>

      <div class="title" style="position: fixed; bottom: 43vh; width: 100%">
        Welcome!
      </div>

      <div class="description" style="position: fixed; bottom: 40vh; width: 100%">
        <div style="margin-top: 10px"></div>
        <br/><span>Pest Identification</span><br/>
        Click the bottom to start
      </div>
    </div>

    <div style="position: fixed; bottom: 27vh; text-align: center; width: 100%">
      <el-button class="start-button" style="width: 70vw; height: 8vh" @click="sheetVisible = true" type="primary"
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
  color: #5FAABE;
  text-align: center;
  font-family: 华文琥珀,sans-serif;
}

.circle {
  border-radius: 50%;
  width: 125px;
  height: 125px;
  /* 宽度和高度需要相等 */
}

.title {
  font-size: 35px;
  font-family: 华文琥珀,sans-serif;
  color: #5FAABE;
  margin-bottom: 20px;
  text-align: center;
}

.start-button {
  background-color: #e8f9ff;
  background-image: linear-gradient(160deg, #e8f9ff 0%, #fdffe8 100%);
  border-width: 0;
  color: #45CBED;
}
</style>
