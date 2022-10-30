<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else-if="company">
        <h1>{{ company.name }}</h1>
        <p>{{ company.description }}</p>
        <img
          v-if="company.logo"
          :src="$options.getGameCoverUrl({ cover: { image_id: company.logo.image_id } })"
          alt=""
          width="100"
        />


        <b-form-row no-gutters>
          <h3 class="w-100 my-3">Games developed by {{ company.name }}</h3>

          <b-col
            v-for="game in company.developed"
            :key="game.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
              <b-img :src="$options.getGameCoverUrl(game)" alt="" fluid class="rounded" />
              <br />
              <small>{{ game.name }}</small>
            </router-link>
          </b-col>
        </b-form-row>

        <b-row no-gutters>
          <h3 class="w-100 my-3">Games published by {{ company.name }}</h3>

          <b-col
            v-for="game in company.published"
            :key="game.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
              <b-img :src="$options.getGameCoverUrl(game)" alt="" fluid class="rounded" />
              <br />
              <small>{{ game.name }}</small>
            </router-link>
          </b-col>
        </b-row>

        <!-- <pre>{{ company.slug }}</pre> -->
        <!-- <pre>{{ company.websites }}</pre> -->
      </div>

      <div v-else>
        empty
      </div>
    </b-container>
  </section>
</template>

<script>
import { getGameCoverUrl } from '@/utils';

export default {
  getGameCoverUrl,

  data() {
    return {
      loading: false,
      company: null,
    }
  },

  async mounted() {
    this.loading = true;
    const data = `fields id,description,developed.name,developed.slug,developed.cover.*,logo.*,name,published.name,published.slug,published.cover.*,websites.*,slug; where id = ${this.$route.params.id};`;

    [this.company] = await this.$store.dispatch('IGDB', { path: 'companies', data })

    console.log(this.company);
    // TODO: get larger image url

    this.loading = false;
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
