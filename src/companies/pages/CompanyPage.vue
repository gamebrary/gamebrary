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

        <div v-if="company.published" class="bg-light rounded p-3">
          <h3 class="w-100 my-3">Games published by {{ company.name }}</h3>

          <masonry
            gutter="16px"
            :cols="{ default: 7, 1200: 5, 768: 3, 480: 2 }"
          >
            <game-card-search
              v-for="gamePublished in company.published"
              :game="gamePublished"
              :key="gamePublished.id"
            />
          </masonry>
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
import GameCardSearch from '@/components/GameCards/GameCardSearch';

export default {
  getImageUrl,

  components: {
    GameCardSearch,
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

    this.loading = false;
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
