<!-- TODO: Mix media from other sources (e.g. instagram, wikipedia, youtube, twitter, etc... ) -->
<template lang="html">
  <div>
    gameImages
    <pre>{{ gameImages }}</pre>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['gameImages']),
    // ...mapState(['board']),
  },
};
</script>
