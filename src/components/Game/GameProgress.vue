<template lang="html">
  <b-col cols="6" sm="4" md="3" lg="12">
    <h4 class="mt-4">Progress: </h4>

    <b-link
      v-if="user"
      @click="editing = true"
    >
      {{ progress }}%
    </b-link>

    <b-button
      v-else
      :to="{ name: 'auth' }"
    >
      Login to set progress
    </b-button>

    <b-form v-if="editing">
      <b-form-input
        size="lg"
        v-model="progress"
        type="range"
        max="100"
        step="1"
      />

      <b-button
        variant="primary"
        :disabled="saving"
        class="mr-2"
        @click="saveProgress"
      >
        <b-spinner small v-if="saving" />
        <span v-else>{{ $t('global.save') }}</span>
      </b-button>

      <b-button
        :disabled="deleting"
        variant="danger"
        @click="deleteProgress"
      >
        <b-spinner small v-if="deleting" />
        <i v-else class="fas fa-trash fa-fw" aria-hidden />
      </b-button>
    </b-form>
  </b-col>
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
    ...mapState(['progresses', 'game']),
  },

  mounted() {
    this.progress = this.progresses?.[this.game?.id]
      ? JSON.parse(JSON.stringify(this.progresses?.[this.game?.id]))
      : 0;
  },

  methods: {
    async deleteProgress() {
      const { id, name } = this.game;

      this.deleting = true;

      this.$store.commit('REMOVE_GAME_PROGRESS', id);

      await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
        .catch(() => {
          this.$bvToast.toast('There was an error deleting your progress', { title: `${name} progress`, variant: 'error' });
          this.deleting = false;
        });

      this.deleting = false;
    },

    async saveProgress() {
      this.saving = true;

      this.$store.commit('SET_GAME_PROGRESS', {
        progress: this.progress,
        gameId: this.game?.id,
      });

      await this.$store.dispatch('SAVE_PROGRESSES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
        });

      this.editing = false;
      this.saving = false;
    },
  },
};
</script>
