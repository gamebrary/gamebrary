<template lang="html">
  <form ref="renameListForm" @submit.stop.prevent="save">
    <b-form-group
      id="list-sorting"
      label="Sort list by:"
      label-for="sortField"
      description="We'll never share your email with anyone else."
    >
      <b-form-select
        id="sortField"
        :options="sortingOptions"
        v-model="sortOrder"
        placeholder="Enter email"
        required
      />
    </b-form-group>

    <!-- <b-form-radio-group
      v-model="sortOrder"
      stacked
      variant="primary"
      :options="sortingOptions"
    /> -->

    <!-- TODO: move to computed -->
    <b-alert
      class="mb-0 mt-2 small"
      show
      :variant="sortOrder !== 'sortByCustom' ? 'warning' : 'info'"
    >
      <span v-if="sortOrder === 'sortByCustom'">
        Games will be added to end of list, drag games to re-order.
      </span>

      <span v-else-if="sortOrder">
        Games will be sorted by

        <span class="text-lowercase">
          {{ $t(`board.list.${sortOrder}`)}}
        </span>
      </span>
    </b-alert>

    <b-button
      variant="primary"
      class="ml-auto"
      :disabled="saving"
      @click="save"
    >
      <b-spinner small v-if="saving" />
      <span v-else>{{ $t('global.save') }}</span>
    </b-button>
  </form>
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
        { text: this.$t('board.list.sortByCustom'), value: 'sortByCustom' },
        { text: this.$t('board.list.sortByName'), value: 'sortByName' },
        { text: this.$t('board.list.sortByRating'), value: 'sortByRating' },
        { text: this.$t('board.list.sortByProgress'), value: 'sortByProgress' },
        // { text: 'Release date', value: 'sortByReleaseDate' },
      ],
    };
  },

  mounted() {
    this.getSortValue();
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
