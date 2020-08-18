<template lang="html">
  <div class="platforms-page">
    <b-alert show variant="warning">
      <h4 class="alert-heading">Deprecation warning</h4>
      <p>

      </p>
      <hr>
      <b-button variant="primary">
        Go to boards
      </b-button>
    </b-alert>

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
    ...mapState(['gameLists', 'platform', 'settings']),

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

<style lang="scss" rel="stylesheet/scss" scoped>
  .platforms-page {
    min-height: calc(100vh - 48px);
    padding: 0 1rem .5rem;
  }

  .card-columns {
    column-count: 5;
  }
</style>
