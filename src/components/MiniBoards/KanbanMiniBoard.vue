<template>
  <div class="lists d-inline-flex ml-1 rounded overflow-hidden">
    <b-card
      v-for="(list, listIndex) in board.lists"
      :key="listIndex"
      body-class="p-0 kanban-list"
      :bg-variant="darkTheme ? 'black' : 'transparent'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      class="overflow-hidden align-self-start mr-1"
    >
      <template v-if="list.games.length">
        <div
          v-for="(game, index) in list.games"
          :key="index"
          style="width: 60px;"
          class="p-1 d-flex"
          :class="[
            game.id === currentGameId
              ? 'bg-danger'
              : darkTheme
                ? 'border-black bg-dark'
                : 'border-light bg-white',
            {
              'border-bottom' : index !== list.games.length - 1,
            }
          ]"
        >
          <b-avatar
            style="border-radius: 4px !important"
            text=" "
            :src="currentGameId && game.src && game.id === currentGameId ? game.src : showGameThumbnails && game.src ? game.src : null"
            v-b-tooltip.hover
            :variant="darkTheme ? 'black' : 'light'"
            size="24"
            @click.native="highlightGame(game.id)"
          />
        </div>
      </template>

      <div
        v-else
        class="rounded overflow-hidden"
        style="height: 28px; width: 60px;"
      />
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },

  methods: {
    highlightGame(gameId) {
      this.$store.commit('SET_HIGHLIGHTED_GAME', gameId);
    },
  },

  computed: {
    ...mapGetters(['darkTheme', 'showGameThumbnails']),
    ...mapState(['game', 'routeName']),

    currentGameId() {
      return this.routeName === 'game'
        ? this.game?.id
        : null;
    },
  },
};
</script>
