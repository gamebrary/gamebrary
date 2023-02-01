<template lang="html">
  <b-row class="px-2">
    <b-spinner v-if="loading" class="spinner-centered" />

    <template v-else>
      <empty-state
        v-if="isEmpty && !isPublicBoard"
        title="Boards"
        message="Use boards to organize your video games"
      >
        <b-button
          :to="{ name: 'create.board' }"
          variant="primary"
        >
          {{ $t('boards.create') }}
        </b-button>
      </empty-state>

      <template v-else>
        <portal to="headerActions">
          <b-button
            v-if="user"
            :variant="darkTheme ? 'secondary' : 'light'"
            class="mr-2"
            :to="{ name: 'create.board' }"
          >
            Create board
          </b-button>
        </portal>

        <div class="board-grid mx-2">
          <mini-board
            v-for="board in gameBoards"
            :key="board.id"
            :board="board"
            @click.native="$router.push({ name: 'board', params: { id: board.id } })"
          />
        </div>
      </template>
    </template>
  </b-row>
</template>

<script>
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';
import Packery from 'packery';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    MiniBoard,
    EmptyState,
  },

  data() {
    return {
      loading: false,
      packery: null,
    };
  },

  computed: {
    ...mapState(['publicBoards', 'user', 'boards', 'wallpapers']),
    ...mapGetters(['isBoardOwner', 'sortedBoards', 'darkTheme']),

    gameBoards() {
      return this.isPublicBoard
        ? this.publicBoards
        : this.sortedBoards;
    },

    isEmpty() {
      return !this.loading && this.gameBoards.length === 0;
    },

    isPublicBoard() {
      return this.$route.name === 'explore';
    },
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loading = this.gameBoards?.length === 0;

      if (this.isPublicBoard) {
        this.loadPublicBoards();
      } else {
        this.loadBoards()
      }
    },

    async loadBoards() {
      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;

      if(!this.boards?.length) this.$emit('empty');
    },

    async loadPublicBoards() {
      await this.$store.dispatch('LOAD_PUBLIC_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.loading = false;
    },

    viewPublicBoard(id) {
      this.$router.push({ name: 'public.board', params: { id } });
    },

    async deleteBoard(id) {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', id)
        .catch(() => {
          this.loading = false;

          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
    },
  },
};
</script>
