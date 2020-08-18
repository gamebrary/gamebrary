<template lang="html">
  <header>
    <b-button-toolbar aria-label="Filter and sort platforms">
      <strong class="py-2 pr-1">Filter:</strong>
      <b-button-group class="mx-1">
        <b-button
          v-for="filter in filters"
          :key="filter"
          :variant="filterField === filter ? 'primary' : null"
          size="sm"
          @click="setFilter(filter)"
        >
          {{ filter ? $t(`platforms.${filter}`) : $t('platforms.all') }}
        </b-button>
      </b-button-group>

      <strong class="py-2 pr-1 mx-1">Sort:</strong>
      <b-button-group>
        <b-button
          v-for="field in availableSortFields"
          :key="field"
          :variant="sortField === field ? 'primary' : null"
          size="sm"
          @click="setSortField(field)"
        >
          {{ $t(`platforms.${field}`) }}
        </b-button>
      </b-button-group>
    </b-button-toolbar>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      filters: [
        null,
        'consoles',
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
  },

  methods: {
    saveSettings() {
      this.$store.dispatch('SAVE_SETTINGS', this.settings)
        .then(() => {
          this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
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
