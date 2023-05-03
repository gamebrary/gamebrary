<!-- TODO: remove sticky header -->
<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->

<template lang="html">
  <header :class="['p-3 d-flex position-fixed w-100', { scrolled }, headerClass]">
    <main-menu />

    <!-- TODO: use page header to display errors? -->

    <portal-target name="pageTitle" multiple />

    <div class="align-items-center d-flex ml-auto">
      <portal-target name="headerActions" multiple />

      <search-box />

      <b-button
        v-if="!user"
        class="ml-2"
        variant="success"
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

  computed: {
    ...mapState(['user', 'scrolled']),
    ...mapGetters(['darkTheme']),

    headerClass() {
      if (this.$route.name === 'board') return '';

      return this.darkTheme ? 'dark' : 'light';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 65px 1fr;
    z-index: 2;
    transition: background-color .3s linear;

    &.scrolled {
      &.light {
        background-color: var(--white);
      }

      &.dark {
        background-color: var(--black);
      }
    }
  }

  .logo {
    height: 36px;
  }
</style>
