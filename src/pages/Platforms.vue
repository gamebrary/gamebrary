<template lang="html">
  <div class="platforms-page">
    <platforms-header />

    <component
      :is="platformsComponent"
      :platforms="sortedPlatforms"
    />

    <platforms-footer />
  </div>
</template>

<script>
import platforms from '@/platforms';
import PlatformsFooter from '@/components/Platforms/PlatformsFooter';
import PlatformsHeader from '@/components/Platforms/PlatformsHeader';
import PlatformsGrid from '@/components/Platforms/PlatformsGrid';
import PlatformsList from '@/components/Platforms/PlatformsList';
import { sortBy } from 'lodash';
import { mapState } from 'vuex';

export default {
  components: {
    PlatformsFooter,
    PlatformsHeader,
    PlatformsGrid,
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

    platformsComponent() {
      return this.listView === 'list'
        ? 'PlatformsList'
        : 'PlatformsGrid';
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

    ownedListsOnly() {
      return this.settings && this.settings.ownedListsOnly
        ? this.settings.ownedListsOnly
        : false;
    },

    filteredPlatforms() {
      const availableLists = this.ownedListsOnly
        ? this.platforms.filter(({ code }) => this.gameLists[code])
        : this.platforms;

      return this.platformsFilterField
        ? availableLists.filter(({ type }) => type === this.platformsFilterField)
        : availableLists;
    },

    sortedPlatforms() {
      const sortedPlatforms = this.platformsSortField
        ? sortBy(this.filteredPlatforms, this.platformsSortField)
        : this.filteredPlatforms;

      return this.platformsSortField === 'releaseYear'
        ? sortedPlatforms.reverse()
        : sortedPlatforms;
    },

    // filteredPlatforms() {
    //   const availableLists = this.ownedListsOnly
    //     ? this.platforms.filter(({ code }) => this.gameLists[code])
    //     : this.platforms;
    //
    // if (msnry) {
    //   msnry.reloadItems();
    //   msnry.layout();
    // }
    //
    //   return this.settings && this.settings.sortListsAlphabetically
    //     ? sortBy(availableLists, 'name')
    //     : availableLists;
    // },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .platforms-page {
    min-height: calc(100vh - #{$navHeight});
    padding: 0 $gp $gp / 2;
  }
</style>
