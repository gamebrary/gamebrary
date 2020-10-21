<template lang="html">
  <div class="platform-picker">
    <b-dropdown
      :text="dropdownLabel"
      menu-class="platforms-dropdown"
      boundary="viewport"
    >
      <b-dropdown-item
        v-for="platform in filteredPlatforms"
        :key="platform.id"
        :active="value.includes(platform.id)"
        @click="handleClick(platform.id)"
      >
        <b-img
          :src="`/static/platform-logos/${platform.slug}.${platform.logoFormat}`"
          :alt="platform.name"
          width="40"
          class="pr-2"
        />

        {{ platform.name }}
      </b-dropdown-item>
    </b-dropdown>

    <b-alert :show="value.length > 1" class="mt-3 mb-0">
      Game search will be limited to the platforms selected.
    </b-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: Array,
  },

  computed: {
    ...mapGetters(['filteredPlatforms']),

    dropdownLabel() {
      return this.value.length
        ? this.$t('board.settings.platformLabel', { platformCount: this.value.length })
        : this.$t('board.settings.platformPlaceholder');
    },
  },

  methods: {
    handleClick(platformId) {
      if (this.value.includes(platformId)) {
        this.removePlatform(platformId);
      } else {
        this.selectPlatform(platformId);
      }
    },

    selectPlatform(platformId) {
      this.value.push(platformId);
    },

    removePlatform(platformId) {
      const index = this.value.indexOf(platformId);

      this.value.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
  .platforms-dropdown {
    overflow: auto;
    max-height: 300px;
  }
</style>
