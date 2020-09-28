import Vue from 'vue';
import Router from 'vue-router';
import Board from '@/pages/Board';
import About from '@/pages/About';
import Language from '@/pages/Language';
import Wallpapers from '@/pages/Wallpapers';
import Tags from '@/pages/Tags';
import Account from '@/pages/Account';
import Themes from '@/pages/Themes';
import Releases from '@/pages/Releases';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'dashboard',
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
      name: 'about',
      path: '/about',
      component: About,
      meta: {
        title: 'About',
      },
    },
    {
      name: 'wallpapers',
      path: '/wallpapers',
      component: Wallpapers,
      meta: {
        title: 'Wallpapers',
      },
    },
    {
      name: 'tags',
      path: '/tags',
      component: Tags,
      meta: {
        title: 'Tags',
      },
    },
    {
      name: 'language',
      path: '/language',
      component: Language,
      meta: {
        title: 'Language',
      },
    },
    {
      name: 'themes',
      path: '/themes',
      component: Themes,
      meta: {
        title: 'Themes',
      },
    },
    {
      name: 'account',
      path: '/account',
      component: Account,
      meta: {
        title: 'Account',
      },
    },
    {
      name: 'releases',
      path: '/releases',
      component: Releases,
      meta: {
        title: 'Releases',
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
