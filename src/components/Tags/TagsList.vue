<template lang="html">
  <b-row>
    <b-col
      v-for="({ hex, tagTextColor, name }, index) in tags"
      @click="$router.push({ name: 'tag.edit', params: { id: index } })"
      cols="6"
      xl="4"
      class="mb-3"
      :key="name"
    >
      <b-button
        rounded
        block
        variant="outline-light"
        :style="`background-color: ${hex}; color: ${tagTextColor}`"
      >
        {{ name }}
      </b-button>
    </b-col>
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

  methods: {
    openGame(gameId) {
      const { id, slug } = this.games[gameId];

      this.$router.push({ name: 'game.tags', params: { id, slug } })
    },
  },
};
</script>
