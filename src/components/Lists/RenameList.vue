<template lang="html">
  <form ref="renameListForm" @submit.stop.prevent="submit">
    <b-form-input
      ref="listNameField"
      autofocus
      v-model.trim="listName"
      :placeholder="$t('board.list.renameListPlaceholder')"
      required
    />

    <b-alert
      v-if="isDuplicate && listName.length > 0"
      class="mt-3 mb-0"
      show
      variant="warning"
    >
      {{ $t('board.list.duplicateWarning') }}
    </b-alert>

    <b-button
      variant="primary"
      class="ml-auto"
      :disabled="saving || !dirtied || isDuplicate"
      @click="submit"
    >
      <b-spinner small v-if="saving" />
      <span v-else>{{ $t('global.save') }}</span>
    </b-button>
  </form>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      listName: '',
      saving: false,
    };
  },

  computed: {
    ...mapState(['board']),

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

  mounted() {
    this.getListName();
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
