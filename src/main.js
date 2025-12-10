import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
// Import Bootstrap JS components and construct bootstrap object
import {
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Offcanvas,
  Popover,
  ScrollSpy,
  Tab,
  Toast,
  Tooltip,
} from 'bootstrap';

// Construct bootstrap object with all components (matching Bootstrap 5 bundle structure)
const bootstrap = {
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Offcanvas,
  Popover,
  ScrollSpy,
  Tab,
  Toast,
  Tooltip,
};

// Make bootstrap available globally for components
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap;
}
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire';
import { createI18n } from 'vue-i18n';
import PortalVue, { Portal, PortalTarget } from 'portal-vue';
import VueShortkey from 'vue-shortkey';
import ModalHeader from '@/components/ModalHeader.vue';
import axios from 'axios';
import App from '@/App.vue';
import './registerServiceWorker';
import messages from '@/i18n';
import pinia from '@/stores';
import router from '@/router';

// Create event bus (simple emitter pattern)
class EventBus {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        // Remove specific callback
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      } else {
        // Remove all callbacks for this event (Vue 2 compatibility)
        delete this.events[event];
      }
    }
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }
  // Vue-style aliases for compatibility
  $on(event, callback) {
    return this.on(event, callback);
  }
  $off(event, callback) {
    return this.off(event, callback);
  }
  $emit(event, ...args) {
    return this.emit(event, ...args);
  }
}

const eventBus = new EventBus();

const app = createApp(App);

// Provide event bus globally
app.config.globalProperties.$bus = eventBus;
app.provide('$bus', eventBus);

// Add $on, $off, $emit to global properties for Vue 2 compatibility
// These are used by Bootstrap Vue components and other legacy code
app.config.globalProperties.$on = eventBus.$on.bind(eventBus);
app.config.globalProperties.$off = eventBus.$off.bind(eventBus);
app.config.globalProperties.$emit = eventBus.$emit.bind(eventBus);

// Use VueFire for Firebase
app.use(VueFire, VueFireFirestoreOptionsAPI);

// Use PortalVue for portal components
app.use(PortalVue);

// Manually register portal components to ensure they're available
// eslint-disable-next-line vue/multi-word-component-names
app.component('portal', Portal);
app.component('portal-target', PortalTarget);

// Use VueShortkey for keyboard shortcuts
app.use(VueShortkey);

// Create i18n instance
const locale = localStorage?.['pinia-settings']?.settings?.language || 'en';
const i18n = createI18n({
  locale,
  messages,
  legacy: false, // Use Composition API mode
});

app.use(i18n);

// Use Pinia store
app.use(pinia);

// Use router (must be after store)
app.use(router);

// Register global components
app.component('ModalHeader', ModalHeader);

// Register click-outside directive
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

// Mount app
app.mount('#app');
