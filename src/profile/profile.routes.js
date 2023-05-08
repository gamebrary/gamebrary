const routes = [
  {
    name: 'profiles',
    path: '/profiles',
    component: () => import(/* webpackChunkName: "profile" */ '@/profile/pages/PublicProfilesPage'),
    meta: {
      title: 'Profiles',
      public: true,
    },
  },
  {
    path: '/:userName',
    name: 'public.profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/profile/pages/PublicProfilePage'),
    meta: {
      public: true,
    },
  },
];

export default routes;
