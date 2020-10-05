<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <b-icon-grid1x2 class="mr-1" />
    {{ $t('board.list.view') }}

    <b-modal
      :id="modalId"
      :title="$t('board.list.view')"
      @show="load"
    >
      <form ref="renameListForm" @submit.prevent="save">
        <b-form-group :label="$t('board.list.view')">
          <b-form-radio-group
            v-model="view"
            required
            :options="listViews"
            buttons
          />
        </b-form-group>

        <!-- TODO: use dynamic named component -->
        <template v-if="randomGameId">
          <game-card-default
            v-if="!view || view === 'single'"
            :game-id="randomGameId"
            :list="list"
          />

          <b-form-row v-if="view === 'grid'">
            <b-col cols="6">
              <game-card-grid
                :game-id="randomGameId"
                :list="list"
              />
            </b-col>

            <b-col cols="6">
              <game-card-grid
                :game-id="randomGameId"
                :list="list"
              />
            </b-col>
          </b-form-row>

          <game-card-compact
            v-if="view === 'compact'"
            :game-id="randomGameId"
            :list="list"
          />

          <game-card-text
            v-if="view === 'text'"
            :game-id="randomGameId"
            :list="list"
          />
        </template>
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
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      view: null,
      saving: false,
      randomGameId: null,
      // TODO: put in constants file
      listViews: [
        { text: this.$t('board.list.views.single'), value: 'single' },
        { text: this.$t('board.list.views.grid'), value: 'grid' },
        { text: this.$t('board.list.views.compact'), value: 'compact' },
        { text: this.$t('board.list.views.text'), value: 'text' },
      ],
    };
  },

  computed: {
    ...mapState(['games']),

    modalId() {
      return `add-game-${this.listIndex}`;
    },
  },

  methods: {
    load() {
      this.getRandomGameId();
      this.getView();
    },

    getRandomGameId() {
      // TODO: clean this up
      const { games } = this;

      const gameKeys = Object.keys(games);
      const randomNumber = Math.floor(Math.random() * gameKeys.length);
      const randomGame = games[gameKeys[randomNumber]];

      this.randomGameId = randomGame.id;
    },

    getView() {
      const { view } = this.list.settings;

      this.view = view || 'single';
    },

    async save() {
      const { listIndex, view, list } = this;

      this.saving = true;

      this.$store.commit('SET_LIST_VIEW', { listIndex, view });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving list view', {
            title: 'Error',
            variant: 'danger',
          });
        });

      this.saving = false;

      this.$bvToast.toast('List view saved', {
        title: list.name,
        variant: 'success',
      });

      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>
