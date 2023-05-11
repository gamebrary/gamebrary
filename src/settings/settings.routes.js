const routes = [
  {
    name: 'profile',
    path: '/profile',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/ProfilePage'),
    meta: {
      title: 'Profile',
    },
  },
  {
    name: 'steam',
    path: '/steam',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/SteamSettingsPage'),
    meta: {
      title: "Steam",
    },
  },
  {
    name: 'wallpapers',
    path: '/wallpapers',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/WallpapersPage'),
    meta: {
      title: 'Wallpapers',
      public: true,
    },
  },
];

export default routes;
