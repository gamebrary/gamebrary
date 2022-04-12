<template lang="html">
  <!-- TODO: get game cover, make getter for game cover url -->
  <game-note
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
import GameNote from '@/components/GameNote';

export default {
  components: {
    GameNote,
  },

  computed: {
    ...mapState(['notes', 'game']),

    isGamePage() {
      return this.$route.name === 'game';
    },

    note() {
      return this.notes[this.game.id] || null;
    },
  },
};
</script>
