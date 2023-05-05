const routes = [
  {
    name: 'tags',
    path: '/tags',
    component: () => import(/* webpackChunkName: "tags" */ '@/tags/pages/TagsPage'),
    meta: {
      title: 'Tags',
      public: true,
    },
  },
  {
    name: 'tag.create',
    path: '/tags/create',
    component: () => import(/* webpackChunkName: "tags" */ '@/tags/pages/CreateTagPage'),
    meta: {
      title: 'Create tag',
    },
  },
  {
    name: 'tag.edit',
    path: '/tags/:id',
    component: () => import(/* webpackChunkName: "tags" */ '@/tags/pages/EditTagPage'),
    meta: {
      title: 'Edit tag',
    },
  },
];

export default routes;
