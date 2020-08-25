<template lang="html">
  <div class="mb-3">
    <b-dropdown
      :text="$t(`platforms.${settings.platformsFilterField || 'all'}`)"
      class="mr-2"
    >
      <b-dropdown-item
        v-for="filter in PLATFORM_FILTER_FIELDS"
        :key="filter"
        :variant="settings.platformsFilterField === filter ? 'primary' : null"
        @click="setFilter(filter)"
      >
        {{ filter ? $t(`platforms.${filter}`) : $t('platforms.all') }}
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      :text="$t(`platforms.${settings.platformsSortField || 'generation'}`)"
    >
      <b-dropdown-item
        v-for="field in PLATFORM_SORT_FILEDS"
        :key="field"
        :variant="settings.platformsSortField === field ? 'primary' : null"
        @click="setSortField(field)"
      >
        {{ $t(`platforms.${field}`) }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
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
