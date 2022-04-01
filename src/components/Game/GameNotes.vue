<template lang="html">
  <div>
    <note
      :note="notes[this.game.id]"
    />

  </div>
</template>

<script>
import { mapState } from 'vuex';
import Note from '@/components/Note';
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    Note,
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
