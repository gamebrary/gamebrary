<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->

<template lang="html">
  <header :class="[darkTheme ? 'bg-black' : '', `nav-${navPosition}`, 'p-3']">
    <!-- TODO: allow to collapse menu -->
    <div :class="['alert', alertType, { visible }]">
      <div class="d-flex align-items-center">
        <!-- TODO: merge and use computed -->
        <i v-if="alertType === 'error'" class="fa-solid fa-triangle-exclamation text-white mr-2" />
        <i v-else-if="alertType === 'success'" class="fa-solid fa-check text-white mr-2"/>
        <i v-else class="fa-solid fa-info text-white mr-2" />
        <i :class="['fa-solid fa-info text-white mr-2', alertIcon]" />
        <strong>{{ alert.message }}</strong>
      </div>
    </div>

    <main-menu />

    <portal-target
      v-if="!isVerticalNav"
      class="ml-3"
      name="pageTitle"
      multiple
    />

    <div class="align-items-center d-flex ml-auto">
      <portal-target name="headerActions" multiple />

      <search-box v-if="showSearchBox" />

      <b-button
        v-if="!user"
        class="ml-2"
        variant="primary"
        :to="{ name: 'auth' }"
      >
        Login
      </b-button>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SearchBox from '@/components/SearchBox';
import MainMenu from '@/components/MainMenu';

export default {
  components: {
    SearchBox,
    MainMenu,
  },

  data() {
    return {
      alert: {},
      visible: false,
    }
  },

  mounted() {
    this.$bus.$on('ALERT', this.setAlert);
  },

  destroyed() {
    this.$bus.$off('ALERT');
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'navPosition', 'isVerticalNav']),

    showSearchBox() {
      return this.$route.name !== 'search';
    },

    alertType() {
      return this.alert?.type;
    },

    isTopNav() {
      return this.navPosition === 'top';
    },

    isBottomNav() {
      return this.navPosition === 'bottom';
    },

    alertIcon() {
      if (this.alertType === 'error') return 'fa-triangle-exclamation';
      if (this.alertType === 'success') return 'fa-check';

      return 'fa-info';
    },
  },

  methods: {
    setAlert(alert) {
      this.alert = alert;
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
header {
  display: flex;
  height: 72px;
  align-items: center;

  &.nav-left, &.nav-right {
    height: 100vh;
    display: flex;
    background: #ccf;
    flex-direction: column;
  }
}

.alert {
  position: fixed;
  height: 40px;
  // max-width: calc(100%  - 2rem);
  // min-width: 240px;
  // width: auto;
  z-index: 3;
  margin: 1rem;
  display: flex;
  align-items: center;
  background: var(--light);
  right: -75vw;
  transition: right 300ms ease 0s;
  width: 340px;

  @media(max-width: 1024px) {
    width: 50vw;
  }

  @media(max-width: 780px) {
    width: 50vw;
  }

  @media(max-width: 480px) {
    width: calc(100vw - 1rem - 42px);
    right: -100vw;
  }

  &.visible {
    right: -2rem;
  }

  &.success {
    background: var(--success);
  }

  &.error {
    background: var(--danger);
  }
}
</style>
