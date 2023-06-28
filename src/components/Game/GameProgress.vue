<template lang="html">
  <div class="game-progress text-center">
    <b-link
      class="display-3"
      @click="editing = !editing"
    >
      {{ progress }}%
    </b-link>

    <b-button
      :disabled="deleting"
      variant="danger"
      size="sm"
      @click="deleteProgress"
    >
      <b-spinner small v-if="deleting" />
      <i v-else class="fas fa-trash fa-fw" aria-hidden />
    </b-button>

    <b-collapse id="collapse-4" v-model="editing" class="mt-2">
      <b-form>
        <b-form-input
          v-model="progress"
          type="range"
          max="100"
          step="1"
          debounce="500"
          @update="saveProgress"
        />

        <!-- <b-button
          variant="primary"
          :disabled="saving"
          class="mr-2"
          @click="saveProgress"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button> -->
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';


export default {
  data() {
    return {
      progress: 0,
      editing: false,
      saving: false,
      deleting: false,
    }
  },

  computed: {
    ...mapState(['progresses', 'game', 'user']),
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

      this.editing = false;
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

        this.$bvToast.toast('Progress saved');
      } catch (e) {
        this.saving = false;
        this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
      }

      this.editing = false;
      this.saving = false;
    },
  },
};
</script>
