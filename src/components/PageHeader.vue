<template lang="html">
  <header class="p-2 d-flex">
    <home-button />

    <div class="toolbar text-light pl-3">
      <b-button
        v-if="showBackButton"
        variant="outline-light"
        :title="`Back to ${board.name}`"
        :to="{ name: 'board', params: { id: board.id }}"
      >
        <i class="fas fa-arrow-left fa-fw" aria-hidden />
      </b-button>

      <portal-target name="pageTitle" />

      <span v-if="$route.meta.title">
        {{ $route.meta.title }}
      </span>


      <span v-if="showBoardName">
        {{ board.name }}
      </span>

      <div class="global-actions">
        <portal-target name="headerActions" />

        <b-button v-if="user" class="mr-2" variant="success" :to="{ name: 'upgrade' }">
          Upgrade
        </b-button>

        <search-box class="d-none d-md-block" />

        <b-button
          class="d-block d-md-none"
          :to="{ name: 'search' }"
        >
          <i class="fas fa-search fa-fw" aria-hidden />
        </b-button>

        <b-button
          v-if="user"
          :to="{ name: 'settings' }"
          variant="transparent"
          class="ml-1"
        >
          <i class="fas fa-cog fa-fw" />
        </b-button>

        <b-button
          v-else
          class="ml-2"
          :to="{ name: 'auth' }"
        >
          Login
        </b-button>
      </div>
    </div>
  </header>
</template>

<script>
// import GlobalSearch from '@/components/GlobalSearch';
import SearchBox from '@/components/SearchBox';
import HomeButton from '@/components/Shared/HomeButton';

import { mapState } from 'vuex';

export default {
  components: {
    // GlobalSearch,
    SearchBox,
    HomeButton,
  },

  computed: {
    ...mapState(['board', 'boards', 'user']),

    showBackButton() {
      return this.$route.name === 'game' && this.board?.id;
    },

    showBoardName() {
      return this.$route.name === 'board' && this.board?.name;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    overflow-y: hidden;
    height: 46px;
    grid-template-columns: 65px 1fr;
    // background-color: #1c1c27;
  }

  .toolbar {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .global-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
</style>
