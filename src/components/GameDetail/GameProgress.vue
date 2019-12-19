<template lang="html">
  <div class="game-progress">
    <progress
        :class="[{ small }]"
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
    display: flex;
    align-items: center;
    }

  .progress-bar-label {
    margin-left: $gp / 2;
    font-size: $font-size;
    font-weight: bold;
  }
</style>
