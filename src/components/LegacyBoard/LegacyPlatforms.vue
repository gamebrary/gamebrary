<template lang="html">
  <div class="platforms-page container-fluid">

  <div class="container-fluid">
    <div class="row">
      <b-alert show variant="warning" class="col-xs-6">
        <strong>Deprecation warning!</strong>
        <p>Platform-based boards will be phased out soon.
          A migration tool will be provided shortly.</p>
        <p>More information will be provided soon.</p>
      </b-alert>
    </div>
  </div>

  <h5>Platforms (Deprecated)</h5>

  <platforms-header />

  <platforms-list
    :platforms="sortedPlatforms"
  />

  <platforms-footer />
</div>
</template>
<script>
import platforms from '@/platforms';
import PlatformsFooter from '@/components/LegacyBoard/LegacyPlatformsFooter';
import PlatformsHeader from '@/components/LegacyBoard/LegacyPlatformsHeader';
import PlatformsList from '@/components/LegacyBoard/LegacyPlatformsList';
import sortby from 'lodash.sortby';
import { mapState } from 'vuex';

export default {
  components: {
    PlatformsFooter,
    PlatformsHeader,
    PlatformsList,
  },

  data() {
    return {
      platforms,
    };
  },

  computed: {
    ...mapState(['gameLists', 'settings']),

    // TODO: move to getter and replace other instances
    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },

    listView() {
      return this.settings && this.settings.platformsView
        ? this.settings.platformsView
        : 'grid';
    },

    platformsFilterField() {
      return this.settings && this.settings.platformsFilterField
        ? this.settings.platformsFilterField
        : null;
    },

    ownedPlatforms() {
      return this.platforms.filter(({ code }) => this.gameLists[code]);
    },

    platformsSortField() {
      return this.settings && this.settings.platformsSortField
        ? this.settings.platformsSortField
        : 'releaseYear';
    },

    filteredPlatforms() {
      return this.platformsFilterField
        ? this.ownedPlatforms.filter(({ type }) => type === this.platformsFilterField)
        : this.ownedPlatforms;
    },

    sortedPlatforms() {
      const sortedPlatforms = this.platformsSortField
        ? sortby(this.filteredPlatforms, this.platformsSortField)
        : this.filteredPlatforms;

      return this.platformsSortField === 'releaseYear'
        ? sortedPlatforms.reverse()
        : sortedPlatforms;
    },
  },
};
</script>
