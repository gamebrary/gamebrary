import Vue from 'vue';
import Router from 'vue-router';
import ShareList from '@/pages/ShareList/ShareList';
import GameDetail from '@/pages/GameDetail/GameDetail';
import GameBoard from '@/pages/GameBoard/GameBoard';
import Platforms from '@/pages/Platforms/Platforms';

Vue.use(Router);

export default new Router({
    mode: 'history',
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
            path: '/',
            name: 'game-board',
            component: GameBoard,
        },
        { path: '*', component: GameBoard },
    ],
});
