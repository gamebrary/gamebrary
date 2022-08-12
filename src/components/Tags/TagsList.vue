<template lang="html">
  <b-row class="p-3">
    <b-button
      v-for="({ textColor, bgColor, name }, index) in tags"
      @click="$router.push({ name: 'tag.edit', params: { id: index } })"
      rounded
      block
      variant="outline-light"
      :style="`background-color: ${bgColor}; color: ${textColor}`"
      :key="name"
    >
      {{ name }}
    </b-button>
  </b-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
    }
  },

  computed: {
    ...mapState(['tags']),
  },

  async mounted() {
    this.loading = true;

    await this.$store.dispatch('LOAD_TAGS').catch(() => {
      this.loading = false;
    });

    this.loading = false;
  },
};
</script>
