/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default createStore({
  state,
  actions,
  mutations,
  getters,
  plugins: [
    createPersistedState({
      key: 'vuex',
      storage: window.localStorage,
    }),
  ],
});
