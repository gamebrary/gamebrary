<template lang="html">
  <header
    v-if="isVerticalNav"
    class="d-flex justify-content-between align-items-center mb-2"
    hasLongText
  >
    <h2 :class="{ 'text-wrap text-danger': hasLongText }">
      {{ title }}
    </h2>
    <slot />
  </header>

  <portal v-else to="pageTitle">
    <h3>{{ title }}</h3>
    <slot />
  </portal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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
