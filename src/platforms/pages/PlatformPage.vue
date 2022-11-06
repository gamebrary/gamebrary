<!-- TODO: only load platforms once -->
<!-- TODO: add infinite loader / pagination -->
<!-- TODO: add sorting -->
<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <section v-else-if="platform">
        <portal to="pageTitle">
          {{ platform.name }}
        </portal>

        <portal to="headerActions">
          <b-button :to="{ name: 'platforms' }" class="mr-2">
            All platforms
          </b-button>
        </portal>

        <b-row class="mb-5">
          <b-col v-for="game in platformGames" :key="game.id" cols="3">
            <game-card-search :game="game" />
          </b-col>

          <b-button block class="mt-5 mb-5" @click="loadMoreGames">
            Load more games
          </b-button>
        </b-row>
      </section>
    </b-container>
  </section>
</template>

<script>
import merge from 'lodash.merge';
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      platforms: [],
      platformGames: [],
      offset: 0,
    }
  },

  components: {
    GameCardSearch,
  },

  computed: {
    platform() {
      return this.platforms?.find(({ id }) => id == this.$route.params.id);
    },
  },

  async mounted() {
    this.platforms = await this.$store.dispatch('LOAD_IGDB_PLATFORMS');
    this.loadGames();
  },

  methods: {
    async loadGames() {
      this.loading = this.offset === 0;

      const data = `
      fields platforms,slug,release_dates,rating,cover.image_id;
      limit 50;
      offset: ${this.offset};
      sort name asc;
      where release_dates.platform = ${this.platform.id};
      `;

      if (this.offset === 0) {
        this.platformGames = await this.$store.dispatch('IGDB', { path: 'games', data });
      } else {
        const games = await this.$store.dispatch('IGDB', { path: 'games', data });

        this.platformGames = merge(this.platformGames, games);
      }

      this.loading = false;
    },

    async loadMoreGames() {
      this.offset = this.platformGames.length;
      this.loadGames();
      // const data = `
      // fields platforms,slug,release_dates,rating,cover.image_id;
      // limit 50;
      // offset: ${this.offset};
      // sort name asc;
      // where release_dates.platform = ${this.platform.id};
      // `;
      //
      // const moreGames = await this.$store.dispatch('IGDB', { path: 'games', data });
      //
      // this.loading = false;
    },
  },
};
</script>
