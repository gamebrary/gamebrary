<template lang="html">
  <div class="platforms-page">
    <platforms-header />

    <platforms-list
      :platforms="sortedPlatforms"
    />

    <platforms-footer />
</div>
</template>

<script>
import platforms from '@/platforms';
import PlatformsFooter from '@/components/Platforms/PlatformsFooter';
import PlatformsHeader from '@/components/Platforms/PlatformsHeader';
import PlatformsList from '@/components/Platforms/PlatformsList';
import { sortBy } from 'lodash';
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
      searchText: '',
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

    platformsSortField() {
      return this.settings && this.settings.platformsSortField
        ? this.settings.platformsSortField
        : 'releaseYear';
    },

    filteredPlatforms() {
      return this.platformsFilterField
        ? this.platforms.filter(({ type }) => type === this.platformsFilterField)
        : this.platforms;
    },

    sortedPlatforms() {
      const sortedPlatforms = this.platformsSortField
        ? sortBy(this.filteredPlatforms, this.platformsSortField)
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
