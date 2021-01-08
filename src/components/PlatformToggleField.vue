<template lang="html">
  <b-form-checkbox-group
    v-model="selectedPlatforms"
    :options="options"
    switches
    stacked
    @input="$emit('change', selectedPlatforms)"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedPlatforms: null,
    };
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['platformNames']),

    options() {
      return this.board.platforms.map((value) => {
        const text = `${this.platformNames[value].name}`;

        return { text, value };
      });
    },
  },

  mounted() {
    this.selectedPlatforms = JSON.parse(JSON.stringify(this.board.platforms));
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
