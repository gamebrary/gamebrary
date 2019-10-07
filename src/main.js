import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueFire from 'vuefire';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import VueAnalytics from 'vue-analytics';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import App from './App';
import messages from './i18n/';
import store from './store/';
import router from './router';

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return EventBus;
        },
    },
});

Vue.use(VueAnalytics, { id: 'UA-120053966-1', router });
Vue.use(VueAxios, axios);
Vue.use(VueFire);
Vue.use(VueI18n);

if (process.env.NODE_ENV !== 'development') {
    Raven
        .config('https://15928bc58e7b45ac93878da6d8146064@sentry.io/1315568')
        .addPlugin(RavenVue, Vue)
        .install();
}

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters.auth) {
        next('/');
    } else {
        if (to.meta && to.meta.title) {
            document.title = `${to.meta.title} - Gamebrary`;
        }

        next();
    }
});

const vuexStorage = localStorage && localStorage.vuex
    ? JSON.parse(localStorage.vuex)
    : null;

if (vuexStorage && vuexStorage.user && window.FS && window.location.origin.indexOf('localhost') === -1) {
    const { displayName, email, dateJoined } = vuexStorage.user;

    window.FS.identify(vuexStorage.user.uid, { displayName, email, dateJoined });
}

const locale = vuexStorage && vuexStorage.settings && vuexStorage.settings.language
    ? vuexStorage.settings.language
    : 'en';

const i18n = new VueI18n({ locale, messages });

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: { App },
    template: '<App/>',
});
