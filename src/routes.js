import AboutPage from '@/pages/AboutPage';
import AuthPage from '@/pages/AuthPage';
import BoardPage from '@/pages/BoardPage';
import BoardsPage from '@/pages/BoardsPage';
import DevToolsPage from '@/pages/DevToolsPage';
import EditProfilePage from '@/pages/EditProfilePage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotesPage from '@/pages/NotesPage';
import ProfilePage from '@/pages/ProfilePage';
import ExplorePage from '@/pages/ExplorePage';
import PublicProfilePage from '@/pages/PublicProfilePage';
import PublicProfilesPage from '@/pages/PublicProfilesPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ReleasesPage from '@/pages/ReleasesPage';
import SettingsPage from '@/pages/SettingsPage';
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
