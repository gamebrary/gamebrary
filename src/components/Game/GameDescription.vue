<template lang="html">
  <!-- TODO: break up wikipedia description into chunks -->
  <div class="game-description">
    <div v-if="loading" class="mb-4">
      <b-skeleton
        v-for="n in 3"
        :key="n"
      />
    </div>

    <template v-else>
      <!-- <small class="text-muted">Source: {{ source }}</small> -->
      <p
        :class="{'break-spaces': source === 'IGDB' }"
        v-html="description"
      />
    </template>

    <b-card no-body v-if="wikipediaArticle && wikipediaArticle.remaining">
      <b-tabs pills card>
        <b-tab
          v-for="section in wikipediaArticle.remaining.sections"
          :key="section.id"
          :title='section.line'
        >
          <b-card-text class="wiki-content" v-html="section.text" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      wikipediaArticle: {},
      loading: true,
    };
  },

  computed: {
    ...mapGetters(['activeGameCoverUrl']),
    ...mapState(['game']),

    description() {
      return this.trimmedDescription
        ? this.trimmedDescription
        : this.gameDescription;
    },

    gameDescription() {
      const steamDescription = this.game && this.game.steam && this.game.steam.short_description
        ? this.game.steam.short_description
        : null;


      // const wikipediaDescription = this.wikipediaArticle && this.wikipediaArticle.lead && this.wikipediaArticle.lead.sections[0]
      //   ? this.wikipediaArticle.lead.sections[0].text
      //   : null;

      const igdbDescription = this.game && this.game.summary
        ? this.game.summary
        : null;

      return steamDescription || igdbDescription;
    },

    trimmedDescription() {
      return this.gameDescription && this.gameDescription.length > 1200
        ? `${this.gameDescription.substr(0, 1200)}...`
        : null;
    },

    source() {
      if (this.game.steam && this.game.steam.short_description) {
        return 'Steam';
      }

      return this.wikipediaArticle && this.wikipediaArticle.lead && this.wikipediaArticle.lead[0]
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

.wiki-content img {
  float: left;
  // border-radius: 1rem;
  padding-right: 1rem;
  width: auto;
}
</style>
