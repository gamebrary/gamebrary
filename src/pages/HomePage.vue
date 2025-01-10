<template lang="html">
  <div class="text-center">
    <b-container>
      <b-row class="my-4" v-if="!user">
        <b-col>
          <img
            :src="darkTheme ? '/img/gamebrary-logo-light.png' : '/img/gamebrary-logo-dark.png'"
            alt="Gamebrary"
            width="300"
            class="mb-3 mx-auto"
          />

          <p class="text-center">Elevate your game, Organize your way</p>

          <b-button
              variant="success"
              class="mb-5"
              size="lg"
              :to="{ name: 'auth' }"
            >
            Get started, it's free!
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6" class="mb-4">
          <b-card title="Game Tagging" :class="darkTheme ? 'bg-dark' : null">
            <p>Tag your games with custom labels for easy organization. Whether by genre, platform, or rating, Gamebrary helps you find your next game quickly.</p>
          </b-card>
        </b-col>

        <b-col md="6" class="mb-4">
          <b-card title="Board Organizing" :class="darkTheme ? 'bg-dark' : null">
            <p>Choose from tier-based, Kanban, or simple list boards to organize your games the way you prefer.</p>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6" class="mb-4">
          <b-card title="Note Taking" :class="darkTheme ? 'bg-dark' : null">
            <p>Add notes to each game to track progress, strategies, and thoughts, all neatly organized in one place.</p>
          </b-card>
        </b-col>

        <b-col md="6" class="mb-4">
          <b-card title="Customizable Board Wallpapers" :class="darkTheme ? 'bg-dark' : null">
            <p>Personalize your boards with custom images to make your collection visually unique.</p>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6" class="mb-4">
          <b-card title="Speedrun Information (Coming Soon)" :class="darkTheme ? 'bg-dark' : null">
            <p>Track your speedrun times and personal bests alongside your games. Coming soon: dedicated space for speedrun stats!</p>
          </b-card>
        </b-col>

        <b-col md="6" class="mb-4">
          <b-card title="Progress Tracking" :class="darkTheme ? 'bg-dark' : null">
            <p>Gamebrary makes it easy to track your progress in each game. Whether you’re working on a 100% completion or simply enjoying the story, you can log your milestones and achievements to see how far you've come.</p>
          </b-card>
        </b-col>

        <b-col md="6" class="mb-4">
          <b-card title="Public Profiles" :class="darkTheme ? 'bg-dark' : null">
            <p>Showcase your game library with a public profile to share your collection and gaming style with the world.</p>
          </b-card>
        </b-col>

        <b-col md="6" class="mb-4">
          <b-card title="Public Boards" :class="darkTheme ? 'bg-dark' : null">
            <p>Create public boards to share and collaborate on your game collection with others.</p>

            <b-button
              class="mt-2"
              :to="{ name: 'public.boards' }"
            >
              View all public boards...
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <!-- <div class="d-flex w-75 mx-auto justify-content-center">
      <ProfileCard
        v-for="(profile, index) in filteredProfiles"
        :key="profile.userName"
        :profile="profile"
        thumbnail
        :class="index ? 'ml-n4' : ''"
      />
    </div> -->

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
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['user', 'profiles', 'publicBoards']),
    ...mapGetters(['darkTheme', 'navPosition']),

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
