<template lang="html">
  <div>
    <page-title :title="user ? 'Boards' : null" />

    <div
      class="mt-auto py-3 mb-3"
    >
      <h4 class="text-center mb-2">Elevate Your Play, Organize Your Way!</h4>

      <div class="bg-light p-3 rounded">
        <h4 class="text-center text-primary mb-2">Powered by</h4>

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
    </div>

    <div class="bg-success p-3 rounded">
      <h4 class="text-center">Join the community and start creating your own boards!</h4>

      <div>
        <profile-card
          v-for="profile in profiles"
          :key="profile.userName"
          :profile="profile"
        />


      </div>
    </div>

    <!-- TODO: put public boards here -->
    <!-- TODO: put public reviews here -->
    <!-- TODO: put latest news here -->
    <!-- TODO: put latest deals here -->

    <!-- <BoardsPage /> -->
    <div class="board-grid">
      <mini-board
        v-for="board in recentlyUpdatedPublicBoards"
        :key="board.id"
        :board="board"
        @click.native="$router.push({ name: 'board', params: { id: board.id } })"
      />
    </div>

    <!-- <div class="game-deals">
      <twitter-feed twitter-user="wario64" />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import TwitterFeed from '@/components/TwitterFeed';
import MiniBoard from '@/components/Board/MiniBoard';
import ProfileCard from '@/components/ProfileCard';

export default {
  components: {
    MiniBoard,
    // TwitterFeed,
    ProfileCard,
  },

  computed: {
    ...mapState(['user', 'profiles']),
    ...mapGetters(['darkTheme', 'isVerticalNav', 'navPosition', 'sortedPublicBoards']),

    recentlyUpdatedPublicBoards() {
        return this.sortedPublicBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 20);
      },
  },

  mounted () {
    this.loadPublicBoards();
  },

  methods: {
    async loadPublicBoards() {
      try {
        await this.$store.dispatch('LOAD_PROFILES');
        await this.$store.dispatch('LOAD_PUBLIC_BOARDS');
      } catch (e) {
        // this.loading = false;
      }  
    },
  },
};
</script>
