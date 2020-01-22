<template lang="html">
  <modal :title="$t('list.addGames', { listName })" @open="clear">
    <button
      :title="$t('list.addGames', { listName })"
      class="add-game-button small secondary"
    >
      <i class="fas fa-plus" />
    </button>

    <template slot="content">
      <form @submit.prevent="search" class="search-form">
        <input
          ref="searchInput"
          v-model="searchText"
          :placeholder="$t('gameSearch.inputPlaceholder')"
          type="text"
        >

        <button class="primary" @click="search">
          <i :class="searchIcon" />
        </button>
      </form>

      <small
        v-if="gamesInList.length > 0"
        class="games-in-list"
        :title="gamesInListNames"
      >
        <strong>{{ gamesInListMessage }}</strong>
        {{ $t('gameSearch.alreadyInList') }}
      </small>

      <div
        v-if="filteredResults.length > 0"
        ref="searchResults"
        class="search-results"
      >
        <game-card-search
          v-for="{ id } in filteredResults"
          :key="id"
          :game-id="id"
          :list-id="listId"
          search-result
          @added="added"
        />

        <igdb-credit linkable />
      </div>

      <span
        v-if="noResults"
        class="no-results"
      >
        {{ $t('gameSearch.noResultsFound') }}
      </span>
    </template>
  </modal>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import Modal from '@/components/Modal';
import IgdbCredit from '@/components/IgdbCredit';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
  components: {
    GameCardSearch,
    IgdbCredit,
    Modal,
  },

  props: {
    listId: {
      type: [Number, String, Boolean],
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      searchText: '',
      loading: false,
    };
  },

  computed: {
    ...mapState(['results', 'gameLists', 'platform']),

    noResults() {
      return !this.loading
        && this.filteredResults.length === 0
        && this.searchText.trim().length > 0;
    },

    searchIcon() {
      return this.loading
        ? 'fas fa-circle-notch fast-spin'
        : 'fas fa-search';
    },

    list() {
      return this.gameLists[this.platform.code];
    },

    listName() {
      return this.list[this.listId].name;
    },

    filteredResults() {
      return this.results
        ? this.results.filter(({ id }) => !this.list[this.listId].games.includes(id))
        : [];
    },

    gamesInListNames() {
      return this.gamesInList.map(({ name }) => name).join(', ');
    },

    gamesInList() {
      return this.results
        ? this.results.filter(({ id }) => this.list[this.listId].games.includes(id))
        : [];
    },

    gamesInListMessage() {
      const gameCount = this.gamesInList.length;
      const plural = gameCount === 1 ? '' : 's';

      return `${gameCount} game${plural}`;
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

  methods: {
    clear() {
      this.searchText = '';
      this.$store.commit('CLEAR_SEARCH_RESULTS');
      this.focusInput();
    },

    focusInput() {
      setTimeout(() => {
        this.$refs.searchInput.focus();
      }, 100);
    },

    added() {
      this.$emit('added');
      this.$bus.$emit('GAMES_ADDED');

      if (this.filteredResults.length === 1) {
        this.clear();
      }
    },

    search: debounce(
      // eslint-disable-next-line
      function() {
        this.$store.dispatch('SEARCH', this.searchText)
          .then(() => {
            this.error = null;
            this.loading = false;
            this.$refs.searchResults.scrollTop = 0;
          })
          .catch(({ data }) => {
            this.loading = false;
            this.error = data;
          });
      }, 300),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .add-game-button {
    position: absolute;
    right: 0;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
  }

  .search-form {
    display: flex;
    align-items: center;
    margin-bottom: $gp;

    input {
      margin-bottom: 0;
    }

    button {
      margin-left: $gp;
    }
  }

  .games-in-list {
    margin-bottom: $gp;
    display: flex;
    align-items: center;

    strong {
      margin-right: .2rem;
    }
  }

  .search-results {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    border-radius: var(--border-radius);
    display: grid;
    grid-gap: $gp / 2;

    @media($small) {
      max-height: calc(100vh - 200px);
    }
  }
</style>
