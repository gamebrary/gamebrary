<!-- TODO: restore wikipedia -->
<template lang="html">
  <div class="game-description">
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <div v-html="description" />
      <small class="text-muted">Source: {{ source }}</small>
    </template>

    <!-- <b-card no-body v-if="wikipediaArticle && wikipediaArticle.remaining">
      <b-tabs pills card>
        <b-tab
          v-for="section in wikipediaArticle.remaining.sections"
          :key="section.id"
          :title='section.line'
        >
          <b-card-text class="wiki-content" v-html="section.text" />
        </b-tab>
      </b-tabs>
    </b-card> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';

export default {
  data() {
    return {
      // wikipediaArticle: {},
      wikipediaDescription: null,
      loading: true,
      // descriptionSource: null,
    };
  },

  computed: {
    ...mapState(['game']),

    description() {
      return this.wikipediaExtract || this.steamDescription || this.igdbDescription;
    },

    source() {
      if (this.wikipediaExtract) return 'Wikipedia';
      if (this.steamDescription) return 'Steam';


      if (this.game?.steam?.short_description) return 'Steam';

      return 'IGDB';
      //
      // return this.wikipediaArticle && this.wikipediaArticle.lead && this.wikipediaArticle.lead[0]
      //   ? 'Wikipedia'
      //   : 'IGDB';
    },

    steamDescription() {
      return this.game?.steam?.about_the_game;
    },

    igdbDescription() {
      return this.game?.summary;
    },

    wikipediaExtract() {
      const pages = this.wikipediaDescription?.query?.pages;

      if (!pages) return;

      const [key] = Object.keys(pages);
      const { extract } = pages[key];

      return extract || null;
    },

    wikipediaData() {
      return this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      if (this.wikipediaData) {
        const slug = this.wikipediaData?.url?.split('/wiki/')[1];

        this.wikipediaDescription = await this.$store.dispatch('LOAD_WIKIPEDIA_DESCRIPTION', slug).catch((e) => {});
        this.loading = false;
      } else {
        this.loading = false;
      }
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
