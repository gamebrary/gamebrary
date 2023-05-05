const routes = [
  {
    name: 'notes',
    path: '/notes',
    component: () => import(/* webpackChunkName: "notes" */ '@/notes/pages/NotesPage'),
    meta: {
      title: 'Notes',
      public: true,
    },
  },
];

export default routes;
