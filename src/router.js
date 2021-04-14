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
import Boards from '@/pages/Boards';
import Settings from '@/pages/Settings';
import Upgrade from '@/pages/Upgrade';
import Profile from '@/pages/Profile';
import Preferences from '@/pages/Preferences';
import EditProfile from '@/pages/Profile/EditProfile';
import PublicProfile from '@/pages/PublicProfile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'dashboard',
      path: '/',
      component: Boards,
      meta: {
        title: 'Boards',
      },
    },
    {
      name: 'settings',
      path: '/settings',
      component: Settings,
      meta: {
        title: 'Settings',
      },
      redirect: { name: 'preferences' },
      children: [
        {
          name: 'preferences',
          path: '/settings/preferences',
          component: Preferences,
          meta: {
            title: 'Settings',
          },
        },
        {
          name: 'wallpapers',
          path: '/settings/wallpapers',
          component: Wallpapers,
          meta: {
            title: 'Wallpapers',
          },
        },
        {
          name: 'tags',
          path: '/settings/tags',
          component: Tags,
          meta: {
            title: 'Tags',
          },
        },
        {
          name: 'notes',
          path: '/settings/notes',
          component: Notes,
          meta: {
            title: 'Notes',
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
      name: 'edit-profile',
      path: '/profile/edit',
      component: EditProfile,
      meta: {
        title: 'Edit profile',
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
      children: [
        {
          name: 'auth-provider',
          path: ':provider',
          component: Auth,
        },
      ],
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
      name: 'public-profile',
      component: PublicProfile,
    },
  ],
});
