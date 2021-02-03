<template lang="html">
  <b-dropdown-item-button
    @click="$bvModal.show(`game-modal-${list.name}`)"
    :variant="nightMode ? 'secondary' : null"
  >
    <i class="fas fa-plus fa-fw" />
    {{ $t('board.addGame.title') }}

    <b-modal
      :id="`game-modal-${list.name}`"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Add games"
          :subtitle="`${board.name} > ${list.name}`"
          @close="close"
        >
          <igdb-logo class="mt-2" />
        </modal-header>
      </template>

      <b-tabs content-class="pt-2" pills small>
        <search-games :list="list" />
        <recent-games :list="list" />
      </b-tabs>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import RecentGames from '@/components/Lists/RecentGames';
import SearchGames from '@/components/Lists/SearchGames';
import IgdbLogo from '@/components/IgdbLogo';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    RecentGames,
    SearchGames,
    IgdbLogo,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['nightMode']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-results {
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    display: grid;

    @media(max-width: 780px) {
      max-height: calc(100vh - 200px);
    }
  }
</style>
