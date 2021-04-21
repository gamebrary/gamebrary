<template lang="html">
  <b-container v-if="user">
    <!-- TODO: show more stuff, public boards -->
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />

    <boards />
    <!-- public boards -->
    <!-- news feeds -->
    <!-- deals -->
    <!-- newsletter signup -->
  </b-container>
</template>

<script>
import Boards from '@/components/Boards';
import { mapState } from 'vuex';

export default {
  components: {
    Boards,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
