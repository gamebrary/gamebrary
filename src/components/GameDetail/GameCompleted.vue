<template lang="html">
  <div
    v-if="progress == 100"
    :class="['game-completed', size]"
  >
    <i class="fas fa-check-circle" />
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-completed {
    position: absolute;
    font-size: 20px;
    padding: $gp / 4;
    width: 50px;
    height: 50px;
    line-height: 1;
    color: var(--game-card-text-color);
    background-color: var(--accent-color);
    clip-path: polygon(0 0, 0 100%, 100% 0);

    &.small {
      font-size: 14px;
      padding: $gp / 4;
      width: 40px;
      height: 40px;
    }

    &.tiny {
      font-size: 10px;
      padding: $gp / 6;
      width: 30px;
      height: 30px;
    }
  }
</style>
