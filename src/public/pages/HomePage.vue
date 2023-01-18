<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Gamebrary</h3>
    </portal>

    <!-- <div v-if="user" class="text-center py-5">
      Welcome back, {{ user.displayName }}
    </div> -->
    <!-- <div class="hero w-100 position-absolute text-center"> -->
    <div class="hero w-100 mt-5 text-center">
      <h1 class="display-3 mt-5 mb-3">Your game library.<br />Organized.</h1>
      <div class="mb-5 pb-5 field ml-auto mr-auto mb-auto">
        <ul class="list-unstyled">
          <li class="mb-1">Organize</li>
          <li class="mb-1">Track progress</li>
          <li class="mb-1">Take notes</li>
          <li class="mb-1">Customize</li>
          <li class="mb-1">News and updates</li>
          <li class="mb-1">Discover</li>
        </ul>

        <b-button
          variant="success"
          class="mt-3"
          :to="{ name: 'auth' }"
        >
          <span v-if="user">My boards</span>
          <span v-else>Get started</span>
        </b-button>

        <br />

        <small class="text-info"><ins>Free</ins> and <a href="https://github.com/romancm/gamebrary/" target="_blank">Open Source</a></small>

        <!-- <b-button variant="link" v-b-popover.hover.top="'I am popover directive content!'" title="Popover Title">
          <i class="fa-regular fa-circle fa-beat" />
        </b-button>
        <b-button variant="link" v-b-popover.hover.top="'I am popover directive content!'" title="Popover Title">
          <i class="fa-regular fa-circle fa-beat" />
        </b-button>
        <b-button variant="link" v-b-popover.hover.top="'I am popover directive content!'" title="Popover Title">
          <i class="fa-regular fa-circle fa-beat" />
        </b-button>
        <b-button variant="link" v-b-popover.hover.top="'I am popover directive content!'" title="Popover Title">
          <i class="fa-regular fa-circle fa-beat" />
        </b-button> -->
      </div>
    </div>

    <!-- <b-img src="landing.jpg" alt="" fluid /> -->

    <div class="mt-auto bg-light py-5">
      <h2 class="text-center text-primary mb-2">Game data from the most reliable sources</h2>

      <div class="d-flex align-items-start justify-content-center overflow-auto">
        <!-- YouTube -->
        <img src="/logos/data-sources/wikipedia.svg" alt="wikipedia" width="80" class="mx-3">
        <img src="/logos/data-sources/igdb.svg" alt="igdb" width="100" class="mx-3">
        <img src="/logos/data-sources/fandom.svg" alt="fandom" width="100" class="mx-3 mt-2">
        <img src="/logos/data-sources/amazon.svg" alt="amazon" width="100" class="mx-3 mt-3">
        <img src="/logos/data-sources/twitch.svg" alt="twitch" width="100" class="mx-3 mt-2">
        <img src="/logos/data-sources/speedrun.png" alt="speedrun" width="100" class="mx-3 mt-3">
        <img src="/logos/data-sources/gog.svg" alt="gog" width="70" class="mx-3">
        <img src="/logos/data-sources/steam.svg" alt="steam" width="80" class="mx-3">
      </div>
    </div>

    <footer class="text-center my-5">
      <router-link class="px-1" :to="{ name: 'about' }">About</router-link>
      <router-link class="px-1" :to="{ name: 'privacy.policy' }">Privacy</router-link>
      <router-link class="px-1" :to="{ name: 'terms' }">Terms</router-link>
      <br />
      <small>©{{ year }} Gamebrary</small>
    </footer>

    <!-- <b-form-row class="bg-secondary px-3 py-5">
      Organize your game library your way!

      Choose between 3 types of boards.

      Kanban
      - Standard, organize your games by creating
      - Robust, fully customizable organization.
      - Tier, Rank
    </b-form-row> -->

    <!-- <b-form-row>
      <b-col cols="4">
        <p class="lead">Track progress</p>
        <p>Desc</p>
      </b-col>
      <b-col cols="4">
        <p class="lead">Take notes</p>
        <p>Desc</p>
      </b-col>
      <b-col cols="4">
        <p class="lead">Discover</p>
        <p>Learn about your games, read news, developer updates, etc...</p>
      </b-col>
      <b-col cols="4">
        <p class="lead"></p>
        <p>Share your boards, create</p>
      </b-col>
      <b-col cols="4">
        <p class="lead">Community driven</p>
        <p>Gamebrary is fully open source, anyone can look at the code, contribute, and more. Built for the community by the community.</p>
      </b-col>

      <b-col cols="4">
        <p class="lead">Speedruns</p>
        <p>Get the latest speedrun stats, videos, and more!</p>
      </b-col>
    </b-form-row> -->
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),

    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.hero {
  z-index: 1;
}

</style>