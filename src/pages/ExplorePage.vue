<template lang="html">
  <b-container class="explore-page">
    <div class="boards">
      <b-card
        v-for="board in publicBoards"
        :key="board.id"
        no-body
        class="overflow-hidden cursor-pointer"
        @click="viewBoard(board.id)"
      >
        <mini-board
          :board="board"
          :background-image="getWallpaper(board)"
        />
      </b-card>
    </div>

  <div class="game-deals">
    <twitter-feed twitter-user="wario64" />
  </div>
</b-container>
</template>

<script>
import { mapState } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import TwitterFeed from '@/components/TwitterFeed';

export default {
  components: {
    MiniBoard,
    TwitterFeed,
  },

  computed: {
    ...mapState(['publicBoards', 'wallpapers']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.$store.dispatch('LOAD_PUBLIC_BOARDS');
    },

    getWallpaper({ wallpaper }) {
      if (!wallpaper) return '';

      this.$store.dispatch('LOAD_WALLPAPER', wallpaper)
        .then(url => url);
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.explore-page {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 1rem;
}

.boards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.game-deals {
  background-color: #fc0;
  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
