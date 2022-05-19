<template lang="html">
  <div>
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

    note() {
      return this.notes[this.game.id] || null;
    },
  },
};
</script>
