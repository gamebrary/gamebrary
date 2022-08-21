<template lang="html">
  <b-container>
    <portal to="pageTitle">
      Explore public game boards
    </portal>
    <game-boards />

    <!-- <div class="game-deals">
      <twitter-feed twitter-user="wario64" />
    </div> -->
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import GameBoards from '@/components/GameBoards';
import TwitterFeed from '@/components/TwitterFeed';

export default {
  components: {
    GameBoards,
    // TwitterFeed,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// .explore-page {
//   display: grid;
//   grid-template-columns: 1fr 300px;
//   grid-gap: 1rem;
// }
// .game-deals {
//   height: calc(100vh - 200px);
//   overflow-y: auto;
// }
</style>
