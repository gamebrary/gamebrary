<template lang="html">
  <b-dropdown-item v-b-modal:releases>
    <b-icon-mailbox class="mr-1" />
    Releases <b-badge variant="success" v-if="notification">New release!</b-badge>

    <b-modal
      id="releases"
      title="Releases"
      modal-class="releases"
      scrollable
      hide-footer
      size="lg"
    >
      <releases />
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import Releases from '@/components/Settings/Releases';
import { mapState } from 'vuex';

export default {
  components: {
    Releases,
  },

  computed: {
    ...mapState(['notification']),
  },
};
</script>
