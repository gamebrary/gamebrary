<template lang="html">
  <modal
    v-if="activeList"
    ref="listSettingsModal"
    :title="$t('list.settings')"
    @open="open"
    @close="close"
  >
    <b-button size="sm" variant="link">
      <i class="fas fa-cog" />
    </b-button>

    <div
      v-if="localList"
      slot="content"
      class="list-settings"
    >
      <section>
        <h4>List name</h4>

        <b-form-input ref="input" v-model="localList.name" />

        <b-button
          :title="$t('global.save')"
          @click="save"
        >
          {{ $t('global.save') }}
        </b-button>
      </section>

      <!-- <b-form-group :label="$t(list.view)">
        <b-form-radio-group
          v-model="localList.view"
          buttons
          variant="primary"
          :options="listViews"
          @change="save"
        />
      </b-form-group> -->

      <h4>{{ $t('list.view') }}</h4>

      <div class="checkbox-group">
          <span v-for="view in listViews" :key="view">
              <input
                  :value="view.value"
                  v-model="localList.view"
                  @change="save"
                  type="radio"
              >
          </span>
      </div>

      <b-form-group :label="$t('list.sortList')" v-if="hasMultipleGames">
        <b-form-radio-group
          v-model="localList.sortOrder"
          buttons
          variant="primary"
          :options="sortingOptions"
          @change="save"
        />
      </b-form-group>

      <b-form-checkbox
        v-if="localList.view === 'grid'"
        switch
        v-model="localList.hideGameInfo"
        @change="save"
      >
        Compact grid view
      </b-form-checkbox>

      <b-form-checkbox
        v-if="localList.view === 'grid' || localList.view === 'masonry'"
        switch
        v-model="localList.hideGameInfoOnCover"
        :disabled="!localList.hideGameInfo"
        @change="save"
      >
        Hide game info on top of game covers
      </b-form-checkbox>

      <section>
        <h4>Move list</h4>

        <b-button
          :title="$t('list.moveLeft')"
          :disabled="isFirst"
          @click="moveList(listIndex, listIndex - 1)"
        >
          <i class="fas fa-arrow-left" />

          {{ $t('list.moveLeft') }}
        </b-button>

        <b-button
          :title="$t('list.moveRight')"
          :disabled="isLast"
          @click="moveList(listIndex, listIndex + 1)"
        >
          {{ $t('list.moveRight') }}
          <i class="fas fa-arrow-right" />
        </b-button>
      </section>

      <b-form-checkbox
        switch
        v-model="localList.hideGameRatings"
        :disabled="localList.view === 'masonry'"
        @change="save"
      >
        Hide game ratings
      </b-form-checkbox>

      <b-form-checkbox
        switch
        v-model="localList.hideReleaseDates"
        @change="save"
      >
        Hide days until release
      </b-form-checkbox>

      <footer>
        <modal
          v-if="localList && localList.games && localList.games.length"
          :message="warningMessage"
          :action-text="$t('list.delete')"
          title="Are you sure?"
          action-button-class="danger"
          @action="deleteList"
        >
          <b-button
            :title="$t('list.delete')"
            variant="danger"
          >
            <i class="far fa-trash-alt" />
            {{ $t('list.delete') }}
          </b-button>
        </modal>

        <b-button
          v-else
          :title="$t('list.delete')"
          variant="danger"
          @click="deleteList"
        >
          <i class="far fa-trash-alt" />
          {{ $t('list.delete') }}
        </b-button>
      </footer>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
  },

  props: {
    listIndex: {
      type: [Number, String, Boolean],
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      localList: null,
      listViews: [
        { text: 'Single', value: 'single' },
        { text: 'Masonry', value: 'masonry' },
        { text: 'Grid', value: 'grid' },
        { text: 'Compact', value: 'compact' },
        { text: 'Text', value: 'text' },
      ],
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
    ...mapState(['user', 'gameLists', 'platform']),

    isFirst() {
      return this.listIndex === 0;
    },

    activeList() {
      return this.gameLists[this.platform.code][this.listIndex];
    },

    isLast() {
      const lastListIndex = Object.keys(this.gameLists[this.platform.code]).length - 1;

      return this.listIndex === lastListIndex;
    },

    hasMultipleGames() {
      return this.activeList.games.length > 1;
    },

    disableSave() {
      return this.localList.name === this.activeList.name;
    },

    warningMessage() {
      const gameCount = this.activeList.games.length;

      return `This list contains ${gameCount} games, all games will be deleted as well.`;
    },
  },

  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.activeList));
  },

  methods: {
    deleteList() {
      this.$store.commit('REMOVE_LIST', this.listIndex);

      this.$store.dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'List deleted' });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    save() {
      // TODO: use mutations instead of this logic here, have action save whatever is in store
      const gameLists = JSON.parse(JSON.stringify(this.gameLists));

      gameLists[this.platform.code][this.listIndex] = this.localList;

      setTimeout(() => {
        this.$store.dispatch('SAVE_LIST', gameLists)
          .then(() => {
            this.$bus.$emit('TOAST', { message: 'List saved' });
          })
          .catch(() => {
            this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
            this.$router.push({ name: 'sessionExpired' });
          });
      }, 500);
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST', { from, to });

      await this.$store.dispatch('SAVE_LIST', this.gameLists)
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'List saved' });
    },

    open() {
      this.localList = JSON.parse(JSON.stringify(this.activeList));

      if (this.open) {
        this.focusInput();
      }
    },

    focusInput() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 100);
    },

    close() {
      this.localList = null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  section {
    margin-bottom: 2rem;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  h4 {
    margin-bottom: .5rem;
  }

  footer {
    border-top: 1px solid var(--modal-text-color);
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
  }
</style>
