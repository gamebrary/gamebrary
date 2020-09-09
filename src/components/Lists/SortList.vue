<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <b-icon-sort-up />
    Sort list

    <b-modal
      :id="modalId"
      title="Sort list"
      @show="getSortValue"
    >
      <form ref="renameListForm" @submit.stop.prevent="save">
        <b-form-group :label="$t('list.sortList')" block>
          <b-form-radio-group
            v-model="sortOrder"
            buttons
            stacked
            variant="primary"
            :options="sortingOptions"
          />
        </b-form-group>

        <b-alert show variant="warning" class="m-0" v-if="sortOrder !== 'sortByCustom'">
          Auto sorting list will affect how drag and drop works
        </b-alert>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
          @click="save"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save</span>
        </b-button>
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
export default {
  props: {
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      sortOrder: null,
      saving: false,
      sortingOptions: [
        { text: 'Custom', value: 'sortByCustom' },
        { text: 'Name', value: 'sortByName' },
        { text: 'Rating', value: 'sortByRating' },
        // { text: 'Release date', value: 'sortByReleaseDate' },
        { text: 'Progress', value: 'sortByProgress' },
      ],
    };
  },

  computed: {
    modalId() {
      return `sort-list-${this.listIndex}`;
    },
  },

  methods: {
    getSortValue() {
      const { sortOrder } = this.list.settings;

      this.sortOrder = sortOrder || 'sortByCustom';
    },

    async save() {
      const { listIndex, sortOrder, list } = this;
      this.saving = true;

      this.$store.commit('SET_LIST_SORT_ORDER', { listIndex, sortOrder });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving sort order', {
            title: 'Error',
            variant: 'danger',
          });
        });

      this.saving = false;

      this.$bvToast.toast('Sort order saved', {
        title: list.name,
        variant: 'success',
      });

      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>
