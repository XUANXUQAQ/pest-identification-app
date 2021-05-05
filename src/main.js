import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import yolov4Api from '@/network/yolov4';
import router from './router';
import './icons';
import store from './store';
import './assets/style/base.scss';
import App from './App.vue';

Vue.use(ElementUI);

Vue.prototype.$yolov4Api = yolov4Api;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
