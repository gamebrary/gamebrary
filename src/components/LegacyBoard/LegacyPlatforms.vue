<template lang="html">
  <div class="platforms-page container-fluid">

  <h5>Platforms (Deprecated)</h5>

  <platforms-list
    :platforms="ownedPlatforms"
  />

  <platforms-footer class="mb-3" />
</div>
</template>
<script>
import platforms from '@/platforms';
import PlatformsFooter from '@/components/LegacyBoard/LegacyPlatformsFooter';
import PlatformsList from '@/components/LegacyBoard/LegacyPlatformsList';
import { mapState } from 'vuex';

export default {
  components: {
    PlatformsFooter,
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
