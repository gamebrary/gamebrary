<template lang="html">
  <div class="container-fluid">
    <div class="px-2 my-2 d-flex justify-content-between align-items-center">
      <h5>Boards</h5>

      <create-board />
    </div>

    <b-alert show variant="success">
      <h4 class="alert-heading">Big news!</h4>
      <p>
        Introducing boards! Boards are pretty much the same as the
        current lists, except that you can now select more than one platform.

        We've improved a ton of stuff under the hood.
      </p>
      <hr>
      <b-button variant="primary" as="router-link" :to="{ name: 'boards' }">
        Go to boards
      </b-button>
    </b-alert>

    <b-overlay :show="loading" rounded="sm" variant="transparent">
      <b-row cols="3" no-gutters>
        <b-col v-for="{ name, description, id, lists } in boards" :key="id">
          <b-card
            :title="name"
            tag="article"
            class="m-2"
            @click="viewBoard(id)"
          >
            <b-card-text>
              {{ description }}
            </b-card-text>

            <pre>{{ lists }}</pre>

            <b-button
              variant="danger"
              @click.stop="confirmDelete(id)"
            >
              Delete board
            </b-button>
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
    ...mapState(['boards']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadBoards();
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
