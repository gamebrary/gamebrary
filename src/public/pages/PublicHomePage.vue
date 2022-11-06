<template lang="html">
  <section>
    <portal to="pageTitle">Gamebrary</portal>

    <h1 class="display-5 mt-5 mb-3 mx-5 text-center">
      Gamebrary
    </h1>

    <div class="mb-5 pb-5 field ml-auto mr-auto text-center mb-auto">
      <div class="lead text-primary">
        <p>Organize</p>
        <p>Track progress</p>
        <p>Take notes</p>
        <p>Learn</p>
        <p>Read news</p>
        <p>Discover</p>
        <p class="text-info">Free and open source!</p>
      </div>

      <b-button
        variant="success"
        class="mt-3"
        size="lg"
        :to="{ name: 'auth' }"
      >
        Get started!
      </b-button>
    </div>
    <div>
      <!-- <b-button
        variant="info"
        class="mt-3"
        :to="{ name: 'explore' }"
      >
        Check it out
      </b-button> -->

      <!-- <p class="small mt-2 text-muted">Free and open source!</p> -->
    </div>

    <!-- <b-form-row class="bg-secondary px-3 py-5">
      Organize your game library your way!

      Choose between 3 types of boards.

      Kanban
      - Standard, organize your games by creating
      - Robust, fully customizable organization.
      - Tier, Rank
    </b-form-row> -->

    <!-- <b-form-row>
      Show simplified game page, with lines pointing to content
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

    <b-form-row class="bg-secondary px-3 py-5">
      <b-col cols="12">
        <h3 class="text-center text-light text-outlined py-2 mt-2">Trending games</h3>
      </b-col>

      <b-col
        v-for="game in trendingGames"
        :key="game.id"
        cols="4"
        lg="2"
      >
        <game-card-search :game="game" />
      </b-col>
    </b-form-row>

    <b-form-row class="bg-info px-3 py-5">
      <b-col cols="12">
        <h3 class="text-center text-light text-outlined py-2 mt-2">Featured boards</h3>
      </b-col>

      <b-col
        v-for="board in featuredBoards"
        :key="board.id"
        cols="12"
        lg="3"
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
    </b-form-row>

    <footer class="text-muted text-center py-5">
      <router-link class="px-1" :to="{ name: 'about' }">About</router-link>
      <router-link class="px-1" :to="{ name: 'privacy.policy' }">Privacy</router-link>
      <router-link class="px-1" :to="{ name: 'terms' }">Terms</router-link>
      <br />
      ©{{ year }} Gamebrary
    </footer>
  </section>
</template>

<script>
import { TRENDING_GAMES } from '@/constants';
import MiniBoard from '@/components/Board/MiniBoard';
import GameCardSearch from '@/components/GameCards/GameCardSearch';

export default {
  components: {
    MiniBoard,
    GameCardSearch,
  },

  data() {
    return {
      featuredBoards: [],
      trendingGames: [],
    }
  },

  computed: {
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
