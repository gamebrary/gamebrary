<!-- TODO: remove alert, use toast, style toast -->
<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->

<template lang="html">
  <div class="page-header position-relative">
    <header :class="[darkTheme ? 'bg-dark' : 'bg-white', isVerticalNav ? 'py-3 px-2' : 'px-3 py-2', `nav-${navPosition}`]">
      <!-- TODO: allow to collapse menu -->
      <div :class="['alert', alertType, { visible }]">
        <div class="d-flex align-items-center">
          <i :class="['fa-solid fa-info text-white mr-2', alertIcon]" />
          <strong>{{ alert.message }}</strong>
        </div>
      </div>

      <main-menu :class="isVerticalNav ? ' mb-2' : ''" />

      <portal-target
        v-if="!isVerticalNav"
        class="ml-3"
        name="pageTitle"
        multiple
      />

      <div :class="['align-items-center d-flex ml-auto', isVerticalNav ? 'h-100 flex-column' : '']">
          <portal-target name="headerActions" multiple />

          <b-button
            :variant="darkTheme ? 'black' : 'light'"
            :class="isVerticalNav ? 'mt-auto mb-2' : ''"
            :to="{ name: 'search' }"
          >
            <i class="fa fa-fw fa-search" aria-hidden="true" />
          </b-button>

          <b-button
            v-if="!user"
            class="ml-2"
            variant="black"
            :to="{ name: 'auth' }"
          >
            Get started — it's free!
          </b-button>
      </div>
    </header>
    <!-- <b-collapse id="header">

    </b-collapse> -->

    <!-- <b-button
      v-b-toggle.header
      variant="light"
      size="sm"
      pill
      class="header-toggle mt-n2"
    >
      <i class="fa-solid fa-caret-down" />
    </b-button> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MainMenu from '@/components/MainMenu';

export default {
  components: {
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

    alertType() {
      return this.alert?.type;
    },

    isTopNav() {
      return this.navPosition === 'top';
    },

    isBottomNav() {
      return this.navPosition === 'bottom';
    },

    isSearchPage() {
      return this.$route.name === 'search';
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
  align-items: center;
  border-bottom: 1px solid var(--light);

  &.nav-bottom {
    border-bottom: 0;
    border-top: 1px solid var(--light);
  }

  &.nav-left {
    border: 0;
    border-right: 1px solid var(--light);
  }

  &.nav-right {
    border: 0;
    border-left: 1px solid var(--light);
  }

  &.nav-left, &.nav-right {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  &.bg-dark {
    border-color: var(--black);
  }
}

.header-toggle {
  position: absolute;
  padding: 0;
  width: 30px;
  left: calc(50vw - 15px);
  background: var(--light);
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
