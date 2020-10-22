import Vue from 'vue';
import Router from 'vue-router';
import Board from '@/pages/Board';
import About from '@/pages/About';
import Languages from '@/pages/Languages';
import Wallpapers from '@/pages/Wallpapers';
import Tags from '@/pages/Tags';
import Account from '@/pages/Account';
import Releases from '@/pages/Releases';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Upgrade from '@/pages/Upgrade';
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
      name: 'upgrade',
      path: '/upgrade',
      component: Upgrade,
      meta: {
        title: 'Upgrade',
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
      component: Languages,
      meta: {
        title: 'Languages',
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
      name: 'auth',
      path: '/auth',
      component: Auth,
      meta: {
        title: 'Auth',
      },
    },
    {
      path: '/board/:id',
      name: 'board',
      component: Board,
    },
    {
      path: '/b/:id',
      name: 'public-board',
      component: Board,
      meta: {
        public: true,
      },
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
    },
  ],
});
