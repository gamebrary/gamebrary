<template lang="html">
  <div class="platforms-page">
    <header>
        <button @click="toggleView" class="primary small">
          <i :class="viewIcon" />
        </button>

        <!-- <button class="primary small">
          <i class="fas fa-square" />
        </button> -->

        <!-- <modal
          ref="listAddModal"
          title="Filter and sort platforms"
        >
          <button class="primary small">
            <i class="fas fa-filter" />
          </button>

          <div slot="content">
            <section>
              Filter:

              <button class="primary small">
                Mine only
              </button>
              <button class="primary small">
                All
              </button>

              <button class="primary small">
                Home consoles
              </button>

              <button class="primary small">
                Home Computers
              </button>

              <button class="primary small">
                Handhelds
              </button>
            </section>

            <section>
              Sort by:

              <button class="primary small">
                Year released
              </button>

              <button class="primary small">
                All
              </button>
            </section>
          </div>
        </modal> -->
    </header>

    <component
      :is="platformsComponent"
      :platforms="filteredPlatforms"
    />

    <page-footer />
  </div>
</template>

<script>
import platforms from '@/platforms';
import PageFooter from '@/components/Platforms/PageFooter';
import PlatformsGrid from '@/components/Platforms/PlatformsGrid';
import PlatformsList from '@/components/Platforms/PlatformsList';
import Modal from '@/components/Modal';
// import { sortBy } from 'lodash';
import { mapState } from 'vuex';

export default {
  components: {
    PageFooter,
    PlatformsGrid,
    PlatformsList,
    Modal,
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

    viewIcon() {
      return this.listView === 'list'
        ? 'fas fa-th-large'
        : 'fas fa-list';
    },

    platformsComponent() {
      return this.listView === 'list'
        ? 'PlatformsList'
        : 'PlatformsGrid';
    },

    filteredPlatforms() {
      return this.platforms;

      // return this.platforms.filter(({ releaseYear }) => !releaseYear);
      // return this.platforms.filter(({ name }) => {
      //   const platformName = name.toLowerCase();
      //   const searchText = this.searchText.toLowerCase();
      //
      //   return platformName.includes(searchText);
      // });
    },

    listView() {
      return this.settings && this.settings.platformsView
        ? this.settings.platformsView
        : 'grid';
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

  methods: {
    toggleView() {
      const value = this.listView === 'grid'
        ? 'list'
        : 'grid';

      this.$store.commit('UPDATE_SETTING', { key: 'platformsView', value });

      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'Settings saved' });
          this.loading = false;
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .platforms-page {
    min-height: calc(100vh - #{$navHeight});
    padding: 0 $gp $gp / 2;
  }

  header {
    // display: inline-grid;
    // align-items: center;
    display: flex;
    align-items: center;
    margin-bottom: $gp;
    grid-gap: $gp;

    button {
      margin-right: $gp / 2;
    }
  }
</style>
