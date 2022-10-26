<template lang="html">
  <div>
    <b-button
      @click="selecting = true"
      :variant="variant"
      size="sm"
      block
    >
      <slot v-if="$slots.default" />
      <span v-else>Add games</span>
    </b-button>

    <b-modal hide-footer v-model="selecting">
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="title"
          @close="close"
        />
      </template>

      <b-form-input
       v-model="searchText"
       debounce="500"
       placeholder=""
       @update="search"
      />

      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else-if="filteredSearchResults.length > 0" class="search-results">
        <b-card
          v-for="game in filteredSearchResults"
          class="cursor-pointer mt-2"
          body-class="p-1"
          :key="game.id"
          @click="selectGame(game.id)"
        >
          <b-card-img
            :src="$options.getThumbnailUrl(game)"
            alt="Image"
            class="game-thumbnail rounded"
          />

          {{ game.name }}
        </b-card>

        <b-button
          v-if="isBoardOwner"
          block
          class="mt-1"
          :to="{ name: 'search', query: { boardId: board.id, listIndex: 0 } }"
        >
          Advanced search
        </b-button>
      </div>

      <div v-else>
        No results
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getThumbnailUrl } from '@/utils';

export default {
  getThumbnailUrl,

  props: {
    variant: {
      type: String,
      default: 'light',
    },
    title: {
      type: String,
      default: 'Select a game',
    },
    filter: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      searchText: '',
      loading: false,
      selecting: false,
      searchResults: [],
    }
  },

  mounted() {
      this.search();
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isBoardOwner']),

    filteredSearchResults() {
      return this.searchResults.filter(({ id }) => !this.filter?.includes(id));
    },
  },

  methods: {
    selectGame(gameId) {
      this.$emit('select-game', gameId);
      this.selecting = false;
    },

    async search() {
      this.loading = true;

      const search = this.searchText
      ? `search "${this.searchText}";`
      : '';

      const filter = !this.searchText
      ? 'where rating >= 80;'
      : '';
      const data = `${search} fields name,platforms,slug,rating,cover.image_id; limit 50; ${filter}`;

      this.searchResults = await this.$store.dispatch('IGDB', { path: 'games', data });

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-thumbnail {
  width: 40px;
  height: auto;
}

.search-results {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
