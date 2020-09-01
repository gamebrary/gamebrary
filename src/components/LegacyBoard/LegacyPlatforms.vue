<template lang="html">
  <div>
    <h5 class="mb-4">
      Platforms
      <b-badge variant="warning">Deprecated</b-badge>
    </h5>

    <platforms-list :platforms="ownedPlatforms" />
</div>
</template>
<script>
import platforms from '@/platforms';
import PlatformsList from '@/components/LegacyBoard/LegacyPlatformsList';
import { mapState } from 'vuex';

export default {
  components: {
    PlatformsList,
  },

  data() {
    return {
      platforms,
    };
  },

  computed: {
    ...mapState(['gameLists', 'settings']),

    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    ownedPlatforms() {
      return this.platforms.filter(({ code }) => this.gameLists[code]);
    },
  },
};
</script>
