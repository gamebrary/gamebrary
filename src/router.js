import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/routes';
import store from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  store.commit('SET_ROUTE', to.name);

  if (to?.meta?.title) {
    document.title = to?.name === 'home'
      ? to.meta.title
      : `${to.meta.title} - Gamebrary`;
  }

  next();
});

export default router;
