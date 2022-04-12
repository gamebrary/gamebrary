import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/routes';
// import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  // TODO: enable history mode
  // mode: 'history',
  routes,
});

// TODO: add navigation guards when trying to access private routes.

// router.beforeEach((to, from, next) => {
//   if (to.meta.public || store.state.user) next();
//
//   if (!to.meta.public && !store.state.user) {
//     console.log('not allowed');
//
//     next({ name: 'auth' });
//   }
//
//   next();
//   // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   // else next()
// });

export default router;
