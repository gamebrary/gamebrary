const routes = [
  {
    name: 'platforms',
    path: '/platforms',
    component: () => import(/* webpackChunkName: "platforms" */ '@/platforms/pages/PlatformsPage'),
    meta: {
      title: 'Platforms',
    },
  },
  {
    path: '/platforms/:slug',
    name: 'platform.page',
    component: () => import(/* webpackChunkName: "platforms" */ '@/platforms/pages/PlatformPage'),
  },
];

export default routes;
