<!-- TODO: finish layout -->
<template lang="html">
  <b-container class="p-2">
    <template v-if="loading">
      loading
    </template>

    <template v-else>
      <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
        <b-img :src="gameCoverUrl" width="200" rounded class="mb-2 mr-2" />
      </router-link>

      <h3>Tags</h3>
      <p>Click on tag to add or remove tag from game</p>

      <empty-state
        v-if="empty"
        class="mb-4"
        message="Looks like you don't have any tags yet."
      >
        <b-button @click="manageTags">Manage tags</b-button>
      </empty-state>

      <b-row v-else>
        <!-- TODO: Show current games in tag -->
        <!-- TODO: Filter tag option if tags > too many -->
        <b-col cols="12" md="auto">
          <b-list-group>
            <b-list-group-item
              v-for="({ games, hex, tagTextColor }, name) in sortedTags"
              :key="name"
              class="d-flex justify-content-between"
              button
              :variant="games.includes(game.id) ? 'success' : ''"
              @click="games.includes(game.id) ? removeTag(name) : addTag(name)"
            >
              <b-badge
                pill
                tag="small"
                class="mr-3"
                :style="`background-color: ${hex}; color: ${tagTextColor}`"
              >
                {{ name }}
              </b-badge>

              <b-badge variant="light">{{ games.length }} games</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </template>

    <b-button :to="{ name: 'team.settings' }">Manage tags</b-button>
    <br />
    <b-button :to="{ name: 'team.settings' }">Create new tag</b-button>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

  data() {
    return {
      loading: true,
    };
  },

  computed: {
    ...mapState(['tags', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    empty() {
      return Object.keys(this.tags).length === 0;
    },

    sortedTags() {
      return Object.keys(this.tags)
        .sort()
        .reduce((res, key) => (res[key] = this.tags[key], res), {});
    },
  },

  mounted() {
    if (this.game.id !== this.$route.params.id) {
      this.loadGame();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadGame() {
      this.loading = true;
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('LOAD_GAME', this.$route.params.id)
        .catch(() => {
          this.loading = false;
        });

      this.loading = false;
    },

    async addTag(tagName) {
      const gameId = this.game.id;

      this.$store.commit('ADD_GAME_TAG', { tagName, gameId });
      await this.saveTags();

      this.$bvToast.toast(`Tag "${tagName}" added`, { title: this.game.name, variant: 'success' });
    },

    async removeTag(tagName) {
      const gameId = this.game.id;

      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId });
      await this.saveTags();

      this.$bvToast.toast(`Tag "${tagName}" removed`, { title: this.game.name, variant: 'success' });
    },

    saveTags() {
      this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },

    manageTags() {
      this.$bvModal.hide('tags');
      this.$bvModal.hide('game-modal');
      this.$router.push({ name: 'tags' });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
