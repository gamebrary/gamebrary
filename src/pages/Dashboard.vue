<template lang="html">
  <div>
    <boards />

    <template v-if="Object.keys(gameLists).length">
      <hr />
      <legacy-platforms />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LegacyPlatforms from '@/components/LegacyBoard/LegacyPlatforms';
import Boards from '@/components/Boards';

export default {
  components: {
    LegacyPlatforms,
    Boards,
  },

  computed: {
    ...mapState(['gameLists']),
  },
};
</script>
