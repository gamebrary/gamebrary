<template lang="html">
  <section>
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

      <b-row v-else>
        <b-col cols="12" sm="4">
          <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
            <b-img :src="gameCoverUrl" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="12" sm="8">
          <!-- <pre>{{ articles }}</pre> -->
          <b-card
            v-for="article in articles"
            class="mb-3"
            :key="article.id"
          >
            <strong>{{ article.title }}</strong>
            <p class="text-muted small">By {{ article.author }} | {{ article.date }}</p>

            <div v-html="parseBBCode(article.contents)" />

            feedlabel
            <pre>{{ article.feedlabel }}</pre>
            feedname
            <pre>{{ article.feedname }}</pre>
            <!-- <b-badge v-for="tag in article.tags" :key="tag">{{ tag }}</b-badge> -->

            <!-- <div class="mb-0 w-100" v-html="$options.marked(article.contents)" /> -->
          </b-card>
        </b-col>
      </b-row>

      <!-- <b-row class="game-news" v-else>
        <b-col cols="6">
          <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
            <b-img :src="gameCoverUrl" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="6">

        </b-col>
      </b-row> -->
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { marked } from 'marked';
import { getGameCoverUrl } from '@/utils';
import bbobHTML from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'
import bbCodeParser from 'js-bbcode-parser';
import BBCodeParser from 'js-bbcode-parser/src/index.js';

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
    parseBBCode(contents) {
      return bbobHTML(contents, presetHTML5())
    },

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
