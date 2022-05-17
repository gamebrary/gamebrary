<template lang="html">
  <div>
    <!-- TODO: get game cover, make getter for game cover url -->
    <game-note
      v-if="note"
      :note="note"
      class="cursor-pointer"
      @click.native="$router.push({ name: 'game.notes', params: { id: game.id } })"
    />
  </div>
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
