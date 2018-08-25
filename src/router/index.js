import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home/Home';
import ShareList from '@/pages/ShareList/ShareList';
import SessionExpired from '@/pages/SessionExpired/SessionExpired';
import Login from '@/pages/Login/Login';
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
            path: '/',
            name: 'home',
            component: Home,
            children: [
                {
                    name: 'game',
                    path: ':id/:slug',
                    component: Home,
                },
            ],
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
        { path: '*', component: Home },
    ],
});
