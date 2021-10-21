import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import BoardPage from '@/pages/BoardPage';
import EditBoardPage from '@/pages/EditBoardPage';
import BoardsPage from '@/pages/BoardsPage';
import DevToolsPage from '@/pages/DevToolsPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ExplorePage from '@/pages/ExplorePage';
import GamePage from '@/pages/GamePage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ProfilePage from '@/pages/ProfilePage';
import PublicProfilePage from '@/pages/PublicProfilePage';
import PublicProfilesPage from '@/pages/PublicProfilesPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import SteamSettingsPage from '@/pages/SteamSettingsPage';
import GeneralSettingsPage from '@/pages/GeneralSettingsPage';
import TagsPage from '@/pages/TagsPage';
import TermsPage from '@/pages/TermsPage';
import WallpapersPage from '@/pages/WallpapersPage';

const routes = [
  {
    name: 'boards',
    path: '/boards',
    component: BoardsPage,
    meta: {
      title: 'Boards',
      public: true,
    },
  },
  {
    name: 'profiles',
    path: '/profiles',
    component: PublicProfilesPage,
    meta: {
      title: 'profiles',
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
    children: [
      {
        name: 'account-settings',
        path: 'account',
        component: AccountSettingsPage,
      },
      {
        name: 'wallpapers-settings',
        path: 'wallpapers',
        component: WallpapersPage,
        meta: {
          title: 'Wallpapers',
        },
      },
      {
        name: 'steam-settings',
        path: 'steam',
        component: SteamSettingsPage,
      },
      {
        name: 'general-settings',
        path: '',
        component: GeneralSettingsPage,
      },
      {
        name: 'tags-settings',
        path: '/tags',
        component: TagsPage,
        meta: {
          title: 'Tags',
        },
      },
      {
        name: 'profile-settings',
        path: 'profile',
        component: ProfileSettingsPage,
        meta: {
          title: 'Edit profile',
        },
      },
      {
        name: 'notes-settings',
        path: '/notes',
        component: NotesPage,
        meta: {
          title: 'Tags',
        },
      },
    ],
  },
  {
    name: 'game',
    path: '/game/:gameId/:gameSlug?',
    component: GamePage,
  },
  {
    name: 'explore',
    path: '/explore',
    component: ExplorePage,
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
      public: true,
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
    path: '/board/:id/edit',
    name: 'edit-board',
    component: EditBoardPage,
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
    path: '/privacy-policy',
    name: 'privacy-policy-page',
    component: PrivacyPolicyPage,
    meta: {
      public: true,
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsPage,
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
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;
