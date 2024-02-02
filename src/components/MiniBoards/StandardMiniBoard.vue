<template>
  <div
    class="board d-flex rounded overflow-hidden justify-content-center"
  >
  <b-card
      body-class="p-0"
      :bg-variant="darkTheme ? 'black' : 'transparent'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      style="width: 80px"
      class="overflow-hidden align-self-start"
  >
    <template v-if="firstList.games.length">
      <div
        v-for="(game, index) in firstList.games"
        :key="index"
        :class="[darkTheme ? 'border-black bg-dark' : 'border-light bg-white', { 'border-bottom': index !== firstList.games.length - 1 }]"
        class=""
      >
        <b-avatar
          :style="`border-radius: 4px !important;`"
          text=" "
          :variant="darkTheme ? 'black' : 'light'"
          class="m-1"
          v-b-tooltip.hover
          :title="game.name"
          :src="coversInMiniBoards ? game.src : null"
          size="20"
        />

        <small v-if="board.ranked">{{ index + 1 }}</small>
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
    board: {
      type: Object,
      required: true,
    },
    gameId: Number,
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
    ...mapGetters(['darkTheme', 'coversInMiniBoards']),

    firstList() {
      return this.board?.lists?.[0] || {};
    },
  },

  mounted() {
      // Code to run when the component is mounted
  },
};
</script>

<style scoped>
/* Your CSS styles here */
</style>
