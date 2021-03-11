<template lang="html">
  <b-container v-if="user">
    <boards />
  </b-container>
</template>

<script>
import Boards from '@/components/Boards';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    Boards,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme']),
  },
};
</script>
