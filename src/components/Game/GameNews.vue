<template lang="html">
  <div class="game-news">
    Latest news about {{ game.name }}

    <ul class="list-unstyled">
      <b-media tag="li" v-for ="article in articles" :key="article.id">
        <template #aside>
          <b-img blank blank-color="#abc" width="64" alt="placeholder"></b-img>
        </template>
        <h5 class="mt-0 mb-1">{{ article.title }}</h5>
        <p class="mb-0">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </p>
      </b-media>
    </ul>

    <b-card v-for ="article in articles" :key="article.id" class="mb-3">
      <pre>{{ article }}</pre>
      <!-- <h5 class="mb-0">
        <pre>{{ article.id }}</pre>
        {{ article.title }}

        <b-badge variant="info">{{ article.feedlabel }}</b-badge>
      </h5>

      <small>
        By {{ article.author }} on
        {{ $dayjs.unix(article.date).format('MMMM D, YYYY') }}
      </small>

      <p v-html="getformattedContent(article)" />

      <b-button :href="article.url" variant="info" target="_blank">Read article</b-button> -->
      <!-- TODO: add pc gamer logo /#/game/12597/owlboy -->

      <!-- <vue-markdown v-html="parseBBcode(article.contents)" /> -->
      <!-- <vue-markdown v-html="article.contents" /> -->
      <!-- https://cdn.akamai.steamstatic.com/steamcommunity/public/images -->
    </b-card>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import bbCodeParser from 'js-bbcode-parser';

export default {
  components: {
    VueMarkdown,
  },

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
      const websites = (this.game && this.game.websites) || [];

      const steamData = websites.find(({ category }) => category === 13);
      const steamUrl = steamData && steamData.url;
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
