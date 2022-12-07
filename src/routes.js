import gameRoutes from '@/game/game.routes';
import boardsRoutes from '@/boards/boards.routes';
import tagsRoutes from '@/tags/tags.routes';
import profileRoutes from '@/profile/profile.routes';
import publicRoutes from '@/public/public.routes';
import settingsRoutes from '@/settings/settings.routes';
import notesRoutes from '@/notes/notes.routes';

const routes = [
  ...gameRoutes,
  ...tagsRoutes,
  ...settingsRoutes,
  ...boardsRoutes,
  ...notesRoutes,
  ...publicRoutes,
  ...profileRoutes,
  {
    name: 'company',
    path: '/company/:id',
    component: () => import(/* webpackChunkName: "notes" */ '@/companies/pages/CompanyPage'),
    meta: {
      title: 'Company',
    },
  },
];

export default routes;
