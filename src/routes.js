const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/HomePage'),
    meta: {
      public: true,
      title: 'Welcome to Gamebrary',
    },
  },
  {
    name: 'games',
    path: '/games',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/GamesPage'),
    meta: {
      title: 'My games',
      public: true,
    },
  },
  {
    name: 'game',
    path: '/g/:id/:slug',
    component: () => import(/* webpackChunkName: "game" */ '@/pages/GamePage'),
    meta: {
      public: true,
    },
  },
  {
    name: 'game.news',
    path: '/g/:id/:slug/news',
    component: () => import(/* webpackChunkName: "game" */ '@/pages/GameNewsPage'),
    meta: {
      public: true,
    },
  },
  {
    name: 'game.notes',
    path: '/g/:id/:slug/notes',
    component: () => import(/* webpackChunkName: "game" */ '@/pages/GameNotesPage'),
    meta: {
      title: 'Notes'
    },
  },
  {
    name: 'upcoming-games',
    path: '/games/upcoming',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/UpcomingGames'),
    meta: {
      title: 'Upcoming games',
      public: true,
    },
  },
  {
    name: 'boards',
    path: '/boards',
    component: () => import(/* webpackChunkName: "boards" */ '@/pages/BoardsPage'),
    meta: {
      title: 'My boards',
      public: true,
    },
  },
  {
    name: 'board',
    path: '/b/:id',
    component: () => import(/* webpackChunkName: "boards" */ '@/pages/BoardPage'),
    meta: {
      public: true,
    },
  },
  {
    name: 'public.boards',
    path: '/public-boards',
    component: () => import(/* webpackChunkName: "boards" */ '@/pages/PublicBoardsPage'),
    meta: {
      title: 'My boards',
      public: true,
    },
  },
  {
    name: 'notes',
    path: '/notes',
    component: () => import(/* webpackChunkName: "notes" */ '@/pages/NotesPage'),
    meta: {
      title: 'Notes',
      public: true,
    },
  },
  {
    name: 'create.note',
    path: '/notes/create',
    component: () => import(/* webpackChunkName: "notes" */ '@/pages/CreateNotePage'),
    meta: {
      title: 'Create note',
    },
  },
  {
    name: 'progresses',
    path: '/progresses',
    component: () => import(/* webpackChunkName: "progresses" */ '@/pages/ProgressesPage'),
    meta: {
      title: 'My Progresses',
      public: true,
    },
  },
  {
    name: 'tags',
    path: '/tags',
    component: () => import(/* webpackChunkName: "tags" */ '@/pages/TagsPage'),
    meta: {
      title: 'Tags',
      public: true,
    },
  },
  {
    name: 'profiles',
    path: '/profiles',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/PublicProfilesPage'),
    meta: {
      title: 'Profiles',
      public: true,
    },
  },
  {
    name: 'create.profile',
    path: '/create-profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/CreateProfilePage'),
    meta: {
      title: 'Create profile',
    },
  },
  {
    name: 'public.profile',
    path: '/:userName',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/PublicProfilePage'),
    meta: {
      public: true,
    },
  },
  {
    name: 'company',
    path: '/company/:id/:slug',
    component: () => import(/* webpackChunkName: "notes" */ '@/pages/CompanyPage'),
    meta: {
      title: 'Company',
    },
  },
  {
    name: 'steam',
    path: '/steam',
    component: () => import(/* webpackChunkName: "settings" */ '@/pages/SteamSettingsPage'),
    meta: {
      title: "Steam",
    },
  },
  {
    name: 'wallpapers',
    path: '/wallpapers',
    component: () => import(/* webpackChunkName: "settings" */ '@/pages/WallpapersPage'),
    meta: {
      title: 'Wallpapers',
      public: true,
    },
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/AboutPage'),
    meta: {
      title: 'About',
      public: true,
    },
  },
  {
    name: 'help',
    path: '/help',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/HelpPage'),
    meta: {
      title: 'Help',
      public: true,
    },
  },
  {
    name: 'dev.tools',
    path: '/dev-tools',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/DevToolsPage'),
    meta: {
      title: 'DevTools',
      public: true,
    },
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/AuthPage'),
    meta: {
      title: 'Welcome to Gamebrary',
      public: true,
    },
  },
  {
    name: 'privacy.policy',
    path: '/privacy-policy',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/PrivacyPolicyPage'),
    meta: {
      public: true,
      title: 'Privacy policy',
    },
  },
  {
    name: 'terms',
    path: '/terms',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/TermsPage'),
    meta: {
      public: true,
      title: 'Terms and conditions',
    },
  },
  {
    name: 'search',
    path: '/search',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/SearchPage'),
    meta: {
      title: 'Search',
      public: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/NotFoundPage'),
    meta: {
      public: true,
      title: 'Page not found',
    },
  },
];

export default routes;
