<template lang="html">
  <b-dropdown-item-button
    v-b-modal="modalId"
    :variant="nightMode ? 'primary' : null"
  >
    <i class="fas fa-sort fa-fw" aria-hidden />
    {{ $t('board.list.sortList') }}

    <b-modal
      :id="modalId"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      size="sm"
      footer-class="d-flex justify-content-between"
      @show="getSortValue"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.sortList')"
          @close="close"
        />
      </template>

      <form ref="renameListForm" @submit.stop.prevent="save">
        <b-form-radio-group
          v-model="sortOrder"
          buttons
          variant="primary"
          :options="sortingOptions"
        />

        <b-alert
          v-if="sortOrder !== 'sortByCustom'"
          show
          variant="warning"
          class="m-0 mt-3"
        >
          {{ $t('board.list.sortWarning') }}
        </b-alert>
      </form>

      <template v-slot:modal-footer>
        <b-button
          variant="primary"
          class="ml-auto"
          :disabled="saving"
          @click="save"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import { mapGetters } from 'vuex';

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

  computed: {
    ...mapGetters(['nightMode']),

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
