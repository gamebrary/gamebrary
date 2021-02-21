<template lang="html">
  <b-dropdown-item-button
    v-b-modal="modalId"
    :variant="darkTheme ? 'secondary' : null"
  >
    <i class="fas fa-sort fa-fw" aria-hidden />
    {{ $t('board.list.sortList') }}

    <b-modal
      :id="modalId"
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
      size="sm"
      hide-footer
      @show="getSortValue"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.sortList')"
          :subtitle="list.name"
          @close="close"
        >
          <b-button
            variant="primary"
            class="ml-auto"
            :disabled="saving"
            @click="save"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>
        </modal-header>
      </template>

      <form ref="renameListForm" @submit.stop.prevent="save">
        <b-form-radio-group
          v-model="sortOrder"
          variant="primary"
          :options="sortingOptions"
        />

        <b-alert
          class="mb-0 mt-2"
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
      </form>
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
    ...mapGetters(['darkTheme']),

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
