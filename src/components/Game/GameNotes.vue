<template lang="html">
  <b-alert
    v-if="notes[game.id]"
    variant="warning"
    show
    v-b-modal.notes
    class="mt-2 mt-md-0"
  >
    <strong>Notes:</strong>
    <vue-markdown :source="gameNotes" />
  </b-alert>
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

    gameNotes() {
      return typeof this.notes[this.game.id] === 'object' && this.notes[this.game.id].text
        ? this.notes[this.game.id].text
        : this.notes[this.game.id];
    },
  },
};
</script>
