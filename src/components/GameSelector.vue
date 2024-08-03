<template lang="html">
  <div class="game-selector">
    <portal to="headerActions">
      <b-sidebar
        scrollable
        right
        width="380px"
        shadow
        no-header
        backdrop
        body-class="p-3"
        :visible="selecting"
        :bg-variant="darkTheme ? 'dark' : 'light'"
        :text-variant="darkTheme ? 'light' : 'dark'" 
        @hidden="selecting = false"
      >
        <template v-slot:modal-header="{ close }">
          <modal-header
            :title="title"
            @close="close"
          />
        </template>
        <h3>{{ title }}</h3>

        <div
          class="d-flex pt-1 justify-content-between align-items-center"
          style="position: sticky; top: -16px; z-index: 1"
        >
          <b-form-input
           v-model="searchText"
           debounce="500"
           class="mb-2"
           placeholder="Type here"
           type="search"
           @update="search"
          />

          <b-form-checkbox
            v-if="filteredSearchResults.length"
            v-model="preventClose"
            name="check-button"
            class="mb-2 ml-2"
            style="width: 220px;"
            switch
          >
            Select multiple
          </b-form-checkbox>
        </div>

        <div v-if="loading" style="height: 80px" class="mt-5">
          <b-spinner class="spinner-centered" />
        </div>

        <div v-else-if="filteredSearchResults.length > 0">
          <GameCard
            v-for="game in filteredSearchResults"
            :game-id="game.id"
            :key="game.id"
            selectable
            small
            @click="selectGame(game.id)"
          />

          <!-- <b-card
            v-for="game in filteredSearchResults"
            class="cursor-pointer mt-2"
            :bg-variant="darkTheme ? 'black' : 'light'"
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
          </b-card> -->
        </div>

        <div v-else-if="searchText">
          No results
        </div>
      </b-sidebar>
    </portal>

    <component
      :is="triggerComponent"
      :variant="variant"
      :size="size"
      :block="block"
      @click="selecting = true"
    >
      <template v-if="triggerText">{{ triggerText }}</template>
      <slot />
    </component>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import GameCard from '@/components/GameCards/GameCard';
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
      default: 'primary',
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
      preventClose: false,
      searchResults: [],
    }
  },

  components: {
    GameCard,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    cols() {
      return this.filteredSearchResults.length > 6
        ? { default: 3, 1200: 5, 768: 4, 480: 2 }
        : { default: 3, 768: 3, 480: 2 };
    },

    filteredSearchResults() {
      return this.searchResults.filter(({ id }) => !this.filter?.includes(id));
    },
  },

  methods: {
    selectGame(gameId) {
      this.$emit('select-game', gameId);

      if (!this.preventClose) this.selecting = false;
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
