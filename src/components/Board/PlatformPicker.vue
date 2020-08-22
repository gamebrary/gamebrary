<template lang="html">
  <div class="platform-picker">
    <b-form-group label="Select platform(s)" class="mb-1" />

    <div class="platforms">
      <b-card
        v-for="platform in platforms" :key="platform.id"
        class="platform text-center"
        :border-variant="value.includes(platform.id) ? 'success' : ''"
        :style="`background-color: ${platform.bgHex || ''}`"
        @click="handleClick(platform.id)"
      >
        <b-img
          v-if="platform.logoFormat"
          :src="`/static/platform-logos/${platform.slug}${platform.logoFormat}`"
          :alt="platform.name"
          fluid
          class="platform-logo"
        />

        <b-img
          v-else
          :src="`/static/platform-logos/${platform.slug}.svg`"
          :alt="platform.name"
          fluid
          class="platform-logo"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
// import orderBy from 'lodash.orderBy';
import { mapState } from 'vuex';

export default {
  props: {
    value: Array,
  },

  computed: {
    ...mapState(['platforms']),

    // sortedPlatforms() {
    //   return orderBy(this.platforms, 'generation');
    // },
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
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  .platform {
    height: 120px;
    cursor: pointer;
    display: flex;
  }

  .platform-logo {
    max-height: 100px;
  }
</style>
