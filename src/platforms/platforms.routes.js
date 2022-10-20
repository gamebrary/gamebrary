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
    path: '/p/:id',
    name: 'platform',
    component: () => import(/* webpackChunkName: "platforms" */ '@/platforms/pages/PlatformPage'),
  },
];

export default routes;
