<template lang="html">
  <section>
    <b-container class="mt-2">
      <portal to="pageTitle">
        <h3>Boards</h3>
      </portal>

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
