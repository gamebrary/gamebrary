<template lang="html">
  <b-button
    :to="{ name: buttonRoute, params: { id: board.id } }"
  >
    {{ board.name }}
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['board', 'wallpapers', 'boards', 'settings']),

    buttonRoute() {
      return this.$route.name === 'board.edit' ? 'board' : 'board.edit';
    },
  },
};
</script>
