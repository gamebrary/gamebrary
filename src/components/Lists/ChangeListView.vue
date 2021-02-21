<template lang="html">
  <b-dropdown-item-button
    v-b-modal="modalId"
    :variant="darkTheme ? 'secondary' : null"
  >
    <i class="fas fa-list fa-fw" aria-hidden />
    {{ $t('board.list.view') }}

    <b-modal
      :id="modalId"
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
      hide-footer
      size="sm"
      footer-class="d-flex justify-content-between"
      @show="load"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.view')"
          @close="close"
        >
          <b-button
            variant="primary"
            :disabled="saving"
            class="d-flex ml-auto"
            @click="save"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>
        </modal-header>
      </template>

      <form ref="renameListForm" @submit.prevent="save">
        <h6
          :class="!view || view === 'single' ? 'text-success' : ''"
        >
          {{ $t('board.list.views.single') }}
        </h6>

        <game-card-default
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-2 border-success': !view || view === 'single' }"
          @click.native="view = 'single'"
        />

        <h6
          class="mt-4"
          :class="view === 'covers' ? 'text-success' : ''"
        >
          {{ $t('board.list.views.covers') }}
        </h6>

        <div class="covers">
          <game-card-covers
            :game-id="randomGameId"
            :list="list"
            :class="['w-100 border', { 'border-success': view === 'covers' }]"
            @click.native="view = 'covers'"
          />

          <game-card-covers
            :game-id="randomGameId2"
            :list="list"
            :class="['w-100 border', { 'border-success': view === 'covers' }]"
            @click.native="view = 'covers'"
          />

          <game-card-covers
            :game-id="randomGameId3"
            :list="list"
            :class="['w-100 border', { 'border-success': view === 'covers' }]"
            @click.native="view = 'covers'"
          />
        </div>

        <h6
          class="mt-4"
          :class="view === 'grid' ? 'text-success' : ''"
        >
          {{ $t('board.list.views.grid') }}
        </h6>

        <b-form-row>
          <b-col>
            <game-card-grid
              :game-id="randomGameId"
              :list="list"
              :class="{ 'rounded border border-success': view === 'grid'}"
              @click.native="view = 'grid'"
            />
          </b-col>

          <b-col>
            <game-card-grid
              :game-id="randomGameId2"
              :list="list"
              :class="{ 'rounded border border-success': view === 'grid'}"
              @click.native="view = 'grid'"
            />
          </b-col>
        </b-form-row>

        <h6
          class="mt-4"
          :class="view === 'compact' ? 'text-success' : ''"
        >
          {{ $t('board.list.views.compact') }}
        </h6>

        <game-card-compact
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-success': view === 'compact'}"
          @click.native="view = 'compact'"
        />

        <h6
          class="mt-4"
          :class="view === 'text' ? 'text-success' : ''"
        >
          {{ $t('board.list.views.text') }}
        </h6>

        <game-card-text
          :game-id="randomGameId"
          :list="list"
          :class="{ 'border-success': view === 'text'}"
          @click.native="view = 'text'"
        />
      </form>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardCovers from '@/components/GameCards/GameCardCovers';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardCompact from '@/components/GameCards/GameCardCompact';
import GameCardText from '@/components/GameCards/GameCardText';

export default {
  components: {
    GameCardDefault,
    GameCardCovers,
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
      randomGameId2: null,
      randomGameId3: null,
    };
  },

  computed: {
    ...mapState(['games']),
    ...mapGetters(['darkTheme']),

    modalId() {
      return `add-game-${this.listIndex}`;
    },
  },

  methods: {
    load() {
      this.randomGameId = this.getRandomGameId();
      this.randomGameId2 = this.getRandomGameId();
      this.randomGameId3 = this.getRandomGameId();
      this.getView();
    },

    getRandomGameId() {
      const { games } = this;
      const gameKeys = Object.keys(games);
      const randomNumber = Math.floor(Math.random() * gameKeys.length);
      const randomGame = games[gameKeys[randomNumber]];

      return randomGame.id;
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
.covers {
  display: grid;
  padding: .5rem .5rem 0;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: .5rem;
}
</style>
