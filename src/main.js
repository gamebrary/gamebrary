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
  Tooltip
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
  Tooltip
};

// Make bootstrap available globally for components
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap;
}
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire';
import { createI18n } from 'vue-i18n';
import PortalVue, { Portal, PortalTarget } from 'portal-vue';
import VueShortkey from 'vue-shortkey';
import ModalHeader from '@/components/ModalHeader';
import axios from 'axios';
import App from '@/App';
import './registerServiceWorker';
import messages from '@/i18n/';
import store from '@/store/';
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
      this.events[event] = this.events[event].filter(cb => cb !== callback);
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

// Make $root.$on, $root.$off, $root.$emit available for Vue 2 compatibility
// Vue 3 prevents mutating $ properties and internal instance objects are not extensible
// We use a Proxy but skip it for draggable components to avoid vuedraggable conflicts
app.mixin({
  created() {
    // Skip proxying for draggable component itself to avoid breaking vuedraggable
    // Check component name - vuedraggable components are typically named 'draggable'
    const componentName = this.$options.name || this.$options.__name || '';
    const isDraggableComponent = componentName === 'draggable';

    // Check Vue internal instance structure - draggable components have specific properties
    const isDraggableByStructure = this.$ &&
      (this.$.type?.__name === 'draggable' ||
       this.$.type?.name === 'draggable' ||
       (this.$.type?.setup && this.$.type.setup.toString().includes('vuedraggable')));

    // Skip proxying for draggable component to avoid breaking vuedraggable's internal component access
    if (!this._rootProxyCreated && this.$root && !isDraggableComponent && !isDraggableByStructure) {
      const originalRoot = this.$root;

      // Create the most minimal proxy possible - only intercept $on, $off, $emit
      const rootProxy = new Proxy(originalRoot, {
        get(target, prop) {
          if (prop === '$on' || prop === '$off' || prop === '$emit') {
            return eventBus[prop].bind(eventBus);
          }
          return target[prop];
        },
        set(target, prop, value) {
          if (!prop.toString().startsWith('$')) {
            target[prop] = value;
            return true;
          }
          return false;
        },
        has(target, prop) {
          if (prop === '$on' || prop === '$off' || prop === '$emit') {
            return true;
          }
          return prop in target;
        }
      });

      // Replace $root with proxy
      Object.defineProperty(this, '$root', {
        get() {
          return rootProxy;
        },
        configurable: true,
        enumerable: true,
      });

      this._rootProxyCreated = true;
    }
  }
});

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
const locale = localStorage?.vuex?.settings?.language || 'en';
const i18n = createI18n({
  locale,
  messages,
  legacy: true, // Use Options API mode for compatibility with existing components
});

app.use(i18n);

// Use Vuex store (Vuex 4 for Vue 3)
app.use(store);

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

