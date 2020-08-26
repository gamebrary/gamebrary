import Vue from 'vue';
import Router from 'vue-router';
import Board from '@/pages/Board';
import LegacyBoard from '@/pages/LegacyBoard';
import SessionExpired from '@/pages/SessionExpired';
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
      name: 'legacy-board',
      path: '/legacy-board',
      component: LegacyBoard,
      meta: {
        title: 'Boards',
      },
    },
    {
      path: '/board/:id',
      name: 'board',
      component: Board,
    },
    {
      name: 'sessionExpired',
      path: '/session-expired',
      component: SessionExpired,
      meta: {
        title: 'Session expired',
      },
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
