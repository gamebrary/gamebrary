<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">Boards</portal>

      <game-boards />
    </b-container>
  </section>
</template>

<script>
import GameBoards from '@/components/GameBoards';

export default {
  components: {
    GameBoards,
  },
};
</script>
