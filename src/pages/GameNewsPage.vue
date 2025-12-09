<template lang="html">
  <section>
    <div class="container">
      <portal to="pageTitle">
        <div class="d-flex align-items-center">
          <router-link
            v-if="game?.id && game?.slug"
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            class="btn me-2"
            :class="darkTheme ? 'btn-secondary' : 'btn-light'"
          >
            <i class="fa-solid fa-chevron-left" />
          </router-link>
          <button
            v-else
            type="button"
            class="btn me-2"
            :class="darkTheme ? 'btn-secondary' : 'btn-light'"
            @click="$router.back()"
          >
            <i class="fa-solid fa-chevron-left" />
          </button>

          <h3>News</h3>
        </div>
      </portal>

      <div v-if="loading" class="spinner-centered d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="!gameNews" class="text-center">
        No news found
      </div>

      <div v-else class="row">
        <div class="col-12 col-sm-4">
          <router-link
            v-if="game?.id && game?.slug"
            :to="{ name: 'game', params: { id: game.id, slug: game.slug }}"
            class="float-end"
          >
            <img :src="$options.getImageUrl(game)" class="img-fluid rounded" alt="Game cover" />
          </router-link>
          <img
            v-else
            :src="$options.getImageUrl(game)"
            class="img-fluid rounded float-end"
            alt="Game cover"
          />
        </div>

        <div class="col-12 col-sm-8">
          <div
            v-for="article in gameNews"
            class="card mb-3"
            :class="darkTheme ? 'bg-secondary text-white' : 'bg-light text-dark'"
            :key="article.id"
          >
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between">
                <aside>
                  <h2 class="mb-0">
                    {{ article.title }}
                    <span class="badge">{{ article.date }}</span>
                  </h2>

                  <small v-if="article.author" :class="darkTheme ? 'text-light' : 'text-muted'">
                    By {{ article.author }}
                  </small>
                </aside>

                <a
                  v-if="article.source.url"
                  :href="article.source.url"
                  :title="article.source.name"
                  target="blank"
                  class="mb-2 ms-2"
                >
                  <img
                    class="news-source-logo"
                    :src="`/logos/news-sources/${article.source.img}`"
                    :alt="article.source.name"
                  />
                </a>
              </div>

              <div class="game-news" v-html="article.contents" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import { NEWS_SOURCES } from '@/constants';

export default {
  getImageUrl,

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['game']),
    ...mapGetters(['gameNews', 'darkTheme']),

    steamAppId() {
      const steamUrl = this.game?.websites?.find(({ category }) => category === 13)?.url;

      return steamUrl?.split('/')?.[4];
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
  width: 40px;
  height: auto;
  max-width: 100%;
}
</style>
