<template lang="html">
  <section>
    <b-container class="px-0">
      <page-title :title="user ? 'Boards' : 'Gamebrary'" />

      <!-- Organize your game library your way!

      Choose between 3 types of boards.

      Kanban
      - Standard, organize your games by creating
      - Robust, fully customizable organization.
      - Tier, Rank -->
      <portal to="headerActions">
        <b-button-group
          v-if="user"
          :class="isVerticalNav ? 'mt-2' : 'mr-2'"
          :vertical="isVerticalNav"
        >
          <b-button
            @click="showPublic = false"
            :variant="showPublic ? 'light' : 'secondary'"
            v-b-tooltip.hover
            title="My boards"
          >
            <i class="fa-solid fa-user fa-fw" />
          </b-button>

          <b-button
            @click="showPublic = true"
            :variant="showPublic ? 'secondary' : 'light'"
            v-b-tooltip.hover
            title="All boards"
          >
            <i class="fa-solid fa-users fa-fw" />
          </b-button>
        </b-button-group>
      </portal>

      <game-boards :public="showPublic" />

      <template v-if="!user">
        <b-alert variant="success" show>
          <h4 class="alert-heading">Welcome!</h4>

          <p class="mb-0">
            Use Gamebrary to organize your video game collection.
          </p>

          <small class="text-info"><ins>Free</ins> and <a href="https://github.com/romancm/gamebrary/" target="_blank">Open Source</a></small>
        </b-alert>

        <div class="mt-auto bg-light py-5 mb-3 d-none d-md-block">
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
      </template>

      <!-- <div class="game-deals">
        <twitter-feed twitter-user="wario64" />
      </div> -->

      <footer class="pb-5 pt-3">
        <b-link
          href="https://github.com/romancm/gamebrary/releases"
          target="_blank"
          :class="darkTheme ? 'text-light' : 'text-dark'"
        >
          {{ latestRelease }}
        </b-link>

        <router-link class="px-1" :to="{ name: 'about' }">About</router-link>
        <router-link class="px-1" :to="{ name: 'privacy.policy' }">Privacy</router-link>
        <router-link class="px-1" :to="{ name: 'terms' }">Terms</router-link>
      </footer>
    </b-container>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameBoards from '@/components/GameBoards';
import TwitterFeed from '@/components/TwitterFeed';

export default {
  components: {
    GameBoards,
    // TwitterFeed,
  },

  data() {
    return {
      showPublic: false,
    }
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['latestRelease', 'darkTheme', 'isVerticalNav']),
  },
};
</script>
