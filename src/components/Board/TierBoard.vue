<template lang="html">
  <div class="d-flex flex-column align-items-start rounded w-100">
    <!-- <h3 :class="{ 'text-white': hasBackground || darkTheme }">
      {{ board.name }}
    </h3> -->

    <TierList
      v-for="(list, listIndex) in board.lists"
      :list="list"
      :allGames="allGames"
      :listIndex="listIndex"
      :key="listIndex"
    />

    <AddTier v-if="isBoardOwner" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AddTier from '@/components/Board/AddTier';
import TierList from '@/components/Lists/TierList';

export default {
  components: {
    TierList,
    AddTier,
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['isBoardOwner', 'darkTheme']),

    allGames() {
      return this.board.lists.map((list) => list.games).flat(2);
    },

    hasBackground() {
      return this.board?.backgroundUrl;
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
