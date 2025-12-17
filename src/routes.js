const routes = [
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/HomePage"),
    meta: {
      public: true,
      title: "Welcome to Gamebrary",
    },
  },
  {
    name: "library",
    path: "/library",
    component: () => import(/* webpackChunkName: "library" */ "@/pages/LibraryPage"),
    meta: {
      title: "My library",
      public: true,
    },
  },
  {
    name: "game",
    path: "/g/:id/:slug",
    component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GamePage"),
    redirect: { name: "game.overview" },
    meta: {
      public: true,
    },
    children: [
      {
        name: "game.overview",
        path: "",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameOverview"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.screenshots",
        path: "screenshots",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameScreenshots"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.similar",
        path: "similar",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameSimilar"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.speedruns",
        path: "speedruns",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameSpeedruns"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.notes.tab",
        path: "notes",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameNotes"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.boards",
        path: "boards",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameBoards"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.stats",
        path: "stats",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameStats"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.requirements",
        path: "requirements",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameRequirements"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.achievements",
        path: "achievements",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameAchievements"),
        meta: {
          public: true,
        },
      },
      {
        name: "game.news",
        path: "news",
        component: () => import(/* webpackChunkName: "game" */ "@/pages/game/GameNews"),
        meta: {
          public: true,
        },
      },
    ],
  },
  {
    name: "game.news.full",
    path: "/g/:id/:slug/news/full",
    component: () => import(/* webpackChunkName: "game" */ "@/pages/GameNewsPage"),
    meta: {
      public: true,
    },
  },
  {
    name: "game.notes",
    path: "/g/:id/:slug/notes",
    component: () => import(/* webpackChunkName: "game" */ "@/pages/GameNotesPage"),
    meta: {
      title: "Notes",
    },
  },
  {
    name: "upcoming-games",
    path: "/library/upcoming",
    component: () => import(/* webpackChunkName: "library" */ "@/pages/UpcomingGames"),
    meta: {
      title: "Upcoming games",
      public: true,
    },
  },
  {
    name: "boards",
    path: "/boards",
    component: () => import(/* webpackChunkName: "boards" */ "@/pages/BoardsPage"),
    meta: {
      title: "My boards",
      public: true,
    },
  },
  {
    name: "board",
    path: "/b/:id",
    component: () => import(/* webpackChunkName: "boards" */ "@/pages/BoardPage"),
    meta: {
      public: true,
    },
  },
  {
    name: "public.boards",
    path: "/public-boards",
    component: () => import(/* webpackChunkName: "boards" */ "@/pages/PublicBoardsPage"),
    meta: {
      title: "My boards",
      public: true,
    },
  },
  {
    name: "notes",
    path: "/notes",
    component: () => import(/* webpackChunkName: "notes" */ "@/pages/NotesPage"),
    meta: {
      title: "Notes",
      public: true,
    },
    children: [
      {
        name: "notes.detail",
        path: ":id",
        component: () => import(/* webpackChunkName: "notes" */ "@/pages/GameNotesPage"),
        meta: {
          title: "Note",
        },
      },
    ],
  },
  {
    name: "create.note",
    path: "/notes/create",
    component: () => import(/* webpackChunkName: "notes" */ "@/pages/CreateNotePage"),
    meta: {
      title: "Create note",
    },
  },
  {
    name: "progresses",
    path: "/progresses",
    component: () => import(/* webpackChunkName: "progresses" */ "@/pages/ProgressesPage"),
    meta: {
      title: "My Progresses",
      public: true,
    },
  },
  {
    name: "tags",
    path: "/tags",
    redirect: { name: "settings" },
    meta: {
      title: "Tags",
      public: true,
    },
  },
  {
    name: "profiles",
    path: "/profiles",
    component: () => import(/* webpackChunkName: "profile" */ "@/pages/PublicProfilesPage"),
    meta: {
      title: "Profiles",
      public: true,
    },
  },
  {
    name: "create.profile",
    path: "/create-profile",
    component: () => import(/* webpackChunkName: "profile" */ "@/pages/CreateProfilePage"),
    meta: {
      title: "Create profile",
    },
  },
  {
    name: "public.profile",
    path: "/:userName",
    component: () => import(/* webpackChunkName: "profile" */ "@/pages/PublicProfilePage"),
    meta: {
      public: true,
    },
  },
  {
    name: "company",
    path: "/company/:id/:slug",
    component: () => import(/* webpackChunkName: "notes" */ "@/pages/CompanyPage"),
    meta: {
      title: "Company",
    },
  },
  {
    name: "steam",
    path: "/steam",
    component: () => import(/* webpackChunkName: "settings" */ "@/pages/SteamSettingsPage"),
    meta: {
      title: "Steam",
    },
  },
  {
    name: "wallpapers",
    path: "/wallpapers",
    component: () => import(/* webpackChunkName: "settings" */ "@/pages/WallpapersPage"),
    meta: {
      title: "Wallpapers",
      public: true,
    },
  },
  {
    name: "settings",
    path: "/settings",
    component: () => import(/* webpackChunkName: "settings" */ "@/pages/SettingsPage"),
    meta: {
      title: "Settings",
    },
  },
  {
    name: "about",
    path: "/about",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/AboutPage"),
    meta: {
      title: "About",
      public: true,
    },
  },
  {
    name: "help",
    path: "/help",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/HelpPage"),
    meta: {
      title: "Help",
      public: true,
    },
  },
  {
    name: "dev.tools",
    path: "/dev-tools",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/DevToolsPage"),
    meta: {
      title: "DevTools",
      public: true,
    },
  },
  {
    name: "auth",
    path: "/auth",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/AuthPage"),
    meta: {
      title: "Welcome to Gamebrary",
      public: true,
    },
  },
  {
    name: "privacy.policy",
    path: "/privacy-policy",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/PrivacyPolicyPage"),
    meta: {
      public: true,
      title: "Privacy policy",
    },
  },
  {
    name: "terms",
    path: "/terms",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/TermsPage"),
    meta: {
      public: true,
      title: "Terms and conditions",
    },
  },
  {
    name: "search",
    path: "/search",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/SearchPage"),
    meta: {
      title: "Search",
      public: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import(/* webpackChunkName: "public" */ "@/pages/NotFoundPage"),
    meta: {
      public: true,
      title: "Page not found",
    },
  },
];

export default routes;
