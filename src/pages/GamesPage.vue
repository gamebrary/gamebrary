<template lang="html">
  <b-container class="px-3">
    <portal to="pageTitle">
      <h3>Games</h3>
    </portal>

    <!-- <portal to="headerActions">
      <b-button class="mr-3">
        Sort
      </b-button>

      <b-button class="mr-3">
        Filter
      </b-button>
    </portal> -->

    <empty-state
      v-if="!user"
      illustration="games"
     >
      <p>Click on <i class="fa-solid fa-heart text-primary" /> and your games will show here.</p>
     </empty-state>

    <b-spinner v-else-if="loading" class="spinner-centered" />

    <masonry
      v-else-if="likedGames.length"
      :cols="{ default: 5, 1200: 4, 768: 3, 480: 2 }"
      gutter="16px"
    >
      <b-card
        v-for="game in likedGames"
        body-class="pb-0"
        :bg-variant="darkTheme ? 'secondary' : 'light'"
        :text-variant="darkTheme ? 'white' : 'dark'"
        :key="game.id"
        :title="game.name"
        :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
        img-alt="Image"
        class="cursor-pointer mb-3"
        @click="$router.push({ name: 'game', params: { id: game.id, slug: game.slug }})"
      />
    </masonry>

    <empty-state
      v-else
      message="My games"
     >
      <!-- TODO: add illustration -->
      <b-button
        :to="{ name: 'auth' }"
      >
        Login
      </b-button>
     </empty-state>
  </b-container>
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
    }
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user']),
    ...mapGetters(['darkTheme']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([id, liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },
  },

  mounted() {
    if (this.user) this.loadGames();
  },

  methods: {
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
