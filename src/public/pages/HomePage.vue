<template lang="html">
  <div>
    <page-title :title="user ? 'Boards' : 'Gamebrary'" />

    <!-- <portal to="headerActions">
      <b-button
        v-if="user"
        :class="isVerticalNav ? 'mt-2' : 'mr-3'"
        @click="showPublic = !showPublic"
        v-b-tooltip.hover
        variant="black"
        :title="showPublic ? 'My boards' : 'All boards'"
      >
        <i v-if="showPublic" class="fa-solid fa-user" />
        <i v-else class="fa-solid fa-users" />
      </b-button>
    </portal> -->

    <div
      v-if="!user"
      class="mt-auto py-3 mb-3"
    >
      <h4 class="text-center mb-2">Organize your game library your way!</h4>

      <h4 class="text-center text-primary mb-2">Powered by:</h4>

      <div class="d-flex flex-wrap align-items-start justify-content-center overflow-auto">
        <!-- YouTube -->
        <img src="/logos/data-sources/wikipedia.svg" alt="wikipedia" width="60" class="mx-3">
        <img src="/logos/data-sources/igdb.svg" alt="igdb" width="80" class="mx-3">
        <img src="/logos/data-sources/fandom.svg" alt="fandom" width="80" class="mx-3 mt-2">
        <img src="/logos/data-sources/amazon.svg" alt="amazon" width="80" class="mx-3 mt-3">
        <img src="/logos/data-sources/twitch.svg" alt="twitch" width="80" class="mx-3 mt-2">
        <img src="/logos/data-sources/speedrun.png" alt="speedrun" width="80" class="mx-3 mt-3">
        <img src="/logos/data-sources/gog.svg" alt="gog" width="60" class="mx-3">
        <img src="/logos/data-sources/steam.svg" alt="steam" width="60" class="mx-3">
      </div>
    </div>

    <BoardsPage />

    <!-- <div class="game-deals">
      <twitter-feed twitter-user="wario64" />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BoardsPage from '@/components/BoardsPage';
import TwitterFeed from '@/components/TwitterFeed';

export default {
  components: {
    BoardsPage,
    // TwitterFeed,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme', 'isVerticalNav', 'navPosition']),

    offVariant() {
      return this.darkTheme
        ? 'black'
        : 'light';
    },
  },
};
</script>
