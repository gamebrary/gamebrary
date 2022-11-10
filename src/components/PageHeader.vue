<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->

<template lang="html">
  <header class="py-2 px-3 d-flex">
    <side-bar v-if="user" />

    <b-button
      v-if="user"
      title="Dashboard"
      size="sm"
      class="p-0 mr-3"
      variant="transparent"
      v-b-toggle.sidebar
    >
      <img
        src="/logo.png"
        class="logo"
      />
    </b-button>

    <b-button
      v-else
      title="Dashboard"
      size="sm"
      class="p-0 mr-3"
      variant="transparent"
      :to="{ name: 'home' }"
    >
      <img
        src="/logo.png"
        class="logo"
      />
    </b-button>

    <portal-target name="pageTitle" multiple />

    <div class="align-items-center d-flex ml-auto">
      <portal-target name="headerActions" />

      <b-button v-if="!isSearchPage" :to="{ name: 'search' }" class="d-sm-none">
        <i class="fa fa-search" aria-hidden="true" />
      </b-button>

      <search-box :class="[{ 'd-none d-sm-block': !isSearchPage }]" />

      <b-button
        v-if="!user"
        class="ml-2"
        variant="dark"
        :to="{ name: 'auth' }"
      >
        Login
      </b-button>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import SearchBox from '@/components/SearchBox';
import SideBar from '@/components/SideBar';

export default {
  components: {
    SearchBox,
    SideBar,
  },

  computed: {
    ...mapState(['user']),

    isSearchPage() {
      return this.$route.name === 'search';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 65px 1fr;
    z-index: 1;
  }

  .logo {
    height: 36px;
  }
</style>
