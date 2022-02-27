<template lang="html">
  <header class="p-2 d-flex">
    <home-button />

    <div class="toolbar pl-3">
      <template v-if="$route.meta.title">
        {{ $route.meta.title }}
      </template>

      <portal-target v-else name="pageTitle" />

      <b-button
        v-if="showBackButton"
        size="sm"
        :to="{ name: 'board', params: { id: board.id }}"
      >
        <i class="fas fa-arrow-left fa-fw" aria-hidden />
        Back to {{ board.name }}
      </b-button>

      <template v-if="showBoardName">
        {{ board.name }}
      </template>


      <div class="global-actions">
        <portal-target name="headerActions" />

        <b-button
          :to="{ name: 'search' }"
          size="sm"
        >
          <i class="fas fa-search fa-fw" aria-hidden />
        </b-button>

        <b-button
          :to="{ name: 'settings' }"
          class="ml-1"
          size="sm"
        >
          <i class="fas fa-cog fa-fw" />
        </b-button>
      </div>
    </div>
  </header>
</template>

<script>
import GlobalSearch from '@/components/GlobalSearch';
import HomeButton from '@/components/Shared/HomeButton';
import { mapState } from 'vuex';

export default {
  components: {
    GlobalSearch,
    HomeButton,
  },

  computed: {
    ...mapState(['board', 'boards']),

    showBackButton() {
      return this.$route.name === 'game' && this.board && this.board.id;
    },

    showBoardName() {
      return this.$route.name === 'board' && this.board && this.board.name;
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
