<template lang="html">
  <modal :title="$t('progresses.modalTitle')" ref="progressModal">
    <button class="primary" :title="buttonLabel">
      <i class="fas fa-clock" />
    </button>

    <div slot="content">
      <h2>{{ localProgress }}%</h2>

      <input
        class="progress-range"
        v-model="localProgress"
        type="range"
        max="100"
        step="5"
        @change="saveProgress"
      >

      <button class="danger" @click="deleteProgress">
        {{ $t('progresses.deleteProgress') }}
      </button>
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
      localProgress: {},
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
        : 0;
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
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .progress-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 36px;
    border: 0;
    border-radius: $border-radius;
    padding: 0;
    margin-bottom: 0;
    background: transparent;
    overflow: hidden;
    order: 1;
    margin-top: $gp;
    margin-bottom: $gp;

    &:focus {
      outline: none;

      &::-webkit-slider-runnable-track {
        background: var(--accent-color);
      }

      &::-ms-fill-lower {
        background: var(--accent-color);
      }

      &::-ms-fill-upper {
        background: var(--accent-color);
      }
    }

    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 36px;
      cursor: pointer;
      animate: 0.2s;
      background: var(--accent-color);
      border-radius: $border-radius;
      overflow: hidden;
    }

    &::-webkit-slider-thumb {
      height: 36px;
      width: 16px;
      background: var(--primary-background);
      cursor: pointer;
      border-radius: 0;
      -webkit-appearance: none;
      box-shadow: 500px 0 0 500px var(--list-background);
    }

    &::-moz-range-track {
      width: 100%;
      height: 36px;
      cursor: pointer;
      animate: 0.2s;
      overflow: hidden;
      background: var(--list-background);
      border-radius: $border-radius;
    }

    &::-moz-range-thumb {
      height: 36px;
      width: 16px;
      border: none;
      border-radius: 0;
      background: var(--primary-background);
      cursor: pointer;
    }

    &::-moz-range-progress {
      height: 36px;
      width: 16px;
      border: none;
      border-radius: 0;
      background: var(--accent-color);
    }

    &::-ms-track {
      width: 100%;
      height: 36px;
      cursor: pointer;
      animate: 0.2s;
      overflow: hidden;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }

    &::-ms-fill-lower {
      background: var(--accent-color);
      border-radius: $border-radius;
    }

    &::-ms-fill-upper {
      background: var(--accent-color);
      border-radius: $border-radius;
    }

    &::-ms-thumb {
      height: 36px;
      width: 16px;
      border-radius: 0;
      background: var(--primary-background);
      box-shadow: 500px 0 0 500px var(--list-background);
      cursor: pointer;
    }
  }
</style>
