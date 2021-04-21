<template lang="html">
  <b-container v-if="user">
    <page-title
      title="Boards"
      action-text="Create board"
      @action="$bvModal.show('create-board')"
    />

    <boards />
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
