import Vue from 'vue';
import Router from 'vue-router';
import ShareList from '@/pages/ShareList';
import GameBoard from '@/pages/GameBoard';
import Platforms from '@/pages/Platforms';
import NotFound from '@/pages/NotFound';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/s',
            name: 'share-list',
            component: ShareList,
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
