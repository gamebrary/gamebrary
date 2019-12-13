<template lang="html">
  <div class="game-progresses">
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
        <div class="progress-bar-label">
          {{localProgress.number}}%
        </div>
      </div>

      <button class="primary" @click="editProgress">
        Edit progress
      </button>
    </div>

    <div
      class="progress-field"
      v-if="showProgressField"
    >
      <input
        v-model.number="localProgress.number"
        placeholder="50"
        type="number"
        autofocus
      >

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

    <button v-if="!hasProgress && !showProgressField" class="primary" @click="addProgress">
      <i class="fas fa-clock" />
      {{ $t('progresses.addProgress') }}
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
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

    @media($small) {
      order: 1;
      margin-left: 0;
      margin-bottom: $gp / 3;
      flex-basis: 100%;
    }
  }

  input {
    width: 100%;
    margin-bottom: 0;
    margin-right: $gp;
    padding: $gp / 2;

    @media($small) {
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
  }

  .progress-edit {
    min-width: 300px;
    max-width: 355px;
    width: calc(100% - 75px - (#{$gp} * 8));
  }

</style>
