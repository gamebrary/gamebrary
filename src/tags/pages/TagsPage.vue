<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <h3>Tags</h3>
      </portal>

      <portal v-if="!loading && tags.length > 0" to="headerActions">
        <b-button
          class="mr-2"
          variant="primary"
          :to="{ name: 'tag.create' }"
        >
          Add tag
        </b-button>
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <empty-state
        v-else-if="tags.length === 0"
        message="Tags are a great way to organize your collection"
       >
         <b-button
           variant="primary"
           :to="{ name: 'tag.create' }"
         >
           Create a tag
         </b-button>
       </empty-state>

      <b-row v-else>
        <b-col
          v-for="({ textColor, bgColor, name, games: taggedGames }, index) in tags"
          cols="8"
          :key="name"
        >

        <b-card class="mb-2">
          <b-button
            :style="`background-color: ${bgColor}; color: ${textColor}`"
            @click="$router.push({ name: 'tag.edit', params: { id: index } })"
          >
           {{ name }}
          </b-button>

          <b-form-row v-if="taggedGames.length" class="mt-2">
            <b-col
              v-for="game in taggedGames.slice(0, 5)"
              :key="game"
              cols="6"
              sm="4"
              md="3"
              lg="2"
            >
              <b-img
                :src="$options.getImageUrl(games[game], $options.IMAGE_SIZE_COVER_SMALL)"
                class="cursor-pointer rounded mb-2"
                fluid
                @click="$router.push({ name: 'game', params: { id: games[game].id, slug: games[game].slug }})"
              />
            </b-col>

            <b-col
              v-if="taggedGames.length > 5"
              cols="6"
              sm="4"
              md="3"
              lg="2"
            >
              <router-link
                class="d-flex align-items-center w-100 h-100 bg-light text-dark justify-content-center rounded"
                :to="{ name: 'tag.edit', params: { id: index } }"
              >
                {{ taggedGames.length }} more...
              </router-link>
            </b-col>
          </b-form-row>
        </b-card>
        </b-col>

        <!-- <b-button
          v-for="({ textColor, bgColor, name, games }, index) in tags"
          @click="$router.push({ name: 'tag.edit', params: { id: index } })"
          rounded
          block
          variant="transparent"
          :style="`background-color: ${bgColor}; color: ${textColor}`"
          :key="name"
        >
          {{ name }} {{ games.length ? `(${games.length})` : '' }}
        </b-button> -->
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL } from '@/constants';

import EmptyState from '@/components/EmptyState';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  components: {
    EmptyState,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['tags', 'games']),
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      this.loading = true;

      await this.$store.dispatch('LOAD_TAGS')
        .catch(() => { this.loading = false; })

      this.loading = false;
    },
  },
};
</script>
