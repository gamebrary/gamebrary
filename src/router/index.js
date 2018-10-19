import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home/Home';
import ShareList from '@/pages/ShareList/ShareList';
import SessionExpired from '@/pages/SessionExpired/SessionExpired';
import Login from '@/pages/Login/Login';
import GameDetail from '@/pages/GameDetail/GameDetail';
import Settings from '@/pages/Settings/Settings';
import Admin from '@/pages/Admin/Admin';
import Register from '@/pages/Register/Register';

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
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
        },
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        { path: '*', component: Home },
    ],
});
