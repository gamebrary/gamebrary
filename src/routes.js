import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import BoardPage from '@/pages/BoardPage';
import EditBoardPage from '@/pages/EditBoardPage';
import DevToolsPage from '@/pages/DevToolsPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ExplorePage from '@/pages/ExplorePage';
import GamePage from '@/pages/GamePage';
import HomePage from '@/pages/HomePage';
import PlatformsPage from '@/pages/PlatformsPage';
import PlatformPage from '@/pages/PlatformPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ProfilePage from '@/pages/ProfilePage';
import PublicProfilePage from '@/pages/PublicProfilePage';
import PublicProfilesPage from '@/pages/PublicProfilesPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
import SearchPage from '@/pages/SearchPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import SteamSettingsPage from '@/pages/SteamSettingsPage';
import GeneralSettingsPage from '@/pages/GeneralSettingsPage';
import TagsPage from '@/pages/TagsPage';
import TermsPage from '@/pages/TermsPage';
import WallpapersPage from '@/pages/WallpapersPage';

const routes = [
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
    name: 'platforms',
    path: '/platforms',
    component: PlatformsPage,
    meta: {
      title: 'Platforms',
    },
  },
  {
    path: '/platforms/:slug',
    name: 'platform-page',
    component: PlatformPage,
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
      {
        name: 'wallpapers-settings',
        path: '/wallpapers',
        component: WallpapersPage,
        meta: {
          title: 'Wallpapers',
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
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: {
      title: 'Search',
    },
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
