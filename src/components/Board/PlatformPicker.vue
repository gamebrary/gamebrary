<template lang="html">
  <div class="platform-picker">
    <!-- <div class="d-flex mb-2">
      <div class="filter mr-2">
        <small class="d-block text-muted">Show:</small>
        <b-button size="sm">All</b-button>
        <b-button size="sm">Consoles</b-button>
        <b-button size="sm">Handhelds</b-button>
        <b-button size="sm">PC</b-button>
      </div>

      <div class="sort">
        <small class="d-block text-muted">Sort by:</small>
        <b-button size="sm">All</b-button>
        <b-button size="sm">All</b-button>
        <b-button size="sm">All</b-button>
      </div>
    </div> -->

    <!-- <pre>{{ filteredPlatforms }}</pre> -->

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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import orderby from 'lodash.orderby';

export default {
  props: {
    value: Array,
  },

  data() {
    return {
      // sort: ,
      // filter: ,
    };
  },

  computed: {
    ...mapState(['platforms', 'settings']),
    ...mapGetters(['darkTheme']),

    buttonLabel() {
      return this.value.length
        ? this.$t('board.settings.platformLabel', { platformCount: this.value.length })
        : this.$t('board.settings.platformPlaceholder');
    },

    filteredPlatforms() {
      const sortedPlatforms = orderby(this.platforms, ['popular', 'generation']);

      return sortedPlatforms.reverse();
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
