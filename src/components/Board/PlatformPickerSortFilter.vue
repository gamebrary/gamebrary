<template lang="html">
  <b-button-toolbar aria-label="Filter and sort platforms" class="mb-3">
    <strong class="py-2 pr-1">Filter:</strong>

    <b-button-group class="mx-1">
      <b-button
        v-for="filter in PLATFORM_FILTER_FIELDS"
        :key="filter"
        :variant="settings.platformsFilterField === filter ? 'primary' : null"
        size="sm"
        @click="setFilter(filter)"
      >
        {{ filter ? $t(`platforms.${filter}`) : $t('platforms.all') }}
      </b-button>
    </b-button-group>

    <strong class="py-2 pr-1 mx-1">Sort:</strong>
    <b-button-group>
      <b-button
        v-for="field in PLATFORM_SORT_FILEDS"
        :key="field"
        :variant="settings.platformsSortField === field ? 'primary' : null"
        v-b-tooltip.hover :title="$t(`platforms.${field}`)"
        size="sm"
        @click="setSortField(field)"
      >
        <b-icon-sort-alpha-down v-if="field === 'name'" />
        <b-icon-clock-history v-if="field === 'generation'" />
      </b-button>
    </b-button-group>
  </b-button-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import { PLATFORM_FILTER_FIELDS, PLATFORM_SORT_FILEDS } from '@/constants';


export default {
  data() {
    return {
      PLATFORM_FILTER_FIELDS,
      PLATFORM_SORT_FILEDS,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  methods: {
    saveSettings() {
      this.$store.dispatch('SAVE_SETTINGS', this.settings)
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
