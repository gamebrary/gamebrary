<!-- TODO: Add a dashboard -->
<template lang="html">
  <div class="text-center">
    <div class="container">
      <div class="row my-4" v-if="!user">
        <div class="col">
          <img
            src="/img/gamebrary-logo.png"
            alt="Gamebrary"
            width="300"
            class="mb-3 mx-auto"
          />

          <p class="text-center">Elevate your game, Organize your way</p>

          <router-link
              to="/auth"
              class="btn btn-success btn-lg mb-5"
            >
            Get started, it's free!
          </router-link>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Game Tagging</h5>
              <p class="card-text">Tag your games with custom labels for easy organization. Whether by genre, platform, or rating, Gamebrary helps you find your next game quickly.</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Board Organizing</h5>
              <p class="card-text">Choose from tier-based, Kanban, or simple list boards to organize your games the way you prefer.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Note Taking</h5>
              <p class="card-text">Add notes to each game to track progress, strategies, and thoughts, all neatly organized in one place.</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Customizable Board Wallpapers</h5>
              <p class="card-text">Personalize your boards with custom images to make your collection visually unique.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Speedrun Information (Coming Soon)</h5>
              <p class="card-text">Track your speedrun times and personal bests alongside your games. Coming soon: dedicated space for speedrun stats!</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Progress Tracking</h5>
              <p class="card-text">Gamebrary makes it easy to track your progress in each game. Whether you're working on a 100% completion or simply enjoying the story, you can log your milestones and achievements to see how far you've come.</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Public Profiles</h5>
              <p class="card-text">Showcase your game library with a public profile to share your collection and gaming style with the world.</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card" :class="darkTheme ? 'bg-dark' : null">
            <div class="card-body">
              <h5 class="card-title">Public Boards</h5>
              <p class="card-text">Create public boards to share and collaborate on your game collection with others.</p>

              <router-link
                class="btn btn-primary mt-2"
                :to="{ name: 'public.boards' }"
            >
              View all public boards...
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="d-flex w-75 mx-auto justify-content-center">
      <ProfileCard
        v-for="(profile, index) in filteredProfiles"
        :key="profile.userName"
        :profile="profile"
        thumbnail
        :class="index ? 'ml-n4' : ''"
      />
    </div> -->

    <div class="container">
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
