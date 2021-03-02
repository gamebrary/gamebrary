import Vue from 'vue';
import Router from 'vue-router';
import Board from '@/pages/Board';
import About from '@/pages/About';
import Wallpapers from '@/pages/Wallpapers';
import PublicBoards from '@/pages/PublicBoards';
import Tags from '@/pages/Tags';
import Notes from '@/pages/Notes';
import Releases from '@/pages/Releases';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Boards from '@/components/Boards';
import Settings from '@/pages/Settings';
import Upgrade from '@/pages/Upgrade';
import Profile from '@/pages/Profile';
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
      redirect: { name: 'boards' },
      children: [
        {
          name: 'boards',
          path: '/boards',
          component: Boards,
          meta: {
            title: 'Boards',
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
          name: 'notes',
          path: '/notes',
          component: Notes,
          meta: {
            title: 'Notes',
          },
        },
        {
          path: '/settings',
          name: 'settings',
          component: Settings,
          meta: {
            title: 'Settings',
          },
        },
      ],
    },
    {
      name: 'public-boards',
      path: '/public-boards',
      component: PublicBoards,
      meta: {
        title: 'PublicBoards',
        public: true,
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
      name: 'profile',
      path: '/profile',
      component: Profile,
      meta: {
        title: 'Profile',
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
