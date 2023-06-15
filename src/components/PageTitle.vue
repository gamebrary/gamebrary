<template lang="html">
  <header
    v-if="isVerticalNav"
    :class="['d-flex justify-content-between align-items-center mb-3']"
  >
    <h2>{{ title }}</h2>
    <slot />
  </header>

  <portal v-else to="pageTitle">
    <h3>{{ title }}</h3>
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
  },
};
</script>
