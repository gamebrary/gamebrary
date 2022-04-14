import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import BoardPage from '@/pages/BoardPage';
import UpgradePage from '@/pages/UpgradePage';
import EditBoardPage from '@/pages/EditBoardPage';
import CreateBoardPage from '@/pages/CreateBoardPage';
import DevToolsPage from '@/pages/DevToolsPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ExplorePage from '@/pages/ExplorePage';
import GamePage from '@/pages/GamePage';
import GameMediaPage from '@/pages/game/GameMediaPage';
import HomePage from '@/pages/HomePage';
import PlatformsPage from '@/pages/PlatformsPage';
import PlatformPage from '@/pages/PlatformPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import GameNotesPage from '@/pages/GameNotesPage';
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
// TODO: use chunks and import directly
// TODO: separate into different files

const routes = [
  {
    name: 'profiles',
    path: '/profiles',
    component: PublicProfilesPage,
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
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
    redirect: { name: 'general-settings' },
    children: [
      {
        name: 'account-settings',
        path: 'account',
        component: AccountSettingsPage,
        meta: {
          title: "Account",
        },
      },
      {
        name: 'steam-settings',
        path: 'steam',
        component: SteamSettingsPage,
        meta: {
          title: "Steam",
        },
      },
      {
        name: 'general-settings',
        path: '',
        component: GeneralSettingsPage,
        meta: {
          title: 'Settings',
        }
      },
      {
        name: 'tags-settings',
        path: 'tags',
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
        path: 'notes',
        component: NotesPage,
        meta: {
          title: 'Notes',
        },
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
        name: 'releases',
        path: 'releases',
        component: ReleasesPage,
        meta: {
          title: 'Releases',
        },
      },
    ],
  },
  {
    name: 'game',
    path: '/game/:gameId/:gameSlug?',
    component: GamePage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game-media-page',
    path: '/game/:gameId/:gameSlug/media',
    component: GameMediaPage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game-notes',
    path: '/game/:gameId/:gameSlug/notes',
    component: GameNotesPage,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: {
      title: 'Search',
      public: true,
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
    name: 'upgrade',
    path: '/upgrade',
    component: UpgradePage,
    meta: {
      title: 'Upgrade',
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
    path: '/board/create',
    name: 'create-board',
    component: CreateBoardPage,
    meta: {
      title: 'Create board',
    }
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
    name: 'privacy-policy',
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
      title: 'Dashboard',
      public: true,
    },
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;
