<!-- TODO: use linkify https://github.com/Hypercontext/linkifyjs / http://localhost:4000/g/144072/hot-wheels-unleashed/news -->
<!-- TODO: find out all possible news sources and add constant entries -->
<!-- TODO: make game cover sticky -->
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

      <div v-else-if="!gameNews.length">
        no news found
      </div>

      <b-row v-else>
        <b-col cols="12" sm="4">
          <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
            <b-img :src="gameCoverUrl" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="12" sm="8">
          <b-card
            v-for="article in gameNews"
            class="mb-3"
            :key="article.id"
          >
            <div class="d-flex align-items-start justify-content-between">
              <aside>
                <p class="mb-0"><strong>{{ article.title }}</strong></p>
                <small v-if="article.author" class="text-muted mr-1">By {{ article.author }} |</small>
                <small class="text-muted">{{ article.date }}</small>
              </aside>

              <a
                v-if="article.source.url"
                :href="article.source.url"
                :title="article.source.name"
                target="blank"
                class="mb-2 ml-2"
              >
                <b-img
                  class="news-source-logo"
                  :src="`/logos/news-sources/${article.source.img}`"
                />
              </a>
            </div>

            <div class="game-news" v-html="article.contents" />
            <!-- TODO: restore tags? -->
            <!-- <b-badge v-for="tag in article.tags" :key="tag">{{ tag }}</b-badge> -->
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';
import { NEWS_SOURCES } from '@/constants/platforms';

export default {

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['game']),
    ...mapGetters(['gameNews']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    // TODO: put in getter
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

      await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', this.steamAppId);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.game-news {
  img {
    height: auto;
    margin-bottom: 1rem;
    max-width: 100%;
    border-radius: 4px;
    display: flex;
  }

  iframe {
    max-width: 100%;
  }
}

.news-source-logo {
  width: 60px;
  height: auto;
  max-width: 100%;
}
</style>
