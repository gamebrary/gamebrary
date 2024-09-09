<template lang="html">
  <div>
    <div class="text-center">
      <h1 class="mb-2">Gamebrary</h1>
      <h2 class="mb-3">Elevate Your Play, Organize Your Way.</h2>

      <b-button
          variant="success"
          class="mb-5"
          :to="{ name: 'auth' }"
        >
          Join the community!
      </b-button>

      <div class="board-grid">
        <MiniBoard
          v-for="board in recentlyUpdatedPublicBoards"
          :key="board.id"
          :board="board"
        />
      </div>

      <b-button
        variant="link"
        class="mt-2"
        :to="{ name: 'public.boards' }"
      >
        View all public boards...
      </b-button>

      <h3 class="mt-3 mb-3">Discover and connect with others in the community!</h3>

      <div class="d-flex overflow-hidden w-75 mx-auto justify-content-center">
        <profile-card
          v-for="(profile, index) in filteredProfiles"
          :key="profile.userName"
          :profile="profile"
          :class="index ? 'ml-n3' : ''"
        />
      </div>

      <h3 class="mt-5">Powered by</h3>

      <div class="rounded d-flex flex-wrap align-items-start justify-content-center overflow-auto">
        <img src="/logos/data-sources/wikipedia.svg" alt="wikipedia" width="60" class="mx-3">
        <img src="/logos/data-sources/igdb.svg" alt="igdb" width="80" class="mx-3">
        <img src="/logos/data-sources/fandom.svg" alt="fandom" width="80" class="mx-3 mt-2">
        <img src="/logos/data-sources/amazon.svg" alt="amazon" width="80" class="mx-3 mt-3">
        <img src="/logos/data-sources/twitch.svg" alt="twitch" width="80" class="mx-3 mt-2">
        <img src="/logos/data-sources/speedrun.png" alt="speedrun" width="80" class="mx-3 mt-3">
        <img src="/logos/data-sources/gog.svg" alt="gog" width="60" class="mx-3">
        <img src="/logos/data-sources/steam.svg" alt="steam" width="60" class="mx-3">
      </div>

      <small class="pb-5">&copy; {{ currentYear }} Gamebrary </small>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import ProfileCard from '@/components/ProfileCard';

export default {
  components: {
    MiniBoard,
    ProfileCard,
  },

  computed: {
    ...mapState(['user', 'profiles']),
    ...mapGetters(['darkTheme', 'navPosition', 'sortedPublicBoards']),

    recentlyUpdatedPublicBoards() {
      return this.sortedPublicBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 12);
    },

    filteredProfiles() {
      return this.profiles.filter(({ avatar }) => avatar).slice(0, 5);
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
