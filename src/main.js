import 'vue-material/dist/vue-material.min.css';
import VueMaterial from 'vue-material';
import VueDragscroll from 'vue-dragscroll';
import VueContentPlaceholders from 'vue-content-placeholders';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Vue from 'vue';
import store from './store/';
import App from './App';
import router from './router';

const EventBus = new Vue();

axios.interceptors.response.use(response => response, (error) => {
    if (error && error.response && error.response.status === 401) {
        window.location.href = '/#/session-expired';
    }
});

Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return EventBus;
        },
    },
});

Vue.use(VueMaterial);
Vue.use(VueContentPlaceholders);
Vue.use(VueDragscroll);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters.auth) {
        next('/');
    } else {
        next();
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
});
