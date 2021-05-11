import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import 'swiper/swiper-bundle.css';
import yolov4Api from '@/network/yolov4';
import databaseApi from '@/network/database';
import router from './router';
import './icons';
import store from './store';
import './assets/style/base.scss';
import App from './App.vue';

Vue.use(ElementUI);
Vue.use(MintUI);
Vue.use(Vuesax);
Vue.prototype.$yolov4Api = yolov4Api;
Vue.prototype.$databaseApi = databaseApi;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
