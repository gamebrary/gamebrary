// TODO: use chunks and import directly
// TODO: separate into different files
// TODO: make naming consistent
import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import BoardPage from '@/pages/BoardPage';
import UpgradePage from '@/pages/UpgradePage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import EditBoardPage from '@/pages/EditBoardPage';
import CreateBoardPage from '@/pages/CreateBoardPage';
import DevToolsPage from '@/pages/DevToolsPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ExplorePage from '@/pages/ExplorePage';
import GamePage from '@/pages/GamePage';
import GameMediaPage from '@/pages/game/GameMediaPage';
import GameNewsPage from '@/pages/game/GameNewsPage';
import HomePage from '@/pages/HomePage';
import PlatformsPage from '@/pages/PlatformsPage';
import PlatformPage from '@/pages/PlatformPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import GameNotesPage from '@/pages/GameNotesPage';
import EditListPage from '@/pages/EditListPage';
import GameTagsPage from '@/pages/GameTagsPage';
import GameProgressPage from '@/pages/GameProgressPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ProfilePage from '@/pages/ProfilePage';
import PublicProfilePage from '@/pages/PublicProfilePage';
import PublicProfilesPage from '@/pages/PublicProfilesPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
import SearchPage from '@/pages/SearchPage';
import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import GeneralSettingsPage from '@/pages/GeneralSettingsPage';
import TagsPage from '@/pages/TagsPage';
import TermsPage from '@/pages/TermsPage';
import WallpapersPage from '@/pages/WallpapersPage';

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
    name: 'dev.tools',
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
    name: 'platform.page',
    component: PlatformPage,
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
    name: 'steam.settings',
    path: '/settings/steam',
    component: SteamSettingsPage,
    meta: {
      title: "Steam",
    },
  },
  {
    name: 'account.settings',
    path: '/settings/account',
    component: AccountSettingsPage,
    meta: {
      title: "Steam",
    },
  },
  {
    name: 'tags.settings',
    path: '/settings/tags',
    component: TagsPage,
    meta: {
      title: 'Tags',
    },
  },
  {
    name: 'profile.settings',
    path: '/settings/profile',
    component: ProfileSettingsPage,
    meta: {
      title: 'Edit profile',
    },
  },
  {
    name: 'notes.settings',
    path: '/settings/notes',
    component: NotesPage,
    meta: {
      title: 'Notes',
    },
  },
  {
    name: 'wallpapers.settings',
    path: '/settings/wallpapers',
    component: WallpapersPage,
    meta: {
      title: 'Wallpapers',
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
    name: 'game',
    path: '/game/:id/:slug',
    component: GamePage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game.media',
    path: '/game/:id/:slug/media',
    component: GameMediaPage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game.news',
    path: '/game/:id/:slug/news',
    component: GameNewsPage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game.notes',
    path: '/game/:id/:slug/notes',
    component: GameNotesPage,
  },
  {
    name: 'game.tags',
    path: '/game/:id/:slug/tags',
    component: GameTagsPage,
  },
  {
    name: 'game.progress',
    path: '/game/:id/:slug/progress',
    component: GameProgressPage,
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
      title: 'Welcome to Gamebrary',
      public: true,
    },
    // children: [
    //   {
    //     name: 'auth-provider',
    //     path: ':provider',
    //     component: AuthPage,
    //   },
    // ],
  },
  {
    path: '/board/create',
    name: 'create.board',
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
    name: 'board.edit',
    component: EditBoardPage,
  },
  {
    path: '/board/:id/edit/:listIndex',
    name: 'board.list.edit',
    component: EditListPage,
  },
  {
    path: '/b/:id',
    name: 'public.board',
    component: BoardPage,
    meta: {
      public: true,
    },
  },
  {
    path: '/:userName',
    name: 'public.profile',
    component: PublicProfilePage,
    meta: {
      public: true,
    },
  },
  {
    path: '/privacy-policy',
    name: 'privacy.policy',
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
