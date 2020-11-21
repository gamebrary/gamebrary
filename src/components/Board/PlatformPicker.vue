<!-- TODO: return filteredPlatforms getter and return sort/filters -->
<template lang="html">
  <div class="platform-picker">
    <b-button
      v-b-modal.platforms
      :variant="value.length ? 'success' : 'warning'"
    >
      {{ buttonLabel }}
    </b-button>

    <b-modal
      id="platforms"
      scrollable
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Board Platforms"
          subtitle="Game search will be limited to the platforms selected."
          @close="close"
        />
      </template>

      <b-list-group>
        <b-list-group-item
          v-for="platform in platforms"
          :key="platform.id"
          button
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
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    value: Array,
  },

  computed: {
    ...mapState(['platforms']),

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

<style lang="scss" rel="stylesheet/scss" scoped>
  .dropdown {
    max-height: 50vh;
  }
</style>
