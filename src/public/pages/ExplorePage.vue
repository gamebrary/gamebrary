<template lang="html">
  <section>
    <b-container>
      <game-boards />

      <!-- <div class="game-deals">
        <twitter-feed twitter-user="wario64" />
      </div> -->
    </b-container>
  </section>
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
