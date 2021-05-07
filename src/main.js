import Vue from 'vue';
import ElementUI from 'element-ui';
import VueTouch from 'vue-touch';
import 'element-ui/lib/theme-chalk/index.css';
import VueTouchRipple from 'vue-touch-ripple';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import 'vue-touch-ripple/dist/vue-touch-ripple.css';
import yolov4Api from '@/network/yolov4';
import databaseApi from '@/network/database';
import router from './router';
import './icons';
import store from './store';
import './assets/style/base.scss';
import App from './App.vue';

Vue.use(ElementUI);
Vue.use(VueTouch, { name: 'v-touch' });
Vue.use(VueTouchRipple);
Vue.use(MintUI);
Vue.use(Vuesax);
Vue.use(VueAwesomeSwiper);

Vue.prototype.$yolov4Api = yolov4Api;
Vue.prototype.$databaseApi = databaseApi;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
