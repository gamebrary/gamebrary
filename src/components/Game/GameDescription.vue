<template lang="html">
  <div class="game-description">
    <div v-if="loading">
      <b-skeleton
        v-for="n in 3"
        :key="n"
      />
    </div>

    <!-- TODO: get images from article and add them to screenshots -->
    <template v-else>
      <small>Source: {{ source }}</small>

      <p>
        <template v-if="trimmedDescription && !descriptionExpanded">
          <span
            :class="{'break-spaces': source === 'IGDB' }"
            v-html="trimmedDescription"
          />

          <b-button
            size="sm"
            @click="descriptionExpanded = true"
          >
            Read more.
          </b-button>
        </template>

        <template v-if="!trimmedDescription">
          <div
            v-html="gameDescription"
            :class="{'break-spaces': source === 'IGDB' }"
          />
        </template>
      </p>

      <b-collapse v-model="descriptionExpanded">
        <p
          :class="{'break-spaces': source === 'IGDB' }"
          v-html="gameDescription"
        />
      </b-collapse>
    </template>
  </div>
</template>

<script>
import { LINKS_CATEGORIES } from '@/constants';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      descriptionExpanded: false,
      wikipediaArticle: {},
      loading: true,
    };
  },

  computed: {
    gameDescription() {
      const wikipediaDescription = this.wikipediaArticle && this.wikipediaArticle.extract
        ? this.wikipediaArticle.extract
        : null;

      const igdbDescription = this.game && this.game.summary
        ? this.game.summary
        : null;

      // Default to wikipedia article, fall back to igdb's desc
      console.log(igdbDescription);
      return wikipediaDescription || igdbDescription;
    },

    trimmedDescription() {
      return this.gameDescription && this.gameDescription.length > 1000
        ? `${this.gameDescription.substr(0, 1000)}...`
        : null;
    },

    source() {
      return this.wikipediaArticle && this.wikipediaArticle.extract
        ? 'Wikipedia'
        : 'IGDB';
    },
  },

  mounted() {
    this.loadWikipediaArticle();
  },

  methods: {
    async loadWikipediaArticle() {
      const wikiData = this.game && this.game.websites
        ? this.game.websites.find(({ category, url }) => url.includes('/wiki/') && category === LINKS_CATEGORIES.wikipedia)
        : null;

      if (!wikiData) {
        this.loading = false;

        return;
      }

      const articleTitle = wikiData.url.split('/wiki/')[1];

      this.wikipediaArticle = await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', articleTitle)
        .catch(() => {
          this.loading = false;
        });

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.break-spaces {
  white-space: break-spaces;
}

h2 {
  background-color: red;
}
</style>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  h2 {
    font-size: 2px;
  }
}
.mw-empty-elt {
  display: none;
}
</style>
