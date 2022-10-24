const routes = [
  {
    name: 'game.news',
    path: '/g/:id/:slug/news',
    component: () => import(/* webpackChunkName: "game" */ '@/game/pages/GameNewsPage'),
    meta: {
      public: true,
    },
  },
  {
    name: 'game.notes',
    path: '/g/:id/:slug/notes',
    component: () => import(/* webpackChunkName: "game" */ '@/game/pages/GameNotesPage'),
    meta: {
      title: 'Notes'
    },
  },
  {
    name: 'game',
    path: '/g/:id/:slug',
    component: () => import(/* webpackChunkName: "game" */ '@/game/pages/GamePage'),
    meta: {
      public: true,
    },
  },
];

export default routes;