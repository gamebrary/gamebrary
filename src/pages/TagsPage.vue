<template lang="html">
  <b-container>
    <portal v-if="user && !isEmpty" to="headerActions">
      <b-dropdown
        text="Tags"
        :variant="darkTheme ? 'success' : 'black'"
      >
        <b-dropdown-item-button
          title="Add tag"
          v-bind="buttonProps"
          v-b-toggle.create-tag-sidebar
        >
          <i class="fa-solid fa-plus" />
          Add tag
        </b-dropdown-item-button>
      </b-dropdown>
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
        v-b-toggle.create-tag-sidebar
      >
        Add tag
      </b-button>
     </EmptyState>

    <div v-else>
      <b-list-group>
        <b-list-group-item
          v-for="({ textColor, bgColor, name, games: taggedGames }, index) in tags"
          :key="index"
          :variant="darkTheme ? 'dark' : 'light'"
          class="flex-column align-items-start"
          @click="openEditTagSidebar(index)"
        >
          <div class="d-flex w-100 justify-content-md-between flex-column flex-md-row">
            <div class="d-flex flex-column">
              <b-button
                variant="transparent"
                :style="`background-color: ${bgColor}; color: ${textColor}`"
                class="mb-2"
              >
              {{ name }}
              </b-button>

              <b-badge variant="primary" pill>
                {{ taggedGames.length }} games
              </b-badge>
            </div>

            <b-avatar-group class="mt-3 mt-md-0 overflow-hidden">
              <GameCard
                v-for="gameId in taggedGames"
                small
                slim
                hide-title
                vertical
                hide-platforms
                hide-tags
                hide-progress
                class="ml-md-n5 border-light border"
                :key="gameId"
                :game-id="gameId"
              />

            </b-avatar-group>

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
import GameCard from '@/components/GameCard';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
    GameCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['tags', 'user', 'cachedGames', 'activeTagIndex']),
    ...mapGetters(['darkTheme', 'buttonProps']),

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

        if (gamesNotCached) await this.$store.dispatch('LOAD_IGDB_GAMES', gamesNotCached);
      } catch (e) {
        //
      }

      this.loading = false;
    },
  },
};
</script>
