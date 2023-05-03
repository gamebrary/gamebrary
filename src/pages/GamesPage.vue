<template lang="html">
  <b-container class="px-3">
    <portal to="pageTitle">
      <h3>My games</h3>
    </portal>

    <masonry
      v-if="user"
      :cols="{ default: 5, 1200: 4, 768: 3, 480: 2 }"
      gutter="8px"
    >
      <b-card
        v-for="game in likedGames"
        body-class="pb-0"
        :key="game.id"
        :title="game.name"
        :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
        img-alt="Image"
        class="cursor-pointer mb-2"
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
import { mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';

export default {
  getImageUrl,

  components: {
    EmptyState,
  },

  computed: {
    ...mapState(['games', 'cachedGames', 'user']),

    likedGames() {
      if (!this.user) return null;

      return Object.entries(this.games)?.filter(([id, liked]) => liked)?.map(([id]) => this.cachedGames?.[id]);
    },
  },

  methods: {
    // TODO: load games that arent cached.
  },
};
</script>
