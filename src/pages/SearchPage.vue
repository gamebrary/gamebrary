<template lang="html">
  <div class="search-page p-3">
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
