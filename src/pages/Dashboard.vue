<template lang="html">
  <div>
    <boards />
    <hr />
    <legacy-platforms />
  </div>
</template>

<script>
import LegacyPlatforms from '@/components/LegacyBoard/LegacyPlatforms';
import Boards from '@/components/Boards';

export default {
  components: {
    LegacyPlatforms,
    Boards,
  },
};
</script>
