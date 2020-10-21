<template lang="html">
  <div fluid v-if="user">
    <b-jumbotron
      header="Gamebrary"
      header-level="5"
      fluid
      :lead="$t('dashboard.subtitle')"
      :bg-variant="nightMode ? 'dark' : ''"
      :text-variant="nightMode ? 'white' : ''"
      :border-variant="nightMode ? 'dark' : ''"
    />
    <b-container>
      <boards />
      <page-footer />
    </b-container>
  </div>
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
