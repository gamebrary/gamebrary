<template lang="html">
  <div v-if="user" style="width: 200px">
    {{ progress }}% Completed

    <b-form-input
      v-model="progress"
      type="range"
      max="100"
      step="1"
      debounce="500"
      @update="saveProgress"
    />

    <b-button
      v-if="progress"
      :disabled="deleting"
      variant="transparent"
      class="text-danger"
      size="sm"
      @click="deleteProgress"
    >
      <b-spinner small v-if="deleting" />
      <i v-else class="fas fa-trash fa-fw" aria-hidden />

      Clear progress
    </b-button>
  </div>

  <div v-else>
    <p>Track your game progress!</p>

    <b-button
      variant="secondary"
      :to="{ name: 'auth' }"
      class="mt-2"
    >
      Get started
    </b-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      progress: 0,
      saving: false,
      deleting: false,
    }
  },

  computed: {
    ...mapState(['progresses', 'game', 'user']),

    progressClass() {
      if (this.progress === 0) return 'bg-white';
      if (this.progress < 90) return 'bg-secondary';

      return 'bg-success';
    },
  },

  watch: {
      game(game) {
        if (game?.id) this.setProgress();
      },
  },

  mounted() {
    this.setProgress();
  },

  methods: {
    setProgress() {
      this.progress = this.progresses?.[this.game?.id]
        ? JSON.parse(JSON.stringify(this.progresses?.[this.game?.id]))
        : 0;
    },

    async deleteProgress() {
      try {
        const { id, name } = this.game;

        this.deleting = true;

        this.$store.commit('REMOVE_GAME_PROGRESS', id);

        await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE');
        this.progress = 0;
        this.$bvToast.toast('Progress deleted');
      } catch (e) {
        this.$bvToast.toast('There was an error deleting your progress', { variant: 'error' });
      }

      this.deleting = false;
    },

    async saveProgress() {
      try {
        this.saving = true;

        this.$store.commit('SET_GAME_PROGRESS', {
          progress: this.progress,
          gameId: this.game?.id,
        });

        await this.$store.dispatch('SAVE_PROGRESSES');

        // this.$bvToast.toast('Progress saved');
      } catch (e) {
        this.saving = false;
        // this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
      }

      this.saving = false;
    },
  },
};
</script>
