import Vue from 'vue';
import Router from 'vue-router';
import GameBoard from '@/pages/GameBoard';
import SessionExpired from '@/pages/SessionExpired';
import Platforms from '@/pages/Platforms';
import NotFound from '@/pages/NotFound';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'platforms',
            path: '/platforms',
            component: Platforms,
            meta: {
                title: 'Platforms',
            },
        },
        {
            name: 'sessionExpired',
            path: '/session-expired',
            component: SessionExpired,
            meta: {
                title: 'Session expired',
            },
        },
        {
            path: '/',
            name: 'game-board',
            component: GameBoard,
        },
        {
            path: '/auth/:authProvider',
            name: 'auth',
            component: GameBoard,
        },
        {
            path: '*',
            name: 'not-found',
            component: NotFound,
        },
    ],
});
