<template lang="html">
  <b-container>
    <PageTitle title="Tags">
      <!-- <b-button
        :variant="darkTheme ? 'success' : 'primary'"
        :to="{ name: 'tag.create' }"
      >
        <i class="d-sm-none fa-solid fa-plus" />
        <span class="d-none d-sm-inline">Add tag</span>
      </b-button> -->
    </PageTitle>

    <portal v-if="!isVerticalNav && !loading && tags.length > 0" to="headerActions">
      <b-button
        v-if="user"
        :variant="darkTheme ? 'success' : 'primary'"
        :to="{ name: 'tag.create' }"
        class="mr-3"
      >
        <i class="d-sm-none fa-solid fa-plus" />
        <span class="d-none d-sm-inline">Add tag</span>
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <empty-state
      v-else-if="tags.length === 0"
      illustration="tags"
      message="Using tags is a fantastic way to keep your collection well-organized!"
     >
      <b-button
        v-if="user"
        variant="primary"
        :to="{ name: 'tag.create' }"
      >
        Add tag
      </b-button>
     </empty-state>

    <b-row v-else>
      <b-col
        v-for="({ textColor, bgColor, name, games: taggedGames }, index) in tags"
        cols="12"
        sm="12"
        md="12"
        lg="8"
        offset-lg="2"
        :key="name"
      >

      <b-card
        :bg-variant="darkTheme ? 'dark' : 'light'"
        :text-variant="darkTheme ? 'light' : 'dark'"
        class="mb-2"
      >
        <b-button
          :style="`background-color: ${bgColor}; color: ${textColor}`"
          @click="$router.push({ name: 'tag.edit', params: { id: index } })"
        >
         {{ name }}
        </b-button>

        <b-form-row v-if="taggedGames.length" class="mt-2">
          <b-col
            v-for="game in taggedGames.slice(0, 6)"
            :key="game"
            cols="3"
            sm="4"
            md="3"
            lg="2"
          >
            <b-img
              :src="$options.getImageUrl(cachedGames[game], $options.IMAGE_SIZE_COVER_SMALL)"
              class="cursor-pointer rounded mb-2"
              fluid
              @click="$router.push({ name: 'game', params: { id: cachedGames[game].id, slug: cachedGames[game].slug }})"
            />
          </b-col>
        </b-form-row>

        <b-link
          v-if="taggedGames.length > 6"
          :to="{ name: 'tag.edit', params: { id: index } }"
        >
          {{ taggedGames.length }} more...
        </b-link>
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
    ...mapState(['tags', 'user', 'cachedGames']),
    ...mapGetters(['darkTheme', 'isVerticalNav']),
  },

  mounted() {
		if (this.user?.uid) this.load();
  },

  methods: {
    async load() {
      try {
        this.loading = true;

        await this.$store.dispatch('LOAD_TAGS');

        const allGames = Array.from(new Set(this.tags.map(({ games }) => games).flat()));
        const cachedGames = Object.keys(this.cachedGames);
        const gamesNotCached = allGames?.filter((game) => !cachedGames.includes(String(game)))?.toString();

        if (gamesNotCached) {
          await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
        }
      } catch (e) {
        console.log('e', e);
      }

      this.loading = false;
    },
  },
};
</script>
