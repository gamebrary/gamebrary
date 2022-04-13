<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <i class="fas fa-sort fa-fw" aria-hidden />
    {{ $t('board.list.sortList') }}

    <b-modal
      :id="modalId"
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
