<template lang="html">
  <div class="container-fluid">
    <div class="px-2 my-2 d-flex justify-content-between align-items-center">
      <h5>Boards</h5>

      <create-board />
    </div>

    <div class="text-right" v-if="!loading && !boards.length">
      <b-img src="/static/img/empty-state.png" fluid class="mr-5" />
    </div>

    <b-overlay :show="loading && !platforms.length" rounded="sm" variant="transparent">
      <b-row no-gutters>
        <b-col cols="12" sm="6" md="4" lg="3" v-for="board in boards" :key="board.id">
          <b-card
            :header="board.name"
            header-tag="h6"
            header-class="p-2"
            body-class="p-2"
            class="m-2 clickable"
            footer-class="p-2"
            @click="viewBoard(board.id)"
          >
            <b-card-text>
              <p v-if="board.description">
                {{ board.description }}
              </p>

              {{ board.lists.length }} Lists
            </b-card-text>

            <template v-slot:footer>
              <b-avatar-group v-if="platformNames.length">
                <!-- eslint-disable-next-line -->
                <b-avatar :src="`/static/platform-logos/${platformNames[id].slug}.${platformNames[id].logoFormat}`"
                  v-for="id in board.platforms"
                  :key="id"
                  variant="light"
                  size="sm"
                />
              </b-avatar-group>
            </template>

            <!-- <b-button
              variant="danger"
              @click="confirmDelete(board.id)"
            >
              Delete board
            </b-button> -->

            <!-- <b-button
              variant="primary"
              @click="viewBoard(board.id)"
            >
              Open board
            </b-button> -->
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import CreateBoard from '@/components/Board/CreateBoard';

import { mapState, mapGetters } from 'vuex';

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
    ...mapState(['boards', 'platforms', 'platformNames']),
    ...mapGetters(['platformNames']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadBoards();
      this.loadPlatforms();
    },

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

<style lang="scss" rel="stylesheet/scss">
.b-avatar .b-avatar-img img {
  width: 40px !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>
