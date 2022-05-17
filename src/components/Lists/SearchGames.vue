<template lang="html">
  <b-tab title="Search" active>
    <b-form @submit.prevent="search" class="mb-2">
      <b-input-group>
        <b-form-input
          v-model="searchText"
          autofocus
          debounce="500"
          :placeholder="$t('board.addGame.inputPlaceholder')"
        />

        <b-input-group-append>
          <b-button variant="primary" @click="search">
            <i
              :class="`fas ${loading ? 'fa-sync fa-spin' : 'fa-search'}`"
              aria-hidden
            />
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <b-form-text v-if="gamesInList.length">
        <!-- Searching <strong>{{ board.platforms.length }} platforms</strong>.
        <b-button>edit</b-button> -->

        <!-- <template v-if="gamesInList.length"> -->
        <template>
          <strong>{{ gamesInList.length }}</strong>
          {{ $t('board.addGame.alreadyInList') }}
        </template>
      </b-form-text>
    </b-form>

    <div
      v-if="filteredResults.length > 0"
      ref="searchResults"
      body-class="p-1 pb-0 search-results"
    >
      <game-card-compact
        v-for="{ id } in filteredResults"
        :key="id"
        :game-id="id"
        :list="list"
        class="mb-2"
        @click.native="addGame(id)"
      />
    </div>

    <b-alert :show="noResults" variant="warning" class="mt-2 mb-0">
      {{ $t('board.addGame.noResults') }}
    </b-alert>
  </b-tab>
</template>

<script>
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardCompact,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      searchText: '',
      loading: false,
    };
  },

  computed: {
    // TODO: stop storing this in store?
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

  watch: {
    searchText(value) {
      if (value) {
        this.loading = true;
        this.search();
      }
    },
  },

  mounted() {
    this.searchText = '';
    this.$store.commit('CLEAR_SEARCH_RESULTS');
  },

  methods: {
    async addGame() {
      const { list, game, board } = this;

      if (!list) return;

      const listIndex = board.lists.findIndex(({ name }) => name === list.name);

      this.$store.commit('ADD_GAME_TO_LIST', { listIndex, game });
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast(`There was an error adding ${this.game.name}`, { title: list.name, variant: 'danger' });
        });

      this.showGameToast();
    },

    async search() {
      await this.$store.dispatch('SEARCH_BOARD_GAMES', this.searchText)
        .catch(() => {
          this.$bvToast.toast('Error', { variant: 'danger' });

          this.loading = false;
        });

      this.error = null;
      this.loading = false;

      if (this.$refs.searchResults) {
        this.$refs.searchResults.scrollTop = 0;
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
