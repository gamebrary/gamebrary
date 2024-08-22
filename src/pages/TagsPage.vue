<template lang="html">
  <b-container>
    <portal to="pageTitle">
      Tags
    </portal>

    <portal v-if="user && !isEmpty" to="headerActions">
      <b-button

        :variant="darkTheme ? 'success' : 'primary'"
        :to="{ name: 'tag.create' }"
        title="Add tag"
      >
        <i class="fa-solid fa-plus" />
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <EmptyState
      v-else-if="isEmpty"
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
     </EmptyState>

    <div v-else>
      <b-list-group>
        <b-list-group-item
          v-for="({ textColor, bgColor, name, games: taggedGames }, index) in tags"
          :key="name"
          :variant="darkTheme ? 'dark' : 'light'"
          class="flex-column align-items-start"
          @click="openEditTagSidebar(index)"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <b-button
              variant="transparent"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
            >
            {{ name }}
            </b-button>

            <b-badge variant="primary" pill>
              {{ taggedGames.length }} games
            </b-badge>
          </div>
        </b-list-group-item>
      </b-list-group>

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
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['tags', 'user', 'cachedGames', 'activeTagIndex']),
    ...mapGetters(['darkTheme']),

    isEmpty() {
      return this.tags?.length === 0;
    },
  },

  watch: {
    activeTagIndex(activeIndex) {
      if (activeIndex === null) this.load();
    },
  },

  mounted() {
		if (this.user?.uid) this.load();
  },

  methods: {
    openEditTagSidebar(index) {
      this.$store.commit('SET_ACTIVE_TAG_INDEX', index);
    },

    async load() {
      try {
        this.loading = this.tags.length === 0;

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
