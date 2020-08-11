<template lang="html">
  <header>
    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
      <b-dropdown class="mx-1" text="Filter">
        <b-dropdown-item
          v-for="filter in availableFilters"
          :key="filter"
          @click="setFilter(filter)"
        >
          <span v-if="filter">{{ $t(`platforms.${filter}`) }}</span>
          <span v-else>All</span>
        </b-dropdown-item>
      </b-dropdown>

      <b-dropdown class="mx-1" right text="Sort">
        <b-dropdown-item
          v-for="field in availableSortFields"
          :key="field"
          @click="setSortField(field)"
        >
          <span v-if="field">{{ $t(`platforms.${field}`) }}</span>
          <span v-else><i class="fas fa-times" /> Clear field</span>
        </b-dropdown-item>
      </b-dropdown>
    </b-button-toolbar>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
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
  },

  methods: {
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
