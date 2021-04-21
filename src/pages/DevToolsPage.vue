<template lang="html">
  <b-container>
    <page-title
      title="Dev tools"
    />

    <dev-tools />
  </b-container>
</template>

<script>
import DevTools from '@/components/DevTools';

export default {
  components: {
    DevTools,
  },
};
</script>
