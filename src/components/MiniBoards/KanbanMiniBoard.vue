<template>
  <div class="lists d-inline-flex ml-1 rounded overflow-hidden">
    <div
      v-for="(list, listIndex) in board.lists"
      :key="listIndex"
      class="card overflow-hidden align-self-start mr-1"
      :class="[
        darkTheme ? 'bg-black text-light' : 'bg-transparent text-dark',
        'p-0 kanban-list'
      ]"
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
          <img
            v-if="currentGameId && game.src && game.id === currentGameId ? game.src : showGameThumbnails && game.src ? game.src : null"
            :src="currentGameId && game.src && game.id === currentGameId ? game.src : showGameThumbnails && game.src ? game.src : null"
            style="border-radius: 4px !important; width: 24px; height: 24px; object-fit: cover;"
            @click="highlightGame(game.id)"
            alt=""
          />
          <div
            v-else
            style="border-radius: 4px !important; width: 24px; height: 24px; background-color: var(--bs-gray-300);"
            @click="highlightGame(game.id)"
          />
        </div>
      </template>

      <div
        v-else
        class="rounded overflow-hidden"
        style="height: 28px; width: 60px;"
      />
    </div>
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
