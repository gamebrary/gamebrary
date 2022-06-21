<template lang="html">
  <section class="d-flex align-items-end">
    <b-img
      v-for="{ rating, name } in gameAgeRatings"
      :src="`/img/age-ratings/${rating}.png`"
      :alt="rating"
      :key="name"
      rounded
      v-b-tooltip.hover
      :title="name"
      height="50"
      class="ml-2"
    />
  </section>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  computed: {
    gameAgeRatings() {
      return this.$store.getters.gameAgeRatings(this.game);
    },
  },
};
</script>
