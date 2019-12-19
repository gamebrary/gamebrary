<template lang="html">
  <div :class="['game-progress', { small }]">
    <progress
      max="100"
      :value="progress"
    />

    <span
      class="progress-bar-label"
    >
      {{ progress }}%
    </span>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: String,
      default: '',
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-progress {
    display: grid;
    width: 140px;
    align-items: center;
    justify-items: center;

    progress,
    .progress-bar-label {
      grid-column: 1;
      grid-row: 1;
    }

    .progress-bar-label {
      margin-left: $gp / 2;
      font-size: $font-size;
      font-weight: bold;
    }

    &.small {
      width: auto;

      .progress-bar-label {
        font-size: $font-size-xsmall;
      }
    }
  }
</style>
