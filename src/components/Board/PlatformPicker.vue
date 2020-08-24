<template lang="html">
  <div class="platform-picker">
    <b-form-group label="Select platform(s)" class="mb-1" />

    <div class="platforms">
      <b-card
        v-for="platform in sortedPlatforms" :key="platform.id"
        :header="platform.name"
        :header-class="['py-0 px-2', value.includes(platform.id) ? 'text-white' : '']"
        :border-variant="value.includes(platform.id) ? 'success' : ''"
        :header-bg-variant="value.includes(platform.id) ? 'success' : ''"
        body-class="d-flex p-2 text-center justify-content-center align-items-center"
        header-tag="small"
        @click="handleClick(platform.id)"
      >
        <b-img
          :src="`/static/platform-logos/${platform.slug}.${platform.logoFormat
            ? platform.logoFormat : 'svg'}`"
          :alt="platform.name"
          fluid
          class="platform-logo py-2"
        />
        <!-- {{ platform.id }} -->
      </b-card>
    </div>
  </div>
</template>

<script>
import orderby from 'lodash.orderby';
import { mapState } from 'vuex';

export default {
  props: {
    value: Array,
  },

  computed: {
    ...mapState(['platforms']),

    sortedPlatforms() {
      return orderby(this.platforms, 'generation')
        .filter(({ generation }) => Boolean(generation))
        .reverse();
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
  .platforms {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: .5rem;
  }

  .platform-logo {
    max-height: 80px;
  }
</style>
