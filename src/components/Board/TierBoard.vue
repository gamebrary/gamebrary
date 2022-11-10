<template lang="html">
  <div class="board px-3 pb-3 d-flex flex-column">
    <tier-list
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :allGames="allGames"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <!-- TODO: create different component for adding tier -->
    <!-- <add-list
      v-if="isBoardOwner"
      :empty="empty"
    /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import AddList from '@/components/Board/AddList';
import TierList from '@/components/Lists/TierList';

export default {
  components: {
    TierList,
    // AddList,
  },

  computed: {
    ...mapState(['board', 'games']),
    ...mapGetters(['isBoardOwner']),

    empty() {
      return this.board?.lists?.length === 0;
    },

    formattedGames() {
      return this.board?.games.map((id) => this.games[id]);
    },

    allGames() {
      return this.board.lists.map((list) => list.games).flat(2);
    },
  },

  methods: {
    async selectGame(gameId) {
      const board = JSON.parse(JSON.stringify(this.board));

      board.games.push(gameId);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
        await this.$store.dispatch('LOAD_BOARD', board?.id);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },
  },
};
</script>
