<!-- TODO: handle dupes -->
<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    Rename

    <b-modal
      :id="modalId"
      title="Rename list"
      @shown="getListName"
    >
      <form ref="renameListForm" @submit.stop.prevent="submit">
        <b-form-input
          ref="listNameField"
          autofocus
          v-model="listName"
          placeholder="Enter your name"
          required
        />
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
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
