<template lang="html">
  <b-alert
    v-if="notes[game.id]"
    variant="warning"
    show
    v-b-modal.notes
    class="mt-3"
  >
    <vue-markdown :source="notes[game.id]" />
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
  },
};
</script>
