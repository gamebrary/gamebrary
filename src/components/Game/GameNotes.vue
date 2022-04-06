<template lang="html">
  <!-- TODO: get game cover, make getter for game cover url -->
  <note
    v-if="note"
    :note="note"
  />

  <portal to="headerActions" v-else-if="isGamePage">
    <b-button
      variant="warning"
      name='game-notes'
      :to="{ name: 'game-notes', params: { gameId: game.id, gameSlug: game.slug } }"
    >
      Add note
    </b-button>
  </portal>
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

  computed: {
    ...mapState(['notes', 'game']),

    isGamePage() {
      return this.$route.name === 'game'
    },

    note() {
      return this.notes[this.game.id] || null;
    },
  },
};
</script>
