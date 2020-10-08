<template lang="html">
  <b-button
    v-b-modal="modalId"
    :title="$t('board.addList.title')"
    size="sm"
    v-b-tooltip.hover.left
    ref="addList"
  >
    <icon name="plus" white />

    <b-modal
      :id="modalId"
      :title="$t('board.addList.title')"
      @show="reset"
    >
      <form ref="addListForm" @submit.stop.prevent="submit">
        <b-form-input
          autofocus
          v-model="listName"
          :placeholder="$t('board.addList.placeholder')"
          required
        />

        <b-alert
          class="mt-3 mb-0"
          :show="isDuplicate && !saving"
          variant="warning"
        >
          {{ $t('board.list.duplicateWarning') }}
        </b-alert>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          {{ $t('global.cancel') }}
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving || isDuplicate"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      listName: '',
      saving: false,
      modalId: 'add-list',
    };
  },

  computed: {
    ...mapState(['platform', 'board']),

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
    reset() {
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
          this.$bvToast.toast('Error adding list', { title: 'Error', variant: 'danger' });
        });

      this.$forceUpdate();
      this.$bvToast.toast('List added', { variant: 'success' });
      this.saving = false;
      this.$bvModal.hide(this.modalId);
      this.scroll();
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
