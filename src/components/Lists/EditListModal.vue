<template>
  <b-modal
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
    id="edit-list-modal"
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit list"
        :subtitle="list.name"
        @close="close"
      />
    </template>

    <!-- <pre>{{ list }}</pre> -->
    <form @submit.prevent="saveList">
      <div
        v-if="board.type === 'tier'"
        class="mt-3 d-flex justify-content-between align-items-start"
      >
        <v-swatches
          v-model="list.backgroundColor"
          show-fallback
          :trigger-style="{ height: '40px', width: '40px' }"
          popover-x="left"
        />

        <b-form-input
          id="name"
          class="ml-3"
          v-model.trim="list.name"
        />
      </div>

      <template v-else>
        <h4>List name</h4>

        <b-form-input
          id="name"
          v-model.trim="list.name"
        />

        <section class="mt-3">
          <h4>Sort by</h4>

          <b-button
            v-for="option in $options.LIST_SORT_OPTIONS"
            :key="option.value"
            :variant="option.value == list.sortOrder ? 'primary' : 'light'"
            class="mr-2 mb-2"
            @click="setListSorting(option.value)"
          >
            {{ option.text }}
          </b-button>

          <!-- <small class="text-secondary" v-if="!list.sortOrder" show>
            <i class="far fa-hand-paper" aria-hidden="true"></i>
            Drag and drop
          </small> -->
        </section>

        <section class="mt-3">
          <h4>List view</h4>

          <b-button
            v-for="option in $options.LIST_VIEW_OPTIONS"
            :key="option.value"
            :variant="option.value === list.view ? 'primary' : 'light'"
            class="mr-2 mb-2"
            @click="setListView(option.value)"
          >
            {{ option.text }}
          </b-button>
        </section>

        <section class="mt-3">
          <h4>Settings</h4>

          <b-form-checkbox
            v-model="list.showReleaseDates"
            class="my-2"
            disabled
            switch
          >
            {{ $t('board.list.showReleaseDates') }}
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.showGameProgress"
            class="mb-2"
            switch
          >
            {{ $t('board.list.showGameProgress') }}
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.highlightCompletedGames"
            class="mb-2"
            switch
          >
            Highlight completed games
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.showGameNotes"
            class="mb-2"
            switch
          >
            {{ $t('board.list.showGameNotes') }}
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.showGameTags"
            class="mb-2"
            switch
          >
            {{ $t('board.list.showGameTags') }}
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.showGameCount"
            class="mb-2"
            name="check-button"
            switch
          >
            {{ $t('board.list.showGameCount') }}
          </b-form-checkbox>
        </section>
      </template>

      <footer class="mt-5">
        <b-button
          variant="primary"
          :disabled="saving"
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>

        <b-button
          variant="outline-danger"
          class="mx-2"
          @click="confirmDeleteList"
        >
          Delete
        </b-button>
      </footer>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LIST_SORT_OPTIONS, LIST_VIEW_OPTIONS } from '@/constants';
import VSwatches from 'vue-swatches'

export default {
  LIST_SORT_OPTIONS,
  LIST_VIEW_OPTIONS,

  components: {
    VSwatches,
  },

  data() {
    return {
      listIndex: 0,
      list: {},
      saving: false,
    }
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    this.$bus.$on('EDIT_LIST', this.openModal);
  },

  destroyed() {
    this.$bus.$off('EDIT_LIST');
  },

  methods: {
    openModal(index) {
      this.listIndex = index;
      this.saving = false;
      this.list = JSON.parse(JSON.stringify(this.board?.lists?.[this.listIndex]));
      this.$bvModal.show('edit-list-modal');
    },

    setListSorting(value) {
      this.list.sortOrder = value;
      this.$forceUpdate();
    },

    setListView(value) {
      this.list.view = value;
      this.$forceUpdate();
    },

    async confirmDeleteList() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to delete this list?', {
        title: 'Delete list',
        okVariant: 'danger',
        hideHeader: true,
        size: 'sm',
        cancelTitle: 'No',
        okTitle: 'Yes, delete list',
      });

      if (confirmed) this.deleteList();
    },

    async deleteList() {
      const { board } = this;

      board.lists.splice(this.listIndex, 1);

      const payload = {
        ...board,
        lastUpdated: Date.now(),
      }

      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error deleting list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvModal.hide('edit-list-modal');
      this.$bvToast.toast('List deleted');
    },

    async saveList() {
      this.saving = true;

      const { board } = this;

      board.lists[this.listIndex] = this.list

      const payload = {
        ...board,
        lastUpdated: Date.now(),
      }

      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving list settings', { variant: 'danger' });
        });

      this.$bvModal.hide('edit-list-modal');
      this.saving = false;
    },
  },
}
</script>

<style scoped>

</style>