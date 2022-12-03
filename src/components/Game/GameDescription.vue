<template lang="html">
  <div :class="['game-description', source]">
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <div v-html="description" />
      <!-- TODO: use logos for listing all sources -->
      <span class="text-muted mt-n3 mb-3 text-capitalize">Source: {{ source }}</span>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';

export default {
  data() {
    return {
      wikipediaDescription: null,
      loading: false,
    };
  },

  computed: {
    ...mapState(['game']),

    description() {
      return this.wikipediaExtract || this.steamDescription || this.igdbDescription;
    },

    source() {
      if (this.wikipediaExtract) return 'wikipedia';
      if (this.steamDescription) return 'steam';

      return 'IGDB';
    },

    steamDescription() {
      return this.game?.steam?.about_the_game || this.game?.steam?.short_description;
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

    wikipediaSlug() {
      const wikipediaData = this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);

      return wikipediaData?.url?.split('/wiki/')?.[1];
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      if (!this.wikipediaSlug) return this.loading = false;

      this.wikipediaDescription = await this.$store.dispatch('LOAD_WIKIPEDIA_DESCRIPTION', this.wikipediaSlug).catch((e) => {});
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.game-description {
  &.steam {
    // Steam overrides
  }

  h2, h3 {
    margin: 0;
  }

  h2 {
    font-size: 14px;
    margin: 8px 0;
  }

  h3 {
    font-size: 18px;
  }

  h4, h5, h6 {
    font-size: 16px;
    font-weight: bold;
  }

  img {
    max-width: 100%;
    border-radius: .25rem;
  }
}

.mw-empty-elt {
  display: none;
}

.wiki-content img {
  float: left;
  border-radius: 1rem;
  padding-right: 1rem;
  width: auto;
}
</style>
