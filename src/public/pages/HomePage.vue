<!-- TODO: use this to animate features https://michalsnik.github.io/aos/ -->
<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3 class="text-outlined">Gamebrary</h3>
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
          <p class="text-info">Free and open source!</p>
        </ul>

        <b-button
          variant="success"
          class="mt-3"
          size="lg"
          :to="{ name: 'auth' }"
        >
          Get started!
        </b-button>

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

      <div class="d-flex align-items-start justify-content-center">
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

    <!-- <h1 class="display-5 mt-5 mb-3 mx-5 text-center">
      Gamebrary
    </h1> -->

    <!-- <b-row>
      <b-col class="bg-warning">
        <b-img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1212,h=992,fit=crop/blickpkok4/mockup_4-AQE98M88kgFWl5ey.png" />
      </b-col>
      <b-col class="bg-danger">
        <h3>Your games, in one place.</h3>
        <p>From checking accounts to savings, credit cards, and more, personal finances can be tricky. Blick's mission is to make it simple to manage everything from one place.</p>
      </b-col>
    </b-row> -->

    <!-- <b-form-row class="bg-secondary px-3 py-5">
      Organize your game library your way!

      Choose between 3 types of boards.

      Kanban
      - Standard, organize your games by creating
      - Robust, fully customizable organization.
      - Tier, Rank
    </b-form-row> -->

    <!-- <b-form-row>
      Game page

      - IGDB
      - YouTube
      - GOG
      - speedrun.com
      - Steam
      - Wikipedia
      - Twitch
      - Amazon
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

    <!-- <b-form-row class="bg-light px-3 py-5">
      <b-col cols="12">
        <h3 class="text-center text-light text-outlined py-2 mt-2">Trending games</h3>
      </b-col>

      <div class="d-flex overflow-auto">
        <b-col
          v-for="game in trendingGames"
          :key="game.id"
          cols="4"
          lg="2"
        >
          <game-card-search :game="game" />
        </b-col>
      </div>
    </b-form-row> -->

    <!-- <b-form-row class="px-3 py-5">
      <b-col cols="12">
        <h3 class="text-center text-light text-outlined py-2 mt-2">Featured boards</h3>
      </b-col>

      <b-col
        v-for="board in featuredBoards"
        :key="board.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <mini-board
          :board="board"
          class="mb-3"
          @click.native="$router.push({ name: 'board', params: { id: board.id } })"
        />
      </b-col>

      <b-button
        variant="secondary"
        class="mt-3 ml-auto mr-auto"
        size="lg"
        :to="{ name: 'explore' }"
      >
        More boards
      </b-button>
    </b-form-row> -->
  </section>
</template>

<script>
import { TRENDING_GAMES } from '@/constants';
// import MiniBoard from '@/components/Board/MiniBoard';
// import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState } from 'vuex';

export default {
  components: {
    // MiniBoard,
    // GameCardSearch,
  },

  data() {
    return {
      featuredBoards: [],
      trendingGames: [],
    }
  },

  computed: {
    ...mapState(['user']),

    year() {
      return new Date().getFullYear();
    },
  },

  async mounted() {
    this.featuredBoards = await this.$store.dispatch('LOAD_FEATURED_BOARDS');
    this.trendingGames = await this.$store.dispatch('LOAD_GAMES', TRENDING_GAMES);
  },
};
</script>

<style scoped>
.hero {
  z-index: 1;
  /* height: 100vh; */
}

</style>