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
          <!-- <b-img blank blank-color="#abc" width="64" alt="placeholder"></b-img> -->
          <!-- <b-badge variant="info">{{ article.feedlabel }}</b-badge> -->
        </template>

        <h5 class="mt-0 mb-1">
          {{ article.title }}
        </h5>

        <!-- <div>
          <p class="mb-0 w-100" v-text="article.contents" />
        </div> -->


          <!-- TODO: update to use marked -->
          <!-- <vue-markdown v-html="parseBBcode(article.contents)" /> -->
          <!-- <vue-markdown v-html="article.contents" /> -->
        <!-- </p> -->
      </b-media>
    </ul>

    <!-- <b-card v-for ="article in articles" :key="article.id" class="mb-3"> -->
      <!-- <pre>{{ article }}</pre> -->
      <!--
      <p v-html="getformattedContent(article)" />

      <b-button :href="article.url" variant="info" target="_blank">Read article</b-button> -->
      <!-- TODO: add pc gamer logo /#/game/12597/owlboy -->

      <!-- https://cdn.akamai.steamstatic.com/steamcommunity/public/images -->
    <!-- </b-card> -->
  </div>
</template>

<script>
// import { marked } from 'marked';
import bbCodeParser from 'js-bbcode-parser';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      articles: [],
    };
  },

  computed: {
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
    getformattedContent(article) {
      const usesBBcodeFormat = article.feedname === 'steam_community_announcements';

      return usesBBcodeFormat
        ? bbCodeParser.parse(article.contents.replace(/{STEAM_CLAN_IMAGE}/g, 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans/'))
        : article.contents;
    },

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
