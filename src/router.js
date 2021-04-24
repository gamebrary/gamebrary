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
import BoardsPage from '@/pages/BoardsPage';
import ProfilesPage from '@/pages/ProfilesPage';
import DevToolsPage from '@/pages/DevToolsPage';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/Profile/EditProfile';
import PublicProfile from '@/pages/PublicProfile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'boards',
      path: '/boards',
      component: BoardsPage,
      meta: {
        title: 'Boards',
      },
    },
    {
      name: 'profiles',
      path: '/profiles',
      component: ProfilesPage,
      meta: {
        title: 'Boards',
      },
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      name: 'dev-tools',
      path: '/dev-tools',
      component: DevToolsPage,
      meta: {
        title: 'DevTools',
      },
    },
    {
      name: 'settings',
      path: '/settings',
      component: Settings,
      meta: {
        title: 'Settings',
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
      name: 'public-boards',
      path: '/public-boards',
      component: PublicBoards,
      meta: {
        title: 'PublicBoards',
        public: true,
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
      path: '/:userName',
      name: 'public-profile',
      component: PublicProfile,
      meta: {
        public: true,
      },
    },
  ],
});
