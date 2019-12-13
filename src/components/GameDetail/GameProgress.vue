<template lang="html">
  <div :class="['game-progresses', { small }]">
    <div v-if="hasProgress && !showProgressField" class="progress">
      <div class="progress-data">
        <progress
          class="progress-bar"
          max="100"
          :value="localProgress.number"
        >
          <div class="progress-bar-fallback">
            <span :style="style">
              Progress: {{localProgress.number}}%
            </span>
          </div>
        </progress>
        <div
          v-if="localProgress.number"
          class="progress-bar-label"
        >
          {{localProgress.number}}%
        </div>
      </div>

      <button
        v-if="!small"
        class="primary"
        @click="editProgress"
      >
        Edit progress
      </button>
    </div>

    <div
      class="progress-field"
      v-if="showProgressField && !small"
    >
      <div class="progress-data">
        <div
          v-if="localProgress.number"
          class="progress-bar-label"
        >
          {{localProgress.number}}%
        </div>

        <input
          class="progress-range"
          v-model.number="localProgress.number"
          placeholder="50"
          type="range"
          min="0"
          max="100"
          step="5"
          autofocus
        >
      </div>

      <div class="progress-action">
        <div class="progress-edit">
          <button class="secondary" @click="reset">
            {{ $t('global.cancel') }}
          </button>

          <button class="primary" @click="saveProgress">
            {{ $t('global.save') }}
          </button>
        </div>

        <button class="danger" @click="deleteProgress">
          Delete progress
        </button>
      </div>
    </div>

    <button
      v-if="!hasProgress &&
            !showProgressField &&
            !small"
      class="primary"
      @click="addProgress"
    >
      <i class="fas fa-clock" />
      {{ $t('progresses.addProgress') }}
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showProgressField: false,
      localProgress: {
        number: null,
      },
    };
  },

  computed: {
    ...mapState(['game', 'progresses']),
    ...mapGetters(['gameProgress']),

    hasProgress() {
      return this.gameProgress && this.gameProgress.number;
    },

    style() {
      return `width: ${this.localProgress.number}%`;
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    reset() {
      this.localProgress = this.gameProgress
        ? JSON.parse(JSON.stringify(this.gameProgress))
        : { number: null };

      this.showProgressField = false;
    },

    addProgress() {
      this.showProgressField = true;
    },

    editProgress() {
      this.showProgressField = true;
    },

    deleteProgress() {
      const updatedProgresses = {
        ...this.progresses,
      };

      this.$delete(updatedProgresses, this.game.id);

      this.$bus.$emit('SAVE_PROGRESSES', updatedProgresses, true);
      this.showProgressField = false;
      this.localProgress = {
        number: null,
      };
    },

    saveProgress() {
      const updatedProgresses = {
        ...this.progresses,
      };

      updatedProgresses[this.game.id] = this.localProgress;

      this.$bus.$emit('SAVE_PROGRESSES', updatedProgresses);
      this.showProgressField = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-progresses {
    max-width: calc(100% - #{$gp});
    margin-top: $gp;
    margin-bottom: $gp;

    @media($small) {
      margin: $gp auto;
    }

    .progress-data {
      display: flex;
      align-items: center;
      margin-top: $gp;
      margin-bottom: $gp;

      @media($small) {
        flex-wrap: wrap;
        margin: $gp auto;
        justify-content: center;

        .progress-bar-label {
          order: 1;

          + .progress-range {
            margin-top: $gp / 3;
            order: 2;
          }
        }
      }
    }

    .progress-bar {
      -webkit-appearance: none;
      appearance: none;
      display: block;
      border-radius: $border-radius;
      background: var(--list-background);
      height: 20px;
      border-color: transparent;
      overflow: hidden;

      @media($small) {
        order: 2;
      }

      &::-moz-progress-bar {
        background: var(--accent-color);
      }

      &::-webkit-progress-bar {
        border-radius: $border-radius;
      }

      &::-webkit-progress-value {
        background-image: linear-gradient(var(--accent-color), var(--accent-color));
      }
    }

    .progress-bar-label {
      margin-left: $gp;
      font-size: 18px;
      font-weight: bold;
      color: var(--accent-color);
      order: 2;

      @media($small) {
        order: 1;
        margin-left: 0;
        margin-bottom: $gp / 3;
        flex-basis: 100%;
      }
    }

    .progress-range {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 36px;
      border: 0;
      border-radius: 0;
      padding: 0;
      margin-bottom: 0;
      background: transparent;
      overflow: hidden;
      order: 1;

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
        -webkit-appearance: none;
        box-shadow: 500px 0 0 500px var(--list-background);
      }

      &::-moz-range-track {
        width: 100%;
        height: 36px;
        cursor: pointer;
        animate: 0.2s;
        overflow: hidden;
        background: var(--accent-color);
        border-radius: $border-radius;
      }

      &::-moz-range-thumb {
        height: 36px;
        width: 16px;
        border: none;
        border-radius: 0;
        background: var(--primary-background);
        box-shadow: 500px 0 0 500px var(--list-background);
        cursor: pointer;
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

      @media($small) {
        margin-top: $gp * 2;
        margin-right: 0;
        margin-bottom: $gp;
      }
    }

    .progress-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: $gp;

      .secondary {
        margin-right: $gp;
      }

      @media($small) {
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 0;

        .danger {
          margin-top: $gp;
        }
      }

      .progress-edit {
        min-width: 300px;
        max-width: 355px;
        width: calc(100% - 75px - (#{$gp} * 8));
      }
    }

    &.small {
      max-width: 100%;
      margin-top: $gp / 4;
      margin-bottom: $gp / 4;

      .progress-data {
        margin-top: 0;
        margin-bottom: 0;
      }

      .progress-bar {
        height: 10px;
        width: 100%;
      }

      .progress-bar-label {
        display: none;
      }
    }
  }

</style>
