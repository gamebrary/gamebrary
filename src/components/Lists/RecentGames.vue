<!-- TODO: limit platform search to board platforms, allow to change -->
<!-- TODO: show tip to edit board if need to change platforms -->

<template lang="html">
  <b-tab title="Recent games">
    <game-card-search
      v-for="{ id } in testData"
      :key="id"
      :game-id="id"
      :list="list"
    />
  </b-tab>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardSearch,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      testData: null,
    };
  },

  computed: {
    ...mapState(['results', 'board']),

    noResults() {
      return !this.loading
        && this.filteredResults.length === 0
        && this.searchText.trim().length > 0;
    },

    filteredResults() {
      return this.results
        ? this.results.filter(({ id }) => !this.list.games.includes(id))
        : [];
    },

    gamesInList() {
      return this.results
        ? this.results.filter(({ id }) => this.list.games.includes(id))
        : [];
    },
  },

  mounted() {
    this.loadPopularGames();
  },

  methods: {
    loadPopularGames() {
      this.$store.dispatch('CUSTOM_SEARCH', { platforms: this.board.platforms.join(',') })
        .then((data) => {
          this.testData = data;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
