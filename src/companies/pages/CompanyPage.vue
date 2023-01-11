<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else-if="company">
        <portal to="pageTitle">{{ company.name }}</portal>

        <img
          :src="$options.getImageUrl(company)"
          :alt="company.name"
          width="100"
          class="mb-2 rounded"
        />

        <p>{{ company.description }}</p>

        <h3 class="w-100 my-3">Games developed by {{ company.name }}</h3>

        <div class="game-grid">
          <router-link
            v-for="game in company.developed"
            :key="game.id"
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
          >
            <b-img
              :src="$options.getImageUrl(game)"
              :alt="game.name"
              rounded
              fluid
            />
          </router-link>
        </div>

        <h3 class="w-100 my-3">Games published by {{ company.name }}</h3>

        <div class="game-grid">
          <router-link
            v-for="game in company.published"
            :key="game.id"
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
          >
            <b-img
              :src="$options.getImageUrl(game)"
              :alt="game.name"
              rounded
              fluid
            />
          </router-link>
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

export default {
  getImageUrl,

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
