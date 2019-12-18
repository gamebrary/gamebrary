<template lang="html">
  <!-- TODO: simplify, use computed props -->
  <span
    v-if="custom && sortOrder != 'sortByName'"
    class="sort-icon"
  >
    <i class="fas fa-long-arrow-alt-down arrow" />
    <i
      v-if="sortOrder === 'sortByRating'"
      class="fas fa-star sort-type"
    />
    <i
      v-if="sortOrder === 'sortByRating'"
      class="far fa-star sort-type bottom-icon"
    />
    <i
      v-if="sortOrder === 'sortByProgress'"
      class="fas fa-clock sort-type single-icon"
    />
    <i
      v-if="sortOrder === 'sortByReleaseDate'"
      class="fas fa-calendar sort-type single-icon"
    />
  </span>
  <i
    v-else-if="custom"
    class="fas fa-sort-alpha-down"
  />
  <i
    v-else
    class="fas fa-sort-amount-down"
  />
</template>

<script>
export default {
  props: {
    sortOrder: {
      type: String,
      default: '',
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .sort-icon {
    display: inline-grid;
    grid-gap: 1px;
    grid-template: 1fr 1fr / 1fr 1fr;
    align-items: center;
    justify-items: center;

    .arrow,
    .single-icon {
      grid-row: span 2;
    }

    .sort-type {
      font-size: $font-size / 2;
    }

    .single-icon {
      align-self: start;
    }

    .bottom-icon {
      grid-column: 2;
      grid-row: 2;
    }
  }
</style>
