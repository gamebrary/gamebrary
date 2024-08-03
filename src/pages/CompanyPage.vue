<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else-if="company">
        <portal to="pageTitle">
          <h3>{{ company.name }}</h3>
        </portal>

        <img
          :src="$options.getImageUrl(company)"
          :alt="company.name"
          width="100"
          class="mb-2"
        />

        <p>{{ company.description }}</p>

        <h3 class="w-100 my-3">Games developed by {{ company.name }}</h3>

        <masonry
          gutter="16px"
          style="max-height: 60vh;"
          class="mb-5"
          v-if="company.developed"
          :cols="{ default: 7, 1200: 5, 768: 3, 480: 2 }"
        >
          <game-card-search
            v-for="gameDeveloped in company.developed"
            :game="gameDeveloped"
            :key="gameDeveloped.id"
          />
        </masonry>

        <div v-if="company.published">
          <h3 class="w-100 my-3">Games published by {{ company.name }}</h3>

          <GameCard
            v-for="gamePublished in company.published"
            :game-id="gamePublished.id"
            :key="gamePublished.id"
            show-tags
          />
        </div>
      </div>

      <div v-else>
        empty
      </div>
    </b-container>
  </section>
</template>

<script>
import { getImageUrl } from '@/utils';
import { IGDB_QUERIES } from '@/constants';
import GameCard from '@/components/GameCards/GameCard';

export default {
  getImageUrl,

  components: {
    GameCard,
  },

  data() {
    return {
      loading: false,
      company: null,
    }
  },

  async mounted() {
    this.loading = true;

    [this.company] = await this.$store.dispatch('IGDB', {
      path: 'companies',
      data: `${IGDB_QUERIES.COMPANY} where id = ${this.$route.params.id};`,
    });

    if (this.company.published?.length) this.$store.commit('CACHE_GAME_DATA', this.company.published);

    this.loading = false;
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
