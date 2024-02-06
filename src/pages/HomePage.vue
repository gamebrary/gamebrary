<template lang="html">
  <div>
    <div
      class="mt-auto py-3 mb-3"
    >
      <h1 class="text-center">Gamebrary</h1>
      <h2 class="text-center mb-3">Elevate Your Play, Organize Your Way!</h2>

      <div class="board-grid">
        <mini-board
          v-for="board in recentlyUpdatedPublicBoards"
          :key="board.id"
          :board="board"
          @click.native="$router.push({ name: 'board', params: { id: board.id } })"
        />
      </div>

      <div class="p-3 rounded">
        <h3 class="text-center">Join the community and start creating your own boards!</h3>

        <div class="d-flex overflow-auto justify-content-center my-3">
          <profile-card
            v-for="(profile, index) in filteredProfiles"
            :key="profile.userName"
            :profile="profile"
            :class="index ? 'ml-n3' : ''"
          />
        </div>
      </div>

      <div>
        <h3 class="text-center mb-2">Powered by</h3>

        <div class="rounded d-flex flex-wrap align-items-start justify-content-center overflow-auto">
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

    <!-- TODO: put public boards here -->
    <!-- TODO: put public reviews here -->
    <!-- TODO: put latest news here -->
    <!-- TODO: put latest deals here -->

    <!-- <div class="game-deals">
      <twitter-feed twitter-user="wario64" />
    </div> -->
    <p class="text-center py-5">&copy; {{ currentYear }} Gamebrary </p>
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
      return this.sortedPublicBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 12);
    },

    filteredProfiles() {
      return this.profiles.filter(({ avatar }) => avatar);  
    },

    currentYear() {
      return new Date().getFullYear();
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
