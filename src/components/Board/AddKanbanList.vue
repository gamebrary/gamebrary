<template lang="html">
  <div class="flex-shrink-0 pr-4">
    <b-card
      v-if="active || empty"
      class="mr-3"
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      no-body
      v-click-outside="reset"
    >
      <form
        ref="addListForm"
        class="p-2"
        @submit.stop.prevent="submit"
      >
        <b-input-group>
          <b-form-input
            id="listName"
            v-model="listName"
            autofocus
            placeholder="List name"
            required
          />

          <b-input-group-append>
            <b-button
              variant="primary"
              :disabled="saving || !listName"
              @click.stop="submit"
            >
              <b-spinner v-if="saving" small />
              <span v-else>Add</span>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </form>
    </b-card>

    <b-button
      v-else
      :variant="darkTheme ? 'dark' : 'light'"
      class="mr-2"
      @click.stop="showForm"
    >
      <i class="fas fa-plus" aria-hidden />
    </b-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    empty: Boolean,
  },

  data() {
    return {
      listName: '',
      active: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['darkTheme']),
  },

  methods: {
    reset() {
      this.listName = '';
      this.active = false;
    },

    showForm() {
      this.active = true;
      this.scrollToEnd();
    },

    submit(e) {
      e.preventDefault();

      if (!this.$refs.addListForm.checkValidity()) {
        return;
      }

      this.addList();
    },

    async addList() {
      this.saving = true;

      try {
        const list = {
          games: [],
          name: this.listName,
          settings: {},
        };

        this.$store.commit('ADD_LIST', list);
        await this.$store.dispatch('SAVE_BOARD');

        this.reset();
        this.scrollToEnd();
      } catch (error) {
        this.$bvToast.toast('Error adding list', { variant: 'danger' });
      } finally {
        this.saving = false;
      }
    },

    scrollToEnd() {
      this.$nextTick(() => {
        const board = document.querySelector('.viewport');
        board.scrollLeft = board.scrollWidth;
      });
    },
  },
};
</script>
