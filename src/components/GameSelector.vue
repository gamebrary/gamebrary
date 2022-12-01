<template lang="html">
  <div>
    <component
      :is="triggerComponent"
      trigger-text="Add games to tier"
      :variant="variant"
      :size="size"
      :block="block"
      @click="selecting = true"
    >
      <template v-if="triggerText">{{ triggerText }}</template>
      <slot />
    </component>

    <b-modal
      hide-footer
      v-model="selecting"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="title"
          @close="close"
        />
      </template>

      <b-form-input
       v-model="searchText"
       debounce="500"
       placeholder="Type here"
       type="search"
       @update="search"
      />

      <div v-if="loading" style="height: 80px" class="mt-5">
        <b-spinner class="spinner-centered" />
      </div>

      <div v-else-if="filteredSearchResults.length > 0" class="search-results">
        <b-card
          v-for="game in filteredSearchResults"
          class="cursor-pointer mt-2"
          body-class="p-1"
          :key="game.id"
          @click="selectGame(game.id)"
        >
          <b-card-img
            :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
            alt="Image"
            class="game-thumbnail rounded mr-2"
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

      <div v-else-if="searchText">
        No results
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

export default {
  getImageUrl,
  IMAGE_SIZE_COVER_SMALL,

  props: {
    block: Boolean,
    triggerComponent: {
      type: String,
      default: 'b-button',
    },
    triggerText: {
      type: String,
      default: '',
    },
    size: String,
    variant: {
      type: String,
      default: '',
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
  width: 80px;
  height: auto;
}

.search-results {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
