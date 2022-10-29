const routes = [
  {
    name: 'upgrade',
    path: '/upgrade',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/UpgradePage'),
    meta: {
      title: 'Upgrade',
      public: true,
    },
  },
  {
    name: 'explore',
    path: '/explore',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/ExplorePage'),
    meta: {
      title: 'Explore public boards',
      public: true,
    },
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/AboutPage'),
    meta: {
      title: 'About',
      public: true,
    },
  },
  {
    name: 'dev.tools',
    path: '/dev-tools',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/DevToolsPage'),
    meta: {
      title: 'DevTools',
      public: true,
    },
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/AuthPage'),
    meta: {
      title: 'Welcome to Gamebrary',
      public: true,
    },
  },
  {
    path: '/privacy-policy',
    name: 'privacy.policy',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/PrivacyPolicyPage'),
    meta: {
      public: true,
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/TermsPage'),
    meta: {
      public: true,
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/SearchPage'),
    meta: {
      title: 'Search',
      public: true,
    },
  },
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/HomePage'),
    meta: {
      public: true,
    },
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/NotFoundPage'),
    meta: {
      public: true,
    },
  },
];

export default routes;
