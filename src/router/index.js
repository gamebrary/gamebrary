import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home/Home';
import ShareList from '@/pages/ShareList/ShareList';
import SessionExpired from '@/pages/SessionExpired/SessionExpired';
import GameDetail from '@/pages/GameDetail/GameDetail';
import Settings from '@/pages/Settings/Settings';
import Platforms from '@/pages/Platforms/Platforms';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/share/:id',
            name: 'share',
            component: ShareList,
        },
        {
            name: 'game-detail',
            path: '/g/:id/:slug',
            component: GameDetail,
        },
        {
            name: 'platforms',
            path: '/platforms',
            component: Platforms,
        },
        {
            name: 'settings',
            path: '/settings',
            component: Settings,
        },
        {
            path: '/session-expired',
            name: 'sessionExpired',
            component: SessionExpired,
        },
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        { path: '*', component: Home },
    ],
});
