<template lang="html">
  <modal
    v-if="activeList"
    ref="listSettingsModal"
    :title="$t('list.preferences')"
    @open="open"
    @close="close"
  >
    <button class="small">
      <i class="fas fa-sliders-h" />
    </button>

    <div
      v-if="localList"
      slot="content"
      class="list-settings"
    >
      <section>
        <h4>List name</h4>

        <input ref="input" v-model="localList.name">
      </section>

      <section>
        <h4>{{ $t('list.view') }}</h4>

        <div class="checkbox-group">
          <span v-for="(icon, view) in views" :key="view">
            <label :for="view" :class="{ active: view === localList.view }">
              <i :class="icon" />
              {{ $t(`list.views.${view}`) }}
            </label>

            <input
              :id="view"
              :value="view"
              v-model="localList.view"
              type="radio"
            >
          </span>
        </div>
      </section>

      <section v-if="hasMultipleGames">
        <h4>{{ $t('list.sortList') }}</h4>

        <div class="checkbox-group">
          <span
            v-for="(icon, sortOrder) in sortOrders"
            :key="sortOrder"
          >
            <label
              :for="sortOrder"
              :class="{ active: sortOrder === localList.sortOrder }"
            >
              <i :class="icon" />
              {{ $t(`list.${sortOrder}`) }}
            </label>

            <input
              :id="sortOrder"
              :value="sortOrder"
              v-model="localList.sortOrder"
              type="radio"
            >
          </span>
        </div>
      </section>

      <footer>
        <modal
          v-if="localList && localList.games && localList.games.length"
          ref="addList"
          :message="warningMessage"
          :action-text="$t('list.delete')"
          title="Are you sure?"
          action-button-class="danger"
          @action="deleteList"
        >
          <button
            :title="$t('list.delete')"
            class="danger"
          >
            <i class="far fa-trash-alt" />
            {{ $t('list.delete') }}
          </button>
        </modal>

        <button
          v-else
          :title="$t('list.delete')"
          class="danger"
          @click="deleteList"
        >
          <i class="far fa-trash-alt" />
          {{ $t('list.delete') }}
        </button>

        <!-- <button
class="primary hollow"
:title="$t('list.moveLeft')"
:disabled="isFirst"
@click="moveList(listIndex, listIndex - 1)"
>
<i class="fas fa-arrow-left" />

{{ $t('list.moveLeft') }}
</button>

<button
class="primary hollow"
:title="$t('list.moveRight')"
:disabled="isLast"
@click="moveList(listIndex, listIndex + 1)"
>
{{ $t('list.moveRight') }}
<i class="fas fa-arrow-right" />
</button> -->

        <button
          :title="$t('global.save')"
          class="primary"
          @click="save"
        >
          {{ $t('global.save') }}
        </button>
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
      views: {
        single: 'fas fa-square',
        grid: 'fas fa-th-large',
        wide: 'fas fa-minus',
        text: 'fas fa-font',
      },
      sortOrders: {
        sortByName: 'fas fa-sort-alpha-down',
        sortByRating: 'fas fa-star',
        sortByCustom: 'fas fa-user',
      },
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
      const gameLists = JSON.parse(JSON.stringify(this.gameLists));

      gameLists[this.platform.code][this.listIndex] = this.localList;

      this.$store.dispatch('SAVE_LIST', gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'List saved' });
          this.$refs.listSettingsModal.close();
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    // moveList(from, to) {
    //     this.$store.commit('MOVE_LIST', { from, to });
    //     // this.save();
    // },

    open() {
      this.localList = JSON.parse(JSON.stringify(this.activeList));
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
    margin-bottom: $gp;
  }

  h4 {
    margin-bottom: $gp / 2;
  }

  footer {
    display: flex;
    justify-content: space-between;
  }
</style>
