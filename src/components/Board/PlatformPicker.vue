<template lang="html">
  <div class="platform-picker">
    <b-form-group label="Select platform(s)" class="mb-1" />

    <platform-picker-sort-filter />

    <b-row>
      <b-col
        cols="6"
        md="4"
        lg="3"
        v-for="platform in filteredPlatforms"
        :key="platform.id"
        class="mb-3"
      >
        <b-card
          :header="platform.name"
          :header-class="['py-0 px-2', value.includes(platform.id) ? 'text-white' : '']"
          :border-variant="value.includes(platform.id) ? 'success' : ''"
          :header-bg-variant="value.includes(platform.id) ? 'success' : ''"
          body-class="p-2 text-center platform"
          header-tag="small"
          @click="handleClick(platform.id)"
        >
          <b-img
            :src="`/static/platform-logos/${platform.slug}.${platform.logoFormat}`"
            :alt="platform.name"
            class="platform-logo py-2"
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PlatformPickerSortFilter from '@/components/Board/PlatformPickerSortFilter';
import { mapGetters } from 'vuex';

export default {
  components: {
    PlatformPickerSortFilter,
  },

  props: {
    value: Array,
  },

  computed: {
    ...mapGetters(['filteredPlatforms']),
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
  .platform {
    height: 80px;
  }

  .platform-logo {
    max-height: 60px;
    width: auto;
    max-width: 100%;
  }
</style>
