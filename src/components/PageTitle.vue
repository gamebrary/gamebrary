<template lang="html">
  <header
    class="d-flex justify-content-between align-items-center mb-2"
    hasLongText
  >
    <h2 :class="{ 'text-wrap text-danger': hasLongText }">
      {{ title }}
    </h2>
    <slot />
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: String,
  },

  computed: {
    ...mapGetters(['isVerticalNav']),

    hasLongText() {
      return this.title.length > 30;
    },
  },
};
</script>
