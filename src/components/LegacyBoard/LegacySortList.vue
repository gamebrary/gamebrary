<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <b-icon-sort-up />
    Sort list

    <b-modal
      :id="modalId"
      title="Sort list"
      @shown="getSortValue"
    >
      <form ref="renameListForm" @submit.stop.prevent="save">
        <b-form-group :label="$t('list.sortList')" block>
          <b-form-radio-group
            v-model="sortOrder"
            buttons
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
      sortOrder: null,
      saving: false,
      sortingOptions: [
        { text: 'Custom', value: 'sortByCustom' },
        { text: 'Name', value: 'sortByName' },
        { text: 'Rating', value: 'sortByRating' },
        { text: 'Release date', value: 'sortByReleaseDate' },
        { text: 'Progress', value: 'sortByProgress' },
      ],
    };
  },

  computed: {
    ...mapState(['gameLists', 'platform']),

    modalId() {
      return `sort-list-${this.listIndex}`;
    },
  },

  methods: {
    getSortValue() {
      const { sortOrder } = this.gameLists[this.platform.code][this.listIndex];

      this.sortOrder = sortOrder || 'sortByCustom';
    },

    async save() {
      this.saving = true;

      const gameLists = JSON.parse(JSON.stringify(this.gameLists));

      gameLists[this.platform.code][this.listIndex].sortOrder = this.sortOrder;

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
