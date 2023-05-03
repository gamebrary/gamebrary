<template lang="html">
  <b-container class="px-3">
    <portal to="pageTitle">
      <h3>Boards</h3>
    </portal>

    <game-boards />
  </b-container>
</template>

<script>
import GameBoards from '@/components/GameBoards';

export default {
  components: {
    GameBoards,
  },
};
</script>
