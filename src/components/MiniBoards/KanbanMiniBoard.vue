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
          style="width: 60px"
          class="p-1 d-flex"
          :class="[
            gameId && game.id === gameId ? 'bg-danger' : darkTheme ? 'border-black bg-dark' : 'border-light bg-white',
            {
              'border-bottom' : index !== list.games.length - 1,
            }
          ]"
        >
          <b-avatar
            style="border-radius: 4px !important"
            text=" "
            :title="game.name"
            :src="gameId && game.src && game.id === gameId ? game.src : showGameThumbnails && game.src ? game.src : null"
            v-b-tooltip.hover
            :variant="darkTheme ? 'black' : 'light'"
            size="24"
            @click.stop.prevent
          />
        </div>
      </template>

      <div
        v-else
        class="rounded overflow-hidden"
        style="height: 22px; width: 60px;"
      />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    gameId: Number,
    board: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      // Your data properties here
    };
  },
  methods: {
    // Your methods here
  },

  computed: {
    ...mapGetters(['darkTheme', 'showGameThumbnails']),
  },

  mounted() {
    // Code to run when the component is mounted
  },
};
</script>

<style scoped>
/* Your CSS styles here */
</style>
