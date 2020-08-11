<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <b-icon-grid1x2 />
    Change view

    <b-modal
      :id="modalId"
      title="Change list view"
      @shown="getView"
    >
      <form ref="renameListForm" @submit.prevent="save">
        <b-form-group label="Views">
          <b-form-radio-group
            v-model="listView"
            required
            :options="listViews"
            buttons
          />
        </b-form-group>

        <game-card-default
          v-if="!listView || listView === 'single'"
          :id="randomGame"
          :game-id="randomGame"
          :list-id="listIndex"
          @click.stop.native="selectListView('default')"
        />

        <game-card-grid
          v-if="listView === 'grid'"
          :id="randomGame"
          :game-id="randomGame"
          :list-id="listIndex"
          @click.stop.native="selectListView('grid')"
        />

        <game-card-compact
          v-if="listView === 'compact'"
          :id="randomGame"
          :game-id="randomGame"
          :list-id="listIndex"
          @click.stop.native="selectListView('compact')"
        />

        <game-card-text
          v-if="listView === 'text'"
          :id="randomGame"
          :game-id="randomGame"
          :list-id="listIndex"
          @click.stop.native="selectListView('text')"
        />
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
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';

export default {
  components: {
    GameCardDefault,
    GameCardGrid,
    GameCardCompact,
    GameCardText,
  },
  props: {
    listIndex: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      listView: null,
      saving: false,
      listViews: [
        { text: 'Single', value: 'single' },
        { text: 'Grid', value: 'grid' },
        { text: 'Compact', value: 'compact' },
        { text: 'Text', value: 'text' },
      ],
    };
  },

  computed: {
    ...mapState(['gameLists', 'platform']),

    modalId() {
      return `add-game-${this.listIndex}`;
    },

    list() {
      return this.gameLists && this.platform && this.gameLists[this.platform.code]
        ? this.gameLists[this.platform.code]
        : null;
    },

    randomGame() {
      const flattenedList = this.list ? this.list.map(({ games }) => games).flat() : [];

      const randomNumber = Math.floor(Math.random() * flattenedList.length);

      return flattenedList[randomNumber];
    },
  },

  methods: {
    getView() {
      const { view } = this.gameLists[this.platform.code][this.listIndex];

      this.listView = view || 'single';
    },

    async save() {
      this.saving = true;

      const gameLists = JSON.parse(JSON.stringify(this.gameLists));

      gameLists[this.platform.code][this.listIndex].view = this.listView;

      await this.$store.dispatch('SAVE_LIST', gameLists)
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving list view', {
            title: 'Error',
            variant: 'danger',
          });
        });

      this.saving = false;

      this.$bvToast.toast('List view saved', {
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
