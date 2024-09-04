const routes = [
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
    name: 'progresses',
    path: '/progresses',
    component: () => import(/* webpackChunkName: "progresses" */ '@/pages/ProgressesPage'),
    meta: {
      title: 'My Progresses',
      public: true,
    },
  },
  {
    name: 'boards',
    path: '/boards',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/BoardsPage'),
    meta: {
      title: 'My boards',
      public: true,
    },
  },
  {
    name: 'public.boards',
    path: '/public-boards',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/PublicBoardsPage'),
    meta: {
      title: 'My boards',
      public: true,
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
    name: 'company',
    path: '/company/:id/:slug',
    component: () => import(/* webpackChunkName: "notes" */ '@/pages/CompanyPage'),
    meta: {
      title: 'Company',
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
    name: 'game',
    path: '/g/:id/:slug',
    component: () => import(/* webpackChunkName: "game" */ '@/pages/GamePage'),
    meta: {
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
    path: '/b/:id',
    name: 'board',
    component: () => import(/* webpackChunkName: "boards" */ '@/pages/BoardPage'),
    meta: {
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
    path: '/privacy-policy',
    name: 'privacy.policy',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/PrivacyPolicyPage'),
    meta: {
      public: true,
      title: 'Privacy policy',
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/TermsPage'),
    meta: {
      public: true,
      title: 'Terms and conditions',
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/SearchPage'),
    meta: {
      title: 'Search',
      public: true,
    },
  },
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
    path: '*',
    component: () => import(/* webpackChunkName: "public" */ '@/pages/NotFoundPage'),
    meta: {
      public: true,
      title: 'Page not found',
    },
  },
  {
    path: '/:userName',
    name: 'public.profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/PublicProfilePage'),
    meta: {
      public: true,
    },
  },
];

export default routes;
