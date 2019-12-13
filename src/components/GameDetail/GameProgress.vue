<template lang="html">
  <div class="game-progresses">
    <div v-if="hasProgress && !showProgressField" class="progress">
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

      <button class="primary" @click="editProgress">
        Edit progress
      </button>
    </div>

    <div
      class="progress-field"
      v-if="showProgressField"
    >
      <input
        v-model.trim="localProgress.number"
        placeholder="50"
        type="number"
        autofocus
        required
      >

      <div class="progress-action">
        <button class="secondary" @click="reset">
          {{ $t('global.cancel') }}
        </button>

        <button class="primary" @click="saveProgress">
          {{ $t('global.save') }}
        </button>

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
  }

  .progress-bar {
    -webkit-appearance: none;
    appearance: none;
    border-radius: $border-radius;
    background: var(--list-background);
    height: 20px;
    border-color: transparent;
    overflow: hidden;

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

  input {
    width: 75px;
    margin-bottom: 0;
    margin-right: $gp;
    padding: $gp / 2;

    @media($small) {
      width: 75%;
      margin-right: 0;
      margin-bottom: $gp;
    }
  }

  .progress-field {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media($small) {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .progress-action {
    min-width: 300px;
    max-width: 355px;
    width: calc(100% - 75px - (#{$gp} * 8));
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
