<template lang="html">
  <b-container>
    <!-- TODO: show more stuff, public boards -->
    <template v-if="user">
      <page-title
        title="Boards"
        action-text="Create board"
        @action="$bvModal.show('create-board')"
      />

      <boards />
    </template>
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

  mounted() {
    if (this.user === null) {
      this.$router.push('auth');
    }
  },
};
</script>
