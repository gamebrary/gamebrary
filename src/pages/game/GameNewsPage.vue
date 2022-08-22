<!-- TODO: get inspiration from polygon -->
<!-- TODO: restore bbparser -->
<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
          variant="light"
          class="mr-2"
          >
            <i class="fa-solid fa-chevron-left" />
        </b-button>

        News
      </div>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <div v-else-if="!articles.length">
      no news found
    </div>

    <b-row class="game-news" v-else>
      <b-col cols="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded />
        </router-link>
      </b-col>

      <b-col cols="6">
        <b-alert
          v-for="article in articles"
          :key="article.id"
          show
          variant="secondary"
          class="mb-3 small"
        >
          <strong>{{ article.title }}</strong>

          <div class="mb-0 w-100" v-html="$options.marked(article.contents)" />
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { marked } from 'marked';
import { getGameCoverUrl } from '@/utils';
// import bbCodeParser from 'js-bbcode-parser';

export default {
  marked,

  data() {
    return {
      loading: false,
      articles: [],
    };
  },

  computed: {
    ...mapState(['game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    steamAppId() {
      const steamData = this.game?.websites?.find(({ category }) => category === 13);
      const steamUrl = steamData?.url;

      return  steamUrl ? steamUrl.split('/')[4] : null;
    },
  },

  mounted() {
    if (this.steamAppId) this.loadNews();
  },

  methods: {
    async loadNews() {
      this.loading = true;

      this.articles = await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', this.steamAppId);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.game-news {
  img {
    width: 100%;
    height: auto;
    max-width: 100%;
  }
}
</style>
