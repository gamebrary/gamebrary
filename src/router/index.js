import Vue from 'vue';
import Router from 'vue-router';
import ShareList from '@/pages/ShareList/ShareList';
import GameBoard from '@/pages/GameBoard/GameBoard';
import Platforms from '@/pages/Platforms/Platforms';

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
            path: '*',
            component: GameBoard,
        },
    ],
});
