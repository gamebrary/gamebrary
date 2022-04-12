import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueAxios from 'vue-axios';
import VueShortKey from 'vue-shortkey';
import Dayjs from 'vue-dayjs';
import VueFire from 'vuefire';
import VueI18n from 'vue-i18n';
import ModalHeader from '@/components/ModalHeader';
import PageTitle from '@/components/PageTitle';
import axios from 'axios';
import VueAnalytics from 'vue-analytics';
import Raven from 'raven-js';
import PortalVue from 'portal-vue';
import RavenVue from 'raven-js/plugins/vue';
import VueObserveVisibility from 'vue-observe-visibility';
import App from '@/App';
import './registerServiceWorker';
import messages from '@/i18n/';
import store from '@/store/';
import router from '@/router';
import bootstrapSettings from '@/bootstrapSettings';

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get() {
      return EventBus;
    },
  },
});

Vue.use(VueShortKey, { prevent: ['input', 'textarea'] });
Vue.use(Dayjs);
Vue.use(PortalVue);
Vue.use(VueObserveVisibility);
Vue.use(BootstrapVue, bootstrapSettings);
Vue.use(VueAnalytics, { id: 'UA-120053966-1', router });
Vue.use(VueAxios, axios);
Vue.use(VueFire);
Vue.use(VueI18n);
Vue.component('modal-header', ModalHeader);
Vue.component('page-title', PageTitle);

if (window.location.hostname.includes('gamebrary')) {
  Raven
    .config('https://15928bc58e7b45ac93878da6d8146064@sentry.io/1315568')
    .addPlugin(RavenVue, Vue)
    .install();
}

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - Gamebrary`;
  }

  next();
});

const vuexStorage = localStorage && localStorage.vuex
  ? JSON.parse(localStorage.vuex)
  : {};

if (vuexStorage && vuexStorage.user && window.FS && window.location.hostname.includes('gamebrary')) {
  const { displayName, email, dateJoined } = vuexStorage.user;

  window.FS.identify(vuexStorage.user.uid, { displayName, email, dateJoined });
}

const locale = vuexStorage && vuexStorage.settings && vuexStorage.settings.language
  ? vuexStorage.settings.language
  : 'en';

const i18n = new VueI18n({ locale, messages });

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');

