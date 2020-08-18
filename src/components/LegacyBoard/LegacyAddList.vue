<template lang="html">
  <div>
    <b-button
      v-b-modal="modalId"
      class="mr-3"
      :title="title"
      ref="addList"
    >
      <b-icon-plus />
    </b-button>

    <b-modal
      :id="modalId"
      :title="title"
      @shown="reset"
    >
      <form ref="addListForm" @submit.stop.prevent="submit">
        <b-form-input
          autofocus
          v-model="listName"
          :placeholder="$t('list.placeholder')"
          required
        />

        <b-alert
          class="mt-3 mb-0"
          :show="isDuplicate && !saving"
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
          :disabled="saving || isDuplicate"
          @click="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ buttonLabel }}</span>
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      listName: '',
      saving: false,
      modalId: 'add-list',
    };
  },

  computed: {
    ...mapState(['gameLists', 'platform']),

    lists() {
      return this.gameLists[this.platform.code];
    },

    title() {
      return this.isEmptyBoard
        ? this.$t('list.addFirstTime')
        : this.$t('list.add');
    },

    buttonLabel() {
      return this.isEmptyBoard
        ? this.$t('list.getStarted')
        : this.$t('global.save');
    },

    existingListNames() {
      return this.lists
        ? this.lists.map(({ name }) => name.toLowerCase())
        : [];
    },

    isDuplicate() {
      return this.existingListNames.includes(this.listName.toLowerCase());
    },

    isEmptyBoard() {
      const newList = this.gameLists && this.platform && !this.gameLists[this.platform.code];
      const emptyList = this.gameLists[this.platform.code]
      && this.gameLists[this.platform.code].length === 0;

      return newList || emptyList;
    },

    disabled() {
      return this.isDuplicate || !this.listName;
    },
  },

  methods: {
    reset() {
      this.listName = '';
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.addListForm.checkValidity()) {
        this.addList();
      }
    },

    addList() {
      const list = {
        games: [],
        name: this.listName,
      };

      this.saving = true;

      this.$store.commit('ADD_LIST', list);

      this.$store.dispatch('SAVE_LIST_LEGACY', this.gameLists)
        .then(() => {
          this.$bvToast.toast('List added', {
            variant: 'success',
          });
          this.saving = true;
          this.$bvModal.hide(this.modalId);
          this.scroll();
        });

      // TODO: catch and make async
    },

    scroll() {
      this.$nextTick(() => {
        const board = document.querySelector('.board');

        board.scrollLeft = board.scrollWidth;
      });
    },
  },
};
</script>
