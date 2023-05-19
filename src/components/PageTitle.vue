<template lang="html">
  <header v-if="isVerticalNav">
    <h2 class="my-3">{{ title }}</h2>
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
