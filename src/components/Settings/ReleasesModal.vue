<template lang="html">
  <b-dropdown-item v-b-modal:releases>
    <b-icon-mailbox class="mr-1" />
    Releases

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

export default {
  components: {
    Releases,
  },
};
</script>
