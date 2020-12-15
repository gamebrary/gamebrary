<template lang="html">
  <b-dropdown-item-button
    v-b-modal="modalId"
    :variant="nightMode ? 'light' : null"
  >
    <i class="fas fa-list" aria-hidden></i>
    {{ $t('board.list.view') }}

    <b-modal
      :id="modalId"
      :header-bg-variant="nightMode ? 'dark' : null"
      :header-text-variant="nightMode ? 'white' : null"
      :body-bg-variant="nightMode ? 'dark' : null"
      :body-text-variant="nightMode ? 'white' : null"
      :footer-bg-variant="nightMode ? 'dark' : null"
      :footer-text-variant="nightMode ? 'white' : null"
      footer-class="d-flex justify-content-between"
      @show="load"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.view')"
          @close="close"
        />
      </template>

      <form class="list-view" ref="renameListForm" @submit.prevent="save">
        <!-- TODO: use named components and for loop -->
        <h6>{{ $t('board.list.views.single') }}</h6>

        <game-card-default
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-2 border-success': !view || view === 'single'}"
          @click.native="view = 'single'"
        />

        <h6>{{ $t('board.list.views.grid') }}</h6>

        <b-form-row>
          <b-col cols="6">
            <game-card-grid
              :game-id="randomGameId"
              :list="list"
              :class="{ 'rounded border border-success': view === 'grid'}"
              @click.native="view = 'grid'"
            />
          </b-col>

          <b-col cols="6" />
        </b-form-row>

        <h6>{{ $t('board.list.views.compact') }}</h6>
        <game-card-compact
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-success': view === 'compact'}"
          @click.native="view = 'compact'"
        />

        <h6>{{ $t('board.list.views.text') }}</h6>
        <game-card-text
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-success': view === 'text'}"
          @click.native="view = 'text'"
        />
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button
          variant="light"
          @click="cancel"
        >
          {{ $t('global.cancel') }}
        </b-button>

        <b-button
          variant="primary"
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
import { mapState, mapGetters } from 'vuex';
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
    };
  },

  computed: {
    ...mapState(['games']),
    ...mapGetters(['nightMode']),

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
      const { listIndex, view } = this;

      this.saving = true;

      this.$store.commit('SET_LIST_VIEW', { listIndex, view });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving list view', { variant: 'danger' });
        });

      this.saving = false;

      this.$bvToast.toast('List view saved');

      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list-view {
    width: 300px;
  }
</style>
