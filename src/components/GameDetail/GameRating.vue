<template lang="html">
  <div :class="['game-rating', { small }]">
    <span v-for="n in 5" :key="`star-${n}`">
      <i v-if="(roundedRating - n) + 1 >= 1" class="fas fa-star" />
      <i v-if="(roundedRating - n) + 1 === .5" class="fas fa-star-half" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 5,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    roundedRating() {
      return Math.round((this.rating / 20) * 2) / 2;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.game-rating {
  color: var(--rating-star-color);
  font-size: 20px;
  margin: $gp / 4 0;

  &.small {
    font-size: 12px;
  }
}
</style>
