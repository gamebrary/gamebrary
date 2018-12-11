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
            path: '/s/:userId/:listName',
            name: 'shareList',
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
            meta: {
                title: 'Platforms',
            },
        },
        {
            name: 'settings',
            path: '/settings',
            component: Settings,
            meta: {
                title: 'Settings',
            },
        },
        {
            path: '/session-expired',
            name: 'sessionExpired',
            component: SessionExpired,
            meta: {
                title: 'Session expired',
            },
        },
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        { path: '*', component: Home },
    ],
});
