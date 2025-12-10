import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/routes';
import { useUIStore } from '@/stores/ui';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const uiStore = useUIStore();
  uiStore.setRouteName(to.name);

  if (to?.meta?.title) {
    document.title = to?.name === 'home'
      ? to.meta.title
      : `${to.meta.title} - Gamebrary`;
  }

  next();
});

export default router;
