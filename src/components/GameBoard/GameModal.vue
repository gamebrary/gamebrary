<template lang="html">
  <modal
    ref="game"
    large
    @close="closeGame"
  >
    <game
      v-if="gameDetailId"
      slot="content"
      :id="gameDetailId"
      :list-id="gameDetailListIndex"
    />
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import Game from '@/pages/Game';

export default {
  components: {
    Modal,
    Game,
  },

  data() {
    return {
      gameDetailId: null,
    };
  },

  mounted() {
    this.$bus.$on('OPEN_GAME', this.openGame);
  },

  beforeDestroy() {
    this.$bus.$off('OPEN_GAME');
  },

  methods: {
    closeGame() {
      this.setPageTitle();
      this.gameDetailId = null;
      this.$store.commit('CLEAR_ACTIVE_GAME');
    },

    setPageTitle() {
      document.title = this.platform ? `${this.platform.name} - Gamebrary` : 'Gamebrary';
    },

    openGame({ id, listId }) {
      this.gameDetailId = id;
      this.gameDetailListIndex = listId;
      this.$refs.game.open();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
