<template lang="html">
  <div class="container-fluid">
    <div class="px-2 my-2 d-flex justify-content-between align-items-center">
      <h5>Boards</h5>

      <create-board />
    </div>

    <b-overlay :show="loading && !platforms.length" rounded="sm" variant="transparent">
      <b-row cols="3" no-gutters>
        <b-col v-for="board in boards" :key="board.id">
          <b-card
            :title="board.name"
            tag="article"
            class="m-2"
          >
            <b-card-text>
              {{ board.description }}
            </b-card-text>

            <b-button
              variant="danger"
              @click="confirmDelete(board.id)"
            >
              Delete board
            </b-button>

            <b-button
              variant="primary"
              @click="viewBoard(board.id)"
            >
              Open board
            </b-button>

            <!-- <b-button v-b-modal:board-settings>
              <b-icon-gear-fill />
            </b-button> -->
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';

import { mapState } from 'vuex';

export default {
  components: {
    CreateBoard,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['boards', 'platforms']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadBoards();
      this.loadPlatforms();
    },

    // getPlatformNames(boardPlatforms) {
    //   const platformNames = boardPlatforms.map((platform) => {
    //     this.platforms.find(({ id }) => id === platform)
    //     console.log(platform);
    //   })
    // },

    async loadPlatforms() {
      await this.$store.dispatch('LOAD_IGDB_PLATFORMS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading platforms', { title: 'Error', variant: 'error' });
        });
    },

    async loadBoards() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARDS')
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('There was an error loading boards', { title: 'Error', variant: 'error' });
        });

      this.loading = false;
    },

    viewBoard(id) {
      this.$router.push({ name: 'board', params: { id } });
    },

    confirmDelete(id) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        okTitle: 'Yes, delete board',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard(id);
          }
        });
    },

    async deleteBoard(id) {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', id)
        .catch(() => {
          this.loading = false;

          this.$bvToast.toast('There was an error deleting board', { title: 'Error', variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed', { title: 'Success', variant: 'success' });
    },
  },
};
</script>
