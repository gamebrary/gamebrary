<!-- TODO: relayout on change, watcher? -->
<template lang="html">
  <div>
    <!-- <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
      <b-button-group class="mx-1">
        <b-button>New</b-button>
        <b-button>Edit</b-button>
        <b-button>Undo</b-button>
      </b-button-group>
      <b-dropdown class="mx-1" right text="menu">
        <b-dropdown-item>Item 1</b-dropdown-item>
        <b-dropdown-item>Item 2</b-dropdown-item>
        <b-dropdown-item>Item 3</b-dropdown-item>
      </b-dropdown>
      <b-button-group class="mx-1">
        <b-button>Save</b-button>
        <b-button>Cancel</b-button>
      </b-button-group>
    </b-button-toolbar> -->

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

    <div class="platform-picker">
      <b-button
        v-for="platform in filteredPlatforms"
        class="platform"
        :variant="value.includes(platform.id) ? 'primary' : 'dark'"
        :key="platform.id"
        @click="handleClick(platform.id)"
      >
        <!-- <pre>{{ platform }}</pre> -->
        <b-img
          :src="`/static/logos/platforms/${platform.slug}.${platform.logoFormat}`"
          :alt="platform.name"
          class="platform-logo pr-2"
        />

        <small :class="value.includes(platform.id) ? '' : 'text-muted'">
          {{ platform.name }}
        </small>
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Packery from 'packery';
import orderby from 'lodash.orderby';

export default {
  props: {
    value: Array,
  },

  data() {
    return {
      packery: null,
      // sort: ,
      // filter: ,
    };
  },

  computed: {
    ...mapState(['platforms', 'settings']),

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

  async mounted() {
    this.packery = new Packery('.platform-picker', { itemSelector: '.platform', gutter: 8 });

    await this.$nextTick();
    await this.$nextTick();

    this.packery.layout();
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
}

.platform {
  width: 130px;
}

.platform-logo {
  height: auto;
  max-height: 80px;
  width: 100%;
}
</style>
