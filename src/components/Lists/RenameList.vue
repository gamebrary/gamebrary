<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <icon name="pencil" />
    {{ $t('board.list.renameList') }}

    <b-modal
      :id="modalId"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      @show="getListName"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.renameList')"
        >
          <b-button
            variant="light"
            size="sm"
            @click="close"
          >
            <icon name="x" />
          </b-button>
        </modal-header>
      </template>

      <form ref="renameListForm" @submit.stop.prevent="submit">
        <b-form-input
          ref="listNameField"
          autofocus
          v-model.trim="listName"
          :placeholder="$t('board.list.renameListPlaceholder')"
          required
        />

        <b-alert
          class="mt-3 mb-0"
          :show="isDuplicate"
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
          :disabled="saving || !dirtied || isDuplicate"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      listName: null,
      saving: false,
    };
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['nightMode']),

    modalId() {
      return `rename-list-${this.listIndex}`;
    },

    dirtied() {
      const { name } = this.list;

      return this.listName && name !== this.listName;
    },

    existingListNames() {
      const { board, list } = this;

      return board.lists.map(({ name }) => name.toLowerCase())
        .filter(name => name !== list.name.toLowerCase());
    },

    isDuplicate() {
      return this.listName && this.existingListNames.includes(this.listName.toLowerCase());
    },
  },

  methods: {
    getListName() {
      const { name } = this.list;

      this.listName = name;
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.renameListForm.checkValidity()) {
        this.save();
      }
    },

    async save() {
      const { listIndex, listName } = this;

      this.saving = true;

      this.$store.commit('RENAME_LIST', { listIndex, listName });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', {
            title: 'Error',
            variant: 'danger',
          });
        });

      this.saving = false;

      this.$bvToast.toast('List renamed', {
        title: 'Saved',
        variant: 'success',
      });

      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>
