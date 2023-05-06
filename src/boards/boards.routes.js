const routes = [
  {
    path: '/b/create',
    name: 'create.board',
    component: () => import(/* webpackChunkName: "boards" */ '@/boards/pages/CreateBoardPage'),
    meta: {
      title: 'Create board',
    }
  },
  {
    path: '/b/:id/edit',
    name: 'board.edit',
    component: () => import(/* webpackChunkName: "boards" */ '@/boards/pages/EditBoardPage'),
  },
  {
    path: '/b/:id',
    name: 'board',
    component: () => import(/* webpackChunkName: "boards" */ '@/boards/pages/BoardPage'),
    meta: {
      public: true,
    },
  },
];

export default routes;
