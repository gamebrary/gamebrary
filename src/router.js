import Vue from 'vue';
import Router from 'vue-router';
import Board from '@/pages/Board';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Dashboard,
      meta: {
        title: 'Dashboard',
      },
    },
    {
      name: 'boards',
      path: '/boards',
      component: Dashboard,
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/board/:id',
      name: 'board',
      component: Board,
    },
    {
      path: '/auth/:authProvider',
      name: 'auth',
      component: Board,
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
    },
  ],
});
