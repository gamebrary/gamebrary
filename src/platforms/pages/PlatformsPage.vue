<template lang="html">
  <div>
    <b-button
      variant="link"
      block
      v-for="platform in platforms"
      :to="{ name: 'platform', params: { id: platform.id } }"
      :key="platform.id"
    >
      {{ platform.name }}
    </b-button>
  </div>
</template>

<script>
import orderby from 'lodash.orderby';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      platforms: null,
    }
  },

  mounted() {
    this.loadPlatforms();
  },

  methods: {
    async loadPlatforms() {
      const platforms = await this.$store.dispatch('LOAD_IGDB_PLATFORMS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading platforms', { variant: 'error' });
        });

      this.platforms = orderby(platforms, 'name');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
img {
  filter: drop-shadow(-1px 0 0 black)
          drop-shadow(0 -1px 0 black)
          drop-shadow(0 1px 0 black)
          drop-shadow(1px 0 0 black);
  width: 200px;
}
</style>
