import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'Picture',
        component: () => import('../components/home/Picture'),
      },
      {
        path: 'Video',
        component: () => import('../components/home/Video'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
