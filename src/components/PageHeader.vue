<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->

<template lang="html">
  <header :class="[darkTheme ? 'bg-dark' : 'bg-white', isVerticalNav ? 'p-2' : 'px-3 py-2', `nav-${navPosition}`]">
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
          <i class="fa fa-search" aria-hidden="true" />
        </b-button>

        <b-button
          v-if="!user"
          class="ml-2"
          variant="black"
          :to="{ name: 'auth' }"
        >
          Get started <span class="d-none d-sm-inline"> — it's free!</span>
        </b-button>
    </div>
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
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MainMenu from '@/components/MainMenu';

export default {
  components: {
    MainMenu,
  },

  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['darkTheme', 'navPosition', 'isVerticalNav']),

    isTopNav() {
      return this.navPosition === 'top';
    },

    isBottomNav() {
      return this.navPosition === 'bottom';
    },

    isSearchPage() {
      return this.$route.name === 'search';
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

// .header-toggle {
//   position: absolute;
//   padding: 0;
//   width: 30px;
//   left: calc(50vw - 15px);
//   background: var(--light);
// }
</style>
