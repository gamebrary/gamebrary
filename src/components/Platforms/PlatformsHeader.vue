<template lang="html">
  <header>
    <b-button variant="primary" @click="toggleView">
      <b-icon-grid />
      <b-icon-list />
    </b-button>

    <modal
      ref="listAddModal"
      title="Filter and sort platforms"
    >
      <b-button>
        <i class="fas fa-filter" />
        <span class="indicator" v-if="ownedListsOnly" />
      </b-button>

      <div slot="content">
        <section>
          <h3>Show</h3>

          <b-button
            :class="{ secondary: !ownedListsOnly }"
            @click="setOwned(false)"
          >
            All
          </b-button>

          <b-button
            :class="{ secondary: ownedListsOnly }"
            @click="setOwned(true)"
          >
            Mine
          </b-button>
        </section>

        <section>
          <h5>Filter by</h5>

          <b-button
            v-for="filter in availableFilters"
            :key="filter"
            @click="setFilter(filter)"
          >
            <span v-if="filter">{{ $t(`platforms.${filter}`) }}</span>
            <span v-else>All</span>
          </b-button>
        </section>

        <section>
          <h3>Sort by</h3>

          <b-button
            v-for="field in availableSortFields"
            :key="field"
            @click="setSortField(field)"
          >
            <span v-if="field">{{ $t(`platforms.${field}`) }}</span>
            <span v-else><i class="fas fa-times" /> Clear field</span>
          </b-button>
        </section>
      </div>
    </modal>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      availableFilters: [
        null,
        'home',
        'handheld',
        'computer',
      ],
      availableSortFields: [
        'releaseYear',
        'name',
        'type',
      ],
    };
  },

  computed: {
    ...mapState(['settings']),

    viewIcon() {
      return this.listView === 'list'
        ? 'fas fa-th-large'
        : 'fas fa-list';
    },

    filterField() {
      return this.settings && this.settings.platformsFilterField
        ? this.settings.platformsFilterField
        : null;
    },

    sortField() {
      return this.settings && this.settings.platformsSortField
        ? this.settings.platformsSortField
        : 'releaseYear';
    },

    listView() {
      return this.settings && this.settings.platformsView
        ? this.settings.platformsView
        : 'grid';
    },

    ownedListsOnly() {
      return this.settings && this.settings.ownedListsOnly
        ? this.settings.ownedListsOnly
        : false;
    },
  },

  methods: {
    clearFilter() {

    },

    saveSettings() {
      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'Settings saved' });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
        });
    },

    setFilter(value) {
      this.$store.commit('UPDATE_SETTING', { key: 'platformsFilterField', value });
      this.saveSettings();
    },

    setSortField(value) {
      this.$store.commit('UPDATE_SETTING', { key: 'platformsSortField', value });
      this.saveSettings();
    },

    toggleView() {
      const value = this.listView === 'grid'
        ? 'list'
        : 'grid';

      this.$store.commit('UPDATE_SETTING', { key: 'platformsView', value });

      this.saveSettings();
    },

    setOwned(value) {
      this.$store.commit('UPDATE_SETTING', { key: 'ownedListsOnly', value });

      this.saveSettings();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// @import "~styles/styles";

header {
  // display: inline-grid;
  // align-items: center;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  grid-gap: 1rem;
}

.filter-active {
  color: var(--success-background);
}

section {
  padding-top: 1rem;
}

h3 {
  margin-bottom: .5rem;
}
</style>
