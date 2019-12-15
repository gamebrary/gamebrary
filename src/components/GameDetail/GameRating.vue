<template lang="html">
  <div :class="['game-rating', { small }]">
    <span v-for="n in 5" :key="`star-${n}`">
      <i :class="ratingClass(n)" />
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

  methods: {
    ratingClass(n) {
      const starCount = (this.roundedRating - n) + 1;

      if (starCount >= 1) return 'fas fa-star';
      if (starCount === 0.5) return 'fas fa-star-half-alt';
      return 'far fa-star';
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
