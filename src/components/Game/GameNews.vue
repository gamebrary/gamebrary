<template lang="html">
  <div class="game-news" v-if="articles.length">
    Latest news about {{ game.name }} <b-badge>{{ articles.length }}</b-badge>

    <ul class="list-unstyled">
      <b-media tag="li" v-for ="article in articles" :key="article.id" class="mb-2">
        <template #aside>
          <b-avatar
            variant="primary"
            :text="article.feedlabel"
            :title="article.feedlabel || article.author"
            v-b-tooltip.hover
          />
        </template>

        <h5 class="mt-0 mb-1">
          {{ article.title }}
          <br />
          <b-badge variant="info">{{ article.feedlabel }}</b-badge>
        </h5>

        <div>
          <p class="mb-0 w-100" v-html="$options.marked(article.contents)" />
        </div>
      </b-media>
    </ul>
  </div>
</template>

<script>
import { marked } from 'marked';
import bbCodeParser from 'js-bbcode-parser';
import { mapState } from 'vuex';

export default {
  marked,

  data() {
    return {
      articles: [],
    };
  },

  computed: {
    ...mapState(['game']),

    steamAppId() {
      const websites = this.game?.websites || [];
      const steamData = websites.find(({ category }) => category === 13);
      const steamUrl = steamData?.url;
      const steamAppId = steamUrl ? steamUrl.split('/')[4] : null;

      return steamAppId;
    },
  },

  mounted() {
    if (this.steamAppId) this.loadNews();
  },

  methods: {
    async loadNews() {
      this.articles = await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', this.steamAppId);
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
