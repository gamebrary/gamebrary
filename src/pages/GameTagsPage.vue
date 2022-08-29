<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
          variant="light"
          class="mr-2"
          >
            <i class="fa-solid fa-chevron-left" />
        </b-button>

        Tags
      </div>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else>
      <b-col cols="12" sm="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded />
        </router-link>
      </b-col>

      <b-col>
        <div class="field">
          <empty-state
            v-if="empty"
            class="mb-4"
            message="Looks like you don't have any tags yet."
          >
            <b-button :to="{ name: 'tags' }">Manage tags</b-button>
          </empty-state>

          <section v-else>
            <b-button
              v-for="({ name, bgColor, textColor, games }, index) in tags"
              :key="name"
              rounded
              block
              variant="transparent"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              @click="handleClick(games.includes(Number(game.id)), index)"
            >
              <i
                v-if="games.includes(Number(game.id))"
                class="fa-solid text-white fa-check bg-success p-1 rounded mr-1"
              />

              {{ name }}
            </b-button>

            <hr />

            <b-button block :to="{ name: 'tags' }">Manage tags</b-button>
          </section>
        </div>
      </b-col>
    </b-row>
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
      loading: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['tags', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    showBackIcon() {
      return this.game?.name.length > 25;
    },

    empty() {
      return Object.keys(this.tags).length === 0;
    },

    noneSelected() {
      return !this.formattedTags.some(({ selected }) => Boolean(selected));
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      const hasGameChanged = this.game.id !== this.$route.params.id;

      if (!hasGameChanged && this.game?.id && this.tags?.length > 0) return;

      try {
        this.loading = true;

        await this.$store.dispatch('LOAD_GAME', this.$route.params.id);
        await this.$store.dispatch('LOAD_TAGS')
      } catch (e) {
        this.loading = false;
      }

      this.loading = false;
    },

    handleClick(selected, index) {
      if (selected) {
        this.removeTag(index);
      } else {
        this.addTag(index);
      }
    },

    async addTag(index) {
      this.$store.commit('APPLY_TAG_TO_GAME', index);
      this.saving = true;

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {
          this.saving = false;
        });

      this.saving = false;
    },

    async removeTag(index) {
      this.$store.commit('REMOVE_GAME_FROM_TAG', index);

      this.saving = true;

      await this.$store.dispatch('SAVE_TAGS')
        .catch(() => {
          this.saving = false;
        });

      this.saving = false;
    },
  },
};
</script>
