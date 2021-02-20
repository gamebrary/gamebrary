<template lang="html">
  <b-modal
    :id="modalId"
    :title="$t('board.addList.title')"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    hide-footer
    @show="reset"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        :title="$t('board.addList.title')"
        :subtitle="board.name"
        @close="close"
      >
        <b-button
          :disabled="saving || isDuplicate || !listName"
          class="d-none d-sm-inline"
          @click="saveAndAddGame"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save and add games</span>
        </b-button>

        <b-button
          :disabled="saving || isDuplicate || !listName"
          variant="primary"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

    <form ref="addListForm" @submit.stop.prevent="submit">
      <b-form-group
        label="List name:"
        label-for="listName"
      >
        <b-form-input
          id="listName"
          autofocus
          v-model="listName"
          :placeholder="$t('board.addList.placeholder')"
          required
        />
      </b-form-group>

      <b-alert
        class="mt-3 mb-0"
        :show="isDuplicate && !saving"
        variant="warning"
      >
        {{ $t('board.list.duplicateWarning') }}
      </b-alert>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      listName: '',
      saving: false,
      addAfterSave: false,
      modalId: 'add-list',
    };
  },

  computed: {
    ...mapState(['platform', 'board']),
    ...mapGetters(['nightMode']),

    existingListNames() {
      return this.board.lists
        ? this.board.lists.map(({ name }) => name.toLowerCase())
        : [];
    },

    isDuplicate() {
      return this.existingListNames.includes(this.listName.toLowerCase());
    },

    isEmptyBoard() {
      return this.board.lists && this.board.lists.length === 0;
    },

    disabled() {
      return this.isDuplicate || !this.listName;
    },
  },

  methods: {
    saveAndAddGame(e) {
      this.addAfterSave = true;

      this.submit(e);
    },

    reset() {
      this.addAfterSave = false;
      this.listName = '';
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.addListForm.checkValidity()) {
        this.addList();
      }
    },

    async addList() {
      const list = {
        games: [],
        name: this.listName,
        settings: {},
      };

      this.saving = true;

      this.$store.commit('ADD_LIST', list);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('Error adding list', { variant: 'danger' });
        });

      this.$forceUpdate();
      this.$bvToast.toast('List added');
      this.saving = false;
      this.$bvModal.hide(this.modalId);
      this.scroll();

      if (this.addAfterSave) {
        this.$bvModal.show(`game-modal-${this.listName}`);
      }
    },

    scroll() {
      this.$nextTick(() => {
        const board = document.querySelector('.board');

        board.scrollLeft = board.scrollWidth;
      });
    },
  },
};
</script>
