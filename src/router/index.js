import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

function isEmpty(obj) {
  return typeof obj === 'undefined' || obj === null || obj === '';
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'DashBoard',
        component: () => import('../components/home/DashBoard.vue'),
      },
    ],
  },
  {
    path: '/Login',
    component: () => import('../components/login/Login.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
