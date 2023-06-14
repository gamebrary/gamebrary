<template lang="html">
  <div>
    <page-title title="Games">
      <b-button
        v-if="isVerticalNav"
        @click="toggleView"
        class="mr-3"
        variant="light"
      >
        <i v-if="view === 'grid'" class="fa-solid fa-list" />
        <i v-else class="fa-solid fa-table-cells" />
      </b-button>
    </page-title>

    <b-container class="px-0">
      <!-- TODO: add sorting -->
      <!-- TODO: add more views -->
      <!-- TODO: add filtering -->
      <!-- TODO: add filtering -->

      <portal to="headerActions">
        <b-button
          v-if="!isVerticalNav"
          @click="toggleView"
          class="mr-3"
          variant="dark"
        >
          <i :class="`fa-solid ${view === 'grid' ? 'fa-list' : 'fa-table-cells'}`" />
        </b-button>

        <!-- <b-button class="mr-3">
          Sort
        </b-button>

        <b-button class="mr-3">
          Filter
        </b-button> -->
      </portal>

      <empty-state
        v-if="!user"
        illustration="games"
       >
        <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
       </empty-state>

      <b-spinner v-else-if="loading" class="spinner-centered" />

      <template v-else-if="likedGames.length">
        <div v-if="view === 'list'" class="small-container">
          <b-card
            v-for="game in likedGames"
            :bg-variant="darkTheme ? 'black' : 'light'"
            :text-variant="darkTheme ? 'white' : 'dark'"
            :key="game.id"
            :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
            img-alt="Image"
            img-left
            :title="game.name"
            img-width="100px"
            class="cursor-pointer mb-3"
            @click="$router.push({ name: 'game', params: { id: game.id, slug: game.slug }})"
          />
        </div>

        <masonry
          v-else
          :cols="{ default: 5, 1200: 4, 768: 3, 480: 2 }"
          gutter="16px"
        >
          <b-card
            v-for="game in likedGames"
            :body-class="['pb-0 text-center', { 'text-success' : isCompleted(game.id) }]"
            :bg-variant="darkTheme ? 'dark' : 'light'"
            :text-variant="darkTheme ? 'white' : 'dark'"
            :key="game.id"
            :title="game.name"
            :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
            img-alt="Image"
            class="cursor-pointer mb-3"
            @click="$router.push({ name: 'game', params: { id: game.id, slug: game.slug }})"
          />
        </masonry>
      </template>

      <empty-state
        v-else
        illustration="games"
        message="No liked games yet"
       />
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';

export default {
  getImageUrl,

  components: {
    EmptyState,
  },

  data() {
    return {
      loading: true,
      view: 'grid',
    }
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user', 'progresses']),
    ...mapGetters(['darkTheme', 'isVerticalNav']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([id, liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },
  },

  mounted() {
    if (this.user) this.loadGames();
  },

  methods: {
    isCompleted(gameId) {
      const progress = this.progresses?.[gameId] || 0;

      return Number(progress) === 100;
    },

    toggleView() {
      this.view = this.view === 'grid'
        ? 'list'
        : 'grid';
    },

    async loadGames() {
      try {
        await this.$store.dispatch('LOAD_GAMES');

        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = Object.keys(this.games)?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (Boolean(gamesNotCached)) {
          await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
        }
      } catch (e) {
        console.log('error', e);
      }

      this.loading = false;
    },
  },
};
</script>
