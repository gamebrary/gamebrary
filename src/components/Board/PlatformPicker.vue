<!-- TODO: return filteredPlatforms getter and return sort/filters -->
<template lang="html">
  <b-list-group class="platforms mb-3">
    <b-list-group-item
      v-for="platform in filteredPlatforms"
      :key="platform.id"
      :variant="value.includes(platform.id) ? 'success' : ''"
      button
      @click="handleClick(platform.id)"
    >
      <b-img
        :src="`/static/platform-logos/${platform.slug}.${platform.logoFormat}`"
        :alt="platform.name"
        width="60"
        thumbnail
        class="pr-2"
      />

      {{ platform.name }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    value: Array,
  },

  computed: {
    ...mapState(['platforms', 'settings']),
    ...mapGetters(['filteredPlatforms', 'nightMode']),

    buttonLabel() {
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
