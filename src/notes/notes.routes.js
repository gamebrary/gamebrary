const routes = [
  {
    name: 'notes',
    path: '/notes',
    component: () => import(/* webpackChunkName: "notes" */ '@/notes/pages/NotesPage'),
    meta: {
      title: 'Notes',
    },
  },
  {
    name: 'notes.create',
    path: '/notes/create',
    component: () => import(/* webpackChunkName: "notes" */ '@/notes/pages/CreateNotePage'),
    meta: {
      title: 'Create note',
    },
  },
];

export default routes;
