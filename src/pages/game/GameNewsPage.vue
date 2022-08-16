<!-- TODO: get inspiration from polygon -->
<template lang="html">
  <b-container fluid class="p-2">
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

    <div v-if="loading" class="text-center mt-5 ml-auto">
      <b-spinner/>
    </div>

    <div v-else-if="!articles.length">
      no news found
    </div>

    <div class="game-news" v-else>
      <ul class="list-unstyled">
        <b-card v-for="article in articles" :key="article.id" class="mb-2">
          <b-avatar
            variant="primary"
            :text="article.feedlabel"
            :title="article.feedlabel || article.author"
            v-b-tooltip.hover
          />

          <h2>
            {{ article.title }}
            <br />
            <b-badge variant="info">{{ article.feedlabel }}</b-badge>
          </h2>

          <div>
            <p class="mb-0 w-100" v-html="$options.marked(article.contents)" />
          </div>
        </b-card>
      </ul>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { marked } from 'marked';
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
