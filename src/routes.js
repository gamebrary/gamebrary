import gameRoutes from '@/game/game.routes';
import boardsRoutes from '@/boards/boards.routes';
import tagsRoutes from '@/tags/tags.routes';
import profileRoutes from '@/profile/profile.routes';
import publicRoutes from '@/public/public.routes';
import settingsRoutes from '@/settings/settings.routes';
import notesRoutes from '@/notes/notes.routes';

const routes = [
  {
    name: 'games',
    path: '/games',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/GamesPage'),
    meta: {
      title: 'My games',
      public: true,
    },
  },
  {
    name: 'upcoming-games',
    path: '/games/upcoming',
    component: () => import(/* webpackChunkName: "games" */ '@/pages/UpcomingGames'),
    meta: {
      title: 'Upcoming games',
      public: true,
    },
  },
  {
    name: 'company',
    path: '/company/:id/:slug',
    component: () => import(/* webpackChunkName: "notes" */ '@/companies/pages/CompanyPage'),
    meta: {
      title: 'Company',
    },
  },
  ...gameRoutes,
  ...tagsRoutes,
  ...settingsRoutes,
  ...boardsRoutes,
  ...notesRoutes,
  ...publicRoutes,
  ...profileRoutes,
];

export default routes;
