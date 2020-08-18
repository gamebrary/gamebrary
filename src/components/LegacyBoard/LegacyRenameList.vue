<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <b-icon-textarea-t /> Rename list

    <b-modal
      :id="modalId"
      title="Rename list"
      @shown="getListName"
    >
      <form ref="renameListForm" @submit.stop.prevent="submit">
        <b-form-input
          ref="listNameField"
          autofocus
          v-model.trim="listName"
          placeholder="Enter your name"
          required
        />

        <b-alert
          class="mt-3 mb-0"
          :show="isDuplicate"
          variant="warning"
        >
          {{ $t('list.duplicateWarning') }}
        </b-alert>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving || !dirtied || isDuplicate"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save</span>
        </b-button>
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    listIndex: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      listName: null,
      saving: false,
    };
  },

  computed: {
    ...mapState(['gameLists', 'platform']),

    modalId() {
      return `rename-list-${this.listIndex}`;
    },

    dirtied() {
      const { name } = this.gameLists[this.platform.code][this.listIndex];

      return this.listName && name !== this.listName;
    },

    existingListNames() {
      const lists = this.gameLists[this.platform.code];
      const currentList = lists[this.listIndex];

      return lists.map(list => list.name.toLowerCase())
        .filter(name => name !== currentList.name.toLowerCase());
    },

    isDuplicate() {
      return this.listName && this.existingListNames.includes(this.listName.toLowerCase());
    },
  },

  methods: {
    getListName() {
      const { name } = this.gameLists[this.platform.code][this.listIndex];

      this.listName = name;
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.renameListForm.checkValidity()) {
        this.save();
      }
    },

    async save() {
      this.saving = true;

      const gameLists = JSON.parse(JSON.stringify(this.gameLists));

      gameLists[this.platform.code][this.listIndex].name = this.listName;

      await this.$store.dispatch('SAVE_LIST', gameLists)
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

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
