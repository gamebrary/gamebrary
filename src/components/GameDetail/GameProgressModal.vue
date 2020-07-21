<template lang="html">
  <modal :title="$t('progresses.modalTitle')" ref="progressModal">
    <b-button :title="buttonLabel">
      <i class="fas fa-clock" />
    </b-button>

    <div slot="content">
      <b-input-group :prepend="`${localProgress}%`" class="mb-4" size="lg">
        <b-form-input
          size="lg"
          v-model="localProgress"
          type="range"
          max="100"
          step="5"
          @change="saveProgress"
        />
      </b-input-group>

      <b-button variant="danger" @click="deleteProgress">
        {{ $t('progresses.deleteProgress') }}
      </b-button>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      localProgress: '',
    };
  },

  computed: {
    ...mapGetters(['gameProgress']),

    defaultValue() {
      return {
        value: 0,
      };
    },

    buttonLabel() {
      return this.gameProgress
        ? this.$t('progresses.updateProgress')
        : this.$t('progresses.addProgress');
    },
  },

  watch: {
    gameProgress() {
      this.reset();
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    reset() {
      this.localProgress = this.gameProgress
        ? JSON.parse(JSON.stringify(this.gameProgress))
        : '0';
    },

    async deleteProgress() {
      this.$store.commit('REMOVE_GAME_PROGRESS');

      await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error deleting your progress', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'Progress deleted' });
      this.$refs.progressModal.close();
    },

    saveProgress: debounce(
      // eslint-disable-next-line
      function () {
        this.$store.commit('SET_GAME_PROGRESS', this.localProgress);

        this.$store.dispatch('SAVE_PROGRESSES')
          .then(() => {
            this.$bus.$emit('TOAST', { message: 'Progress updated' });
          })
          .catch(() => {
            this.$bus.$emit('TOAST', { message: 'There was an error saving your progress', type: 'error' });
            this.$router.push({ name: 'sessionExpired' });
          });
      }, 300),
  },
};
</script>
