<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="gamePage"
          variant="light"
          class="mr-2"
          >
            <i class="fa-solid fa-chevron-left" />
        </b-button>

        Tags
      </div>
    </portal>

    <portal to="headerActions">
      <b-button
        :to="{ name: 'tags' }"
        variant="light"
        class="mr-2"
      >
        Manage tags
      </b-button>
    </portal>

    <b-spinner v-if="loading" class="spinner-centered" />

    <b-row v-else>
      <b-col cols="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded class="mb-2 mr-2 field" />
        </router-link>
      </b-col>

      <b-col>
        <empty-state
          v-if="empty"
          class="mb-4"
          message="Looks like you don't have any tags yet."
        >
          <b-button @click="manageTags">Manage tags</b-button>
        </empty-state>

        <section class="field">
          <section>
            <h3 class="mb-3">Tags applied to {{ game.name }}</h3>

            <b-alert :show="noneSelected" variant="light">
              No tags applied
            </b-alert>
            <!-- TODO: use correct tags -->
            <b-button
              v-for="({ selected, name, bgColor, textColor }, index) in formattedTags"
              :key="name"
              rounded
              block
              variant="transparent"
              :class="{ 'd-none': !selected }"
              :disabled="saving"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              @click="removeTag(index)"
            >
              {{ name }}
            </b-button>
          </section>

          <hr />

          <h3 class="my-3">Tags available</h3>

          <b-button
            v-for="({ selected, name, bgColor, textColor }, index) in formattedTags"
            :key="name"
            rounded
            block
            variant="transparent"
            :class="{ 'd-none': selected }"
            :disabled="saving"
            :style="`background-color: ${bgColor}; color: ${textColor}`"
            @click="addTag(index)"
          >
            {{ name }}
          </b-button>
        </section>
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

    gamePage() {
      return { name: 'game', params: { id: this.game?.id, slug: this.game?.slug }};
    },

    empty() {
      return Object.keys(this.tags).length === 0;
    },

    formattedTags() {
      return this.tags.map((tag) => ({
        ...tag,
        selected: tag.games.includes(Number(this.$route.params.id)),
      }));
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

    manageTags() {
      this.$bvModal.hide('tags');
      this.$router.push({ name: 'tags' });
    },
  },
};
</script>
