import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueAxios from 'vue-axios';
import VueShortKey from 'vue-shortkey';
import VueFire from 'vuefire';
import VueI18n from 'vue-i18n';
import ModalHeader from '@/components/ModalHeader';
import axios from 'axios';
import VueAnalytics from 'vue-analytics';
import PortalVue from 'portal-vue';
import App from '@/App';
import './registerServiceWorker';
import messages from '@/i18n/';
import store from '@/store/';
import router from '@/router';
import 'vue-swatches/dist/vue-swatches.css'

const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get() {
      return EventBus;
    },
  },
});

Vue.use(VueShortKey, { prevent: ['input', 'textarea', '.ProseMirror'] });
Vue.use(PortalVue);
Vue.use(VueAnalytics, { id: 'UA-120053966-1', router });
Vue.use(VueAxios, axios);
Vue.use(VueFire);
Vue.use(VueI18n);
// Component specific defaults are keyed by their PascalCase name with the props as camelCase properties.
// https://bootstrap-vue.org/docs/reference/settings#settings
Vue.use(BootstrapVue, {
  BButton: { variant: 'black' },
  BAvatar: { variant: 'muted' },
  BDropdown: { variant: 'black' },
  BToast: {
    noCloseButton: true,
  },
});

Vue.component('ModalHeader', ModalHeader);

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

Vue.config.productionTip = false;

const locale = localStorage?.vuex?.settings?.language || 'en';
const i18n = new VueI18n({ locale, messages });

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');

