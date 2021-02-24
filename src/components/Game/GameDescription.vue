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
        <span
          :class="{'break-spaces': source === 'IGDB' }"
          v-html="description"
        />

        <b-button v-b-modal.wikipediaArticle v-if="source === 'Wikipedia'">
          <i class="fab fa-wikipedia-w" aria-hidden />
          Read more
        </b-button>

        <!-- <template v-if="!trimmedDescription">
          <div
            v-html="gameDescription"
            :class="{'break-spaces': source === 'IGDB' }"
          />
        </template> -->
      </p>
    </template>

    <b-modal
      id="wikipediaArticle"
      scrollable
      hide-footer
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="game.name"
          subtitle="Wikipedia article"
          @close="close"
        >
          <template v-slot:header>
            <b-img
              :src="activeGameCoverUrl"
              :alt="game.name"
              class="float-left mr-2"
              height="40"
              rounded
            />
          </template>
        </modal-header>
      </template>

      <p
        :class="{'break-spaces': source === 'IGDB' }"
        v-html="gameDescription"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      wikipediaArticle: {},
      loading: true,
    };
  },

  computed: {
    ...mapGetters(['darkTheme', 'activeGameCoverUrl']),

    description() {
      return this.trimmedDescription
        ? this.trimmedDescription
        : this.gameDescription;
    },

    gameDescription() {
      const wikipediaDescription = this.wikipediaArticle && this.wikipediaArticle.extract
        ? this.wikipediaArticle.extract
        : null;

      const igdbDescription = this.game && this.game.summary
        ? this.game.summary
        : null;

      // Default to wikipedia, fall back to igdb
      return wikipediaDescription || igdbDescription;
    },

    trimmedDescription() {
      return this.gameDescription && this.gameDescription.length > 600
        ? `${this.gameDescription.substr(0, 600)}...`
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
        ? this.game.websites.find(({ url, category }) => {
          const wikipediaIgdbCategory = 3;

          return url.includes('/wiki/') && category === wikipediaIgdbCategory;
        })
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
  h2, h3 {
    margin-bottom: 0;
    padding-bottom: .5rem;
  }

  h2 {
    font-size: 24px;
    top: 0;
  }

  h3 {
    font-size: 18px;
  }

  h4, h5, h6 {
    font-size: 16px;
    font-weight: bold;
  }
}
.mw-empty-elt {
  display: none;
}
</style>
