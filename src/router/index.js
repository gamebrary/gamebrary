import Vue from 'vue';
import Router from 'vue-router';
import ShareList from '@/pages/ShareList/ShareList';
import GameDetail from '@/pages/GameDetail/GameDetail';
import GameBoard from '@/pages/GameBoard/GameBoard';
import Auth from '@/pages/Auth/Auth';
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
            path: '/auth',
            name: 'auth',
            component: Auth,
        },
        {
            path: '/',
            name: 'game-board',
            component: GameBoard,
        },
        { path: '*', component: Auth },
    ],
});
