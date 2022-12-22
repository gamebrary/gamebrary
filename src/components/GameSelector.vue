<template lang="html">
  <div class="game-selector">
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

    <b-sidebar
      v-model="selecting"
      right
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      aria-labelledby="sidebar-title"
      shadow
      backdrop
      @hidden="selecting = false"
    >
      <template #header>
        <header class="d-flex align-items-center justify-content-between w-100">
          <h4>{{ title }}</h4>

          <b-button
            @click="selecting = false"
            :variant="darkTheme ? 'dark' : 'light'"
          >
            <i class="fa fa-close fa-fw" />
          </b-button>
        </header>
      </template>

      <div class="p-2">
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

        <div v-else-if="filteredSearchResults.length > 0">
          <b-card
            v-for="game in filteredSearchResults"
            class="cursor-pointer mt-2"
            :bg-variant="darkTheme ? 'secondary' : 'light'"
            :text-variant="darkTheme ? 'light' : 'dark'"
            body-class="p-1"
            :key="game.id"
            @click="selectGame(game.id)"
          >
            <b-row>
              <b-col cols="4">
                <b-card-img
                  :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
                  alt="Image"
                  class="game-thumbnail rounded mr-2"
                />
              </b-col>
              <b-col>
                {{ game.name }}
              </b-col>
            </b-row>
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
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, IGDB_QUERIES } from '@/constants';

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
    ...mapGetters(['isBoardOwner', 'darkTheme']),

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

      this.searchResults = await this.$store.dispatch('IGDB', {
        path: 'games',
        data: `${search} ${IGDB_QUERIES.SEARCH} limit 50; ${filter}`,
        mutation: 'CACHE_GAME_DATA',
      });

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
</style>
