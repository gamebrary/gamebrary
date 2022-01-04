<template lang="html">
  <div class="global-search">
    <b-button v-b-toggle.global-search>
      <i class="fas fa-search fa-fw" aria-hidden />
    </b-button>

    <b-sidebar
      id="global-search"
      title="Sidebar"
      shadow
      backdrop
      text-variant="white"
      right
      header-class="px-2 pt-2 d-flex align-items-center justify-content-between"
    >
      <template #header="{ hide }">
        <h5 class="mb-0 ml-2">
          Game search
        </h5>

        <b-button
          class="align-self-baseline"
          @click="hide"
        >
          <i class="fas fa-times fa-fw" aria-hidden />
        </b-button>
      </template>

      <div class="px-3 py-2">
        <b-form-input
          v-model="searchText"
          type="search"
          autofocus
          debounce="500"
          class="mb-4"
          :placeholder="$t('board.addGame.inputPlaceholder')"
          @update="search"
        />

        <b-list-group
          v-for="{ id } in searchResults"
          :key="id"
          @click="openGame(id)"
        >
          <game-card-search
            :game-id="id"
            class="mb-2"
          />
        </b-list-group>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';

export default {
  components: {
    GameCardSearch,
  },

  data() {
    return {
      searchText: '',
      searchResults: [],
    };
  },

  methods: {
    openGame(gameId) {
      // TODO: handle game detail view setting
      // this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
      // this.$bvModal.show('game-modal');
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId });

      this.$router.push({
        name: 'game',
        params: {
          gameId,
          // gameSlug: this.games[gameId].slug,
        },
      });
    },

    async search(searchText) {
      if (!searchText) {
        this.searchResults = [];

        return;
      }

      this.searchResults = await this.$store.dispatch('CUSTOM_SEARCH', { searchText });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
