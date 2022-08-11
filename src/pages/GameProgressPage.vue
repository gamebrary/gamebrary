<template lang="html">
  <b-container>
    <portal to="headerTitle">
      <span>
        <b-button
          :to="{ name: 'game', params: { id: game.id, slug: game.slug }}"
          variant="light"
          >
          {{ game.name }}
        </b-button>

        Track progress
      </span>
    </portal>

    <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
      <b-img :src="gameCoverUrl" width="200" rounded class="mb-2 mr-2" />
    </router-link>

    {{ title }}

    <b-progress
      :value="localProgress"
      :max="100"
      show-progress
      variant="success"
      striped
      height="2rem"
    />
    <!-- TODO: animate when saving! -->
    <!-- animated -->
    <b-button
      v-if="!saving"
      variant="success"
      @click="markAsCompleted"
    >
      <i class="fas fa-check fa-fw" aria-hidden />
      Mark as completed
    </b-button>

    <b-button
      :disabled="deleting"
      variant="danger"
      @click="deleteProgress"
    >
      <i class="fas fa-trash fa-fw" aria-hidden />
      Remove progress
    </b-button>

    <b-button
      variant="primary"
      :disabled="saving"
      @click="saveProgress"
    >
      <b-spinner small v-if="saving" />
      <span v-else>{{ $t('global.save') }}</span>
    </b-button>

    <b-input-group :prepend="`${localProgress}%`" size="lg">
      <b-form-input
        size="lg"
        v-model="localProgress"
        type="range"
        max="100"
        step="1"
      />
    </b-input-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      localProgress: 0,
      saving: false,
      deleting: false,
      value: 45,
      max: 100,
    };
  },

  computed: {
    ...mapState(['progresses', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    title() {
      return this.localProgress
        ? 'Update progress'
        : 'Set progress';
    },
  },

  mounted() {
    this.setGameProgress();
  },

  methods: {
    markAsCompleted() {
      this.localProgress = 100;

      this.saveProgress();
    },

    show() {
      this.setGameProgress();
      this.saving = false;
      this.deleting = false;
    },

    setGameProgress() {
      const { id } = this.game;

      this.localProgress = this.progresses[id]
        ? JSON.parse(JSON.stringify(this.progresses[id]))
        : 0;
    },

    async deleteProgress() {
      const { id, name } = this.game;

      this.deleting = true;

      this.$store.commit('REMOVE_GAME_PROGRESS', id);

      await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
        .catch(() => {
          this.$bvToast.toast('There was an error deleting your progress', { title: `${name} progress`, variant: 'error' });
          this.deleting = false;
        });

      this.$bvToast.toast('Progress deleted', { title: `${name} progress`, variant: 'success' });
      this.$bvModal.hide('progress');
    },

    async saveProgress() {
      const { id, name } = this.game;

      this.saving = true;

      this.$store.commit('SET_GAME_PROGRESS', {
        progress: this.localProgress,
        gameId: id,
      });

      await this.$store.dispatch('SAVE_PROGRESSES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
        });

      this.$bvToast.toast('Progress updated', { title: `${name} progress`, variant: 'success' });
      this.$bvModal.hide('progress');
    },
  },
};
</script>
