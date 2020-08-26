<template lang="html">
  <div class="platforms-page container-fluid">

  <div class="container-fluid">
    <div class="row">
      <b-alert show variant="warning" class="col-xs-6">
        <strong>Deprecation warning!</strong>
        <p>Platform-based boards will be phased out soon.
          A migration tool will be provided shortly.</p>
        <p>More information will be provided soon.</p>

        <small>If you can't wait and want all your platform-based lists migrated
          to the new boards you can send me an email at contact@gamebrary.com</small>
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
