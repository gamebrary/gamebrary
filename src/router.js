import Vue from 'vue';
import Router from 'vue-router';
import BoardPage from '@/pages/BoardPage';
import AboutPage from '@/pages/AboutPage';
import WallpapersPage from '@/pages/WallpapersPage';
import PublicBoardsPage from '@/pages/PublicBoardsPage';
import TagsPage from '@/pages/TagsPage';
import NotesPage from '@/pages/NotesPage';
import ReleasesPage from '@/pages/ReleasesPage';
import AuthPage from '@/pages/AuthPage';
import BoardsPage from '@/pages/BoardsPage';
import ProfilesPage from '@/pages/ProfilesPage';
import DevToolsPage from '@/pages/DevToolsPage';
import HomePage from '@/pages/HomePage';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import PublicProfilePage from '@/pages/PublicProfilePage';

Vue.use(Router);

export default new Router({
  mode: 'history',
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
        public: true,
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
      component: SettingsPage,
      meta: {
        title: 'Settings',
      },
    },
    {
      name: 'wallpapers',
      path: '/wallpapers',
      component: WallpapersPage,
      meta: {
        title: 'Wallpapers',
      },
    },
    {
      name: 'tags',
      path: '/tags',
      component: TagsPage,
      meta: {
        title: 'Tags',
      },
    },
    {
      name: 'notes',
      path: '/notes',
      component: NotesPage,
      meta: {
        title: 'Notes',
      },
    },
    {
      name: 'public-boards',
      path: '/public-boards',
      component: PublicBoardsPage,
      meta: {
        title: 'PublicBoards',
        public: true,
      },
    },
    {
      name: 'profile',
      path: '/profile',
      component: ProfilePage,
      meta: {
        title: 'Profile',
      },
    },
    {
      name: 'edit-profile',
      path: '/EditProfilePage',
      component: EditProfilePage,
      meta: {
        title: 'Edit profile',
      },
    },
    {
      name: 'about',
      path: '/about',
      component: AboutPage,
      meta: {
        title: 'About',
      },
    },
    {
      name: 'releases',
      path: '/releases',
      component: ReleasesPage,
      meta: {
        title: 'Releases',
      },
    },
    {
      name: 'auth',
      path: '/auth',
      component: AuthPage,
      meta: {
        title: 'Auth',
      },
      children: [
        {
          name: 'auth-provider',
          path: ':provider',
          component: AuthPage,
        },
      ],
    },
    {
      path: '/board/:id',
      name: 'board',
      component: BoardPage,
    },
    {
      path: '/b/:id',
      name: 'public-board',
      component: BoardPage,
      meta: {
        public: true,
      },
    },
    {
      path: '/:userName',
      name: 'public-profile',
      component: PublicProfilePage,
      meta: {
        public: true,
      },
    },
    {
      name: 'home',
      path: '/',
      component: HomePage,
      meta: {
        title: 'Home',
        public: true,
      },
    },
  ],
});
