<template lang="html">
  <b-modal
    id="devTools"
    centered
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header title="Dev tools" @close="close" />
    </template>

    <!-- TODO: add page version as well -->
    <dev-tools />

  </b-modal>
</template>

<script>
import DevTools from '@/components/DevTools';

export default {
  components: {
    DevTools,
  },
};
</script>
