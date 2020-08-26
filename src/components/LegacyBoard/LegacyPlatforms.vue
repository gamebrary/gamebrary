<template lang="html">
  <div class="platforms-page container-fluid">

  <div class="container-fluid">
    <div class="row">
      <b-alert show variant="warning" class="col-xs-6">
        <strong>Deprecation warning!</strong>
        <p>Platform-based boards will be phased out soon</p>
        <p>If you have any questions or need help feel free to email
          <strong>contact@gamebrary.com</strong> and/or open defects in
          <a href="https://github.com/romancm/gamebrary/issues" target="_blank">GitHub</a></p>
        <p>You can convert your platforms to boards by clicking on a platform</p>
      </b-alert>
    </div>
  </div>

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
