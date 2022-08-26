// TODO: Use chunks and split into different files
// TODO: separate into different files
// TODO: make naming consistent
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
import GameNewsPage from '@/pages/game/GameNewsPage';
import HomePage from '@/pages/HomePage';
import PlatformsPage from '@/pages/PlatformsPage';
import PlatformPage from '@/pages/PlatformPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import CreateNotePage from '@/pages/CreateNotePage';
import GameNotesPage from '@/pages/GameNotesPage';
import EditListPage from '@/pages/EditListPage';
import GameTagsPage from '@/pages/GameTagsPage';
import CreateTagPage from '@/pages/CreateTagPage';
import GameProgressPage from '@/pages/GameProgressPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ProfilePage from '@/pages/ProfilePage';
import PublicProfilePage from '@/pages/PublicProfilePage';
import PublicProfilesPage from '@/pages/PublicProfilesPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
import SearchPage from '@/pages/SearchPage';
import SteamSettingsPage from '@/pages/SteamSettingsPage';
import TagsPage from '@/pages/TagsPage';
import EditTagPage from '@/pages/EditTagPage';
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
    name: 'tags',
    path: '/tags',
    component: TagsPage,
    meta: {
      title: 'Tags',
    },
  },
  {
    name: 'tag.create',
    path: '/tags/create',
    component: CreateTagPage,
    meta: {
      title: 'Edit tag',
    },
  },
  {
    name: 'tag.edit',
    path: '/tags/:id',
    component: EditTagPage,
    meta: {
      title: 'Edit tag',
    },
  },
  {
    name: 'profile.settings',
    path: '/profile',
    component: ProfileSettingsPage,
    meta: {
      title: 'Edit profile',
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
    name: 'notes.create',
    path: '/notes/create',
    component: CreateNotePage,
    meta: {
      title: 'Create note',
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
    name: 'releases',
    path: '/releases',
    component: ReleasesPage,
    meta: {
      title: 'Releases',
      public: true,
    },
  },
  {
    name: 'game',
    path: '/g/:id/:slug',
    component: GamePage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game.news',
    path: '/g/:id/:slug/news',
    component: GameNewsPage,
    meta: {
      public: true,
    },
  },
  {
    name: 'game.notes',
    path: '/g/:id/:slug/notes',
    component: GameNotesPage,
  },
  {
    name: 'game.tags',
    path: '/g/:id/:slug/tags',
    component: GameTagsPage,
  },
  {
    name: 'game.progress',
    path: '/g/:id/:slug/progress',
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
    path: '/b/create',
    name: 'create.board',
    component: CreateBoardPage,
    meta: {
      title: 'Create board',
    }
  },
  {
    path: '/b/:id',
    name: 'board',
    component: BoardPage,
    meta: {
      public: true,
    },
  },
  {
    path: '/b/:id/edit',
    name: 'board.edit',
    component: EditBoardPage,
  },
  {
    path: '/b/:id/edit/:listIndex',
    name: 'board.list.edit',
    component: EditListPage,
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
    path: '/:userName',
    name: 'public.profile',
    component: PublicProfilePage,
    meta: {
      public: true,
    },
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;
