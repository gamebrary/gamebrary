const routes = [
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
    name: 'help',
    path: '/help',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/HelpPage'),
    meta: {
      title: 'Help',
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
      title: 'Privacy policy',
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/TermsPage'),
    meta: {
      public: true,
      title: 'Terms and conditions',
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
      title: 'Boards',
    },
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "public" */ '@/public/pages/NotFoundPage'),
    meta: {
      public: true,
      title: 'Page not found',
    },
  },
];

export default routes;
