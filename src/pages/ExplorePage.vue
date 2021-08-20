<template lang="html">
  <b-container fluid class="explore-page">
    <div class="boards">
      <b-card
        v-for="board in publicBoards"
        :key="board.id"
        no-body
        class="overflow-hidden clickable"
        @click="viewBoard(board.id)"
      >
        <mini-board
          :board="board"
          :background-image="getWallpaper(board)"
        />
      </b-card>
    </div>

  <twitter-feed twitter-user="wario64" />
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
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length && boardWallpaper && boardWallpaper.url;
    },

    viewBoard(id) {
      this.$router.push({ name: 'public-board', params: { id } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.explore-page {
  background: #cf0;
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 1rem;
  // overflow-y: auto;
}

.boards {
  display: grid;
  background: #ccf;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
</style>
