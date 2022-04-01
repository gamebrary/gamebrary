<template lang="html">
  <div class="py-2">
    <small>Available for:</small>

    <p>{{ platforms }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['game']),

    platforms() {
      return this.game.platforms.map(platform => platform.name).join(', ');
    },
  },
};
</script>
