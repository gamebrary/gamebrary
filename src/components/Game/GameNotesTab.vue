<template lang="html">
  <b-tab>
    <template v-slot:title>
      Notes <b-badge v-if="notes[game.id]">1</b-badge>
    </template>

    <template v-if="notes[game.id]">
      <vue-markdown :source="notes[game.id]" />

      <b-button v-b-modal.notes variant="warning">
        Edit note
      </b-button>
    </template>

    <b-button v-else v-b-modal.notes>
      Add note
    </b-button>
  </b-tab>
</template>

<script>
import { mapState } from 'vuex';
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },

  props: {
    game: Object,
  },

  computed: {
    ...mapState(['notes']),
  },
};
</script>
