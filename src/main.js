import VTooltip from 'v-tooltip';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueContentPlaceholders from 'vue-content-placeholders';
import VueDragscroll from 'vue-dragscroll';
import VueFire from 'vuefire';
import VueI18n from 'vue-i18n';
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';

import '@/shared/firebase';
import App from './App';
import messages from './i18n';
import router from './router';
import store from './store/';

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

Vue.use(VTooltip);
Vue.use(VueAxios, axios);
Vue.use(VueContentPlaceholders);
Vue.use(VueDragscroll);
Vue.use(VueFire);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);

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

const i18n = new VueI18n({
    locale: 'en',
    messages,
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: { App },
    template: '<App/>',
});
