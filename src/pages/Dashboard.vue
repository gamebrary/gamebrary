<template lang="html">
  <b-container class="pt-2" v-if="user">
    <boards />
    <page-footer />
  </b-container>
</template>

<script>
import PageFooter from '@/components/PageFooter';
import Boards from '@/components/Boards';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    PageFooter,
    Boards,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['nightMode']),
  },
};
</script>
