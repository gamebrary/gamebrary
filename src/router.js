import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/routes';
// import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

// TODO: remove
router.beforeEach((to, from, next) => {
  // if (to.meta.public || store.state.user) next();

  // if (!to.meta.public && !store.state.user) {
  //   next({ name: 'auth' });
  // }

  if (to?.meta?.title) document.title = `${to.meta.title} - Gamebrary`;

  next();
});

export default router;
