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

      <b-form-group :label="$t('list.sortList')" v-if="hasMultipleGames">
        <b-form-radio-group
          v-model="localList.sortOrder"
          buttons
          variant="primary"
          :options="sortingOptions"
          @change="save"
        />
      </b-form-group>

      <section v-if="localList.view === 'grid'">
        <h4>Compact grid view</h4>

        <toggle-switch
          id="gameInfo"
          @change="save"
          v-model="localList.hideGameInfo"
        />
      </section>

      <section
        :class="{disabled: !localList.hideGameInfo }"
        v-if="localList.view === 'grid' || localList.view === 'masonry'"
      >
        <h4>Hide game info on top of game covers</h4>

        <toggle-switch
          id="hideGameInfoOnCover"
          @change="save"
          v-model="localList.hideGameInfoOnCover"
        />
      </section>

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

      <section :class="{ disabled: localList.view === 'masonry' }">
        <h4>Hide game ratings</h4>

        <toggle-switch
          id="gameRatings"
          @change="save"
          v-model="localList.hideGameRatings"
        />
      </section>

      <section>
        <h4>Hide days until release</h4>

        <toggle-switch
          id="releaseDates"
          @change="save"
          v-model="localList.hideReleaseDates"
        />
      </section>

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
import ToggleSwitch from '@/components/ToggleSwitch';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
    ToggleSwitch,
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
        { text: 'single', value: 'single' },
        { text: 'masonry', value: 'masonry' },
        { text: 'grid', value: 'grid' },
        { text: 'compact', value: 'compact' },
        { text: 'text', value: 'text' },
      ],
      sortingOptions: [
        { text: 'sortByName', value: 'sortByName' },
        { text: 'sortByRating', value: 'sortByRating' },
        { text: 'sortByReleaseDate', value: 'sortByReleaseDate' },
        { text: 'sortByProgress', value: 'sortByProgress' },
        { text: 'sortByCustom', value: 'sortByCustom' },
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
  @import "~styles/styles";

  section {
    margin-bottom: $gp * 2;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  h4 {
    margin-bottom: $gp / 2;
  }

  footer {
    border-top: 1px solid var(--modal-text-color);
    padding-top: $gp * 2;
    display: flex;
    justify-content: space-between;
  }
</style>
