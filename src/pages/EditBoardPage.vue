<!-- TODO: Clone board -->
<!-- TODO: like/favorite board -->
<!-- TODO: Fork board -->
<!-- TODO: refactor platforms and wallpapers -->
<!-- TODO: add board preview-->
<!-- TODO: use board placeholder for preview / disable placeholder animation -->
<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'board', params: { id: board.id } }"
          variant="light"
          class="mr-2"
        >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Edit board
      </div>
    </portal>

    <b-row>
      <b-col>
        <form
          ref="boardSettingsForm"
          class="field"
          @submit.stop.prevent="saveSettings"
        >
          <b-form-group
            :label="$t('board.settings.nameLabel')"
            label-for="name"
          >
            <b-form-input
              id="name"
              v-model="name"
              required
            />
          </b-form-group>

          <b-form-group
            :label="$t('board.settings.descriptionLabel')"
            label-for="description"
          >
            <b-form-textarea
              id="description"
              v-model="description"
              maxlength="280"
              rows="3"
            />
          </b-form-group>

          <b-form-checkbox v-model="isPublic" switch class="mb-2">
            Make board public (beta)
          </b-form-checkbox>

          <b-alert show variant="info" v-if="isPublic" class="m-0 text-truncate">
            <strong>Public Board URL</strong>
            <br>
            <small>{{ `https://app.gamebrary.com/#/b/${board.id}` }}</small>
          </b-alert>

          <hr class="my-3">

          <edit-board-background-modal />

          <b-button v-b-modal.boardBackground>
            <i class="fas fa-images fa-fw" aria-hidden />
            <br />
            Change background
          </b-button>

          <hr class="my-3">

          <!-- <b-button
            variant="primary"
            :disabled="saving"
            @click="saveSettings"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button> -->

          <!-- <b-alert :show="noPlatformsSelected" variant="warning">
            No platforms selected, game search will include all platforms.
          </b-alert>

          <b-alert :show="noPlatformsSelected" variant="success">
            Select platforms to limit search results.
          </b-alert> -->

          <!-- <platform-picker v-model="platforms" /> -->
          <!-- <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
            <b-button-group class="mx-1">
              <b-button>New</b-button>
              <b-button>Edit</b-button>
              <b-button>Undo</b-button>
            </b-button-group>
            <b-dropdown class="mx-1" right text="menu">
              <b-dropdown-item>Item 1</b-dropdown-item>
              <b-dropdown-item>Item 2</b-dropdown-item>
              <b-dropdown-item>Item 3</b-dropdown-item>
            </b-dropdown>
            <b-button-group class="mx-1">
              <b-button>Save</b-button>
              <b-button>Cancel</b-button>
            </b-button-group>
          </b-button-toolbar> -->

          <!-- <div class="d-flex mb-2">
            <div class="filter mr-2">
              <small class="d-block text-muted">Show:</small>
              <b-button size="sm">All</b-button>
              <b-button size="sm">Consoles</b-button>
              <b-button size="sm">Handhelds</b-button>
              <b-button size="sm">PC</b-button>
            </div>

            <div class="sort">
              <small class="d-block text-muted">Sort by:</small>
              <b-button size="sm">All</b-button>
              <b-button size="sm">All</b-button>
              <b-button size="sm">All</b-button>
            </div>
          </div> -->
          <!-- <b-form-group
            label="Stacked (vertical) switch style checkboxes"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              v-model="selected"
              :options="options"
              :aria-describedby="ariaDescribedby"
              switches
              stacked
            />
          </b-form-group> -->

          <!-- <b-dropdown
            text="Select platforms"
            class="platforms-dropdown"
          >
            <b-dropdown-item
              v-for="platform in platforms"
              :key="platform.id"
            >
              {{ platform.name }}
            </b-dropdown-item>
          </b-dropdown> -->


          <!-- <b-button
            v-for="platform in sortedPlatforms"
            :variant="value.includes(platform.id) ? 'primary' : 'dark'"
            :key="platform.id"
          >
            <small :class="value.includes(platform.id) ? '' : 'text-muted'">
              {{ platform.name }}
            </small>
          </b-button> -->

          <b-button
            variant="primary"
            :disabled="saving"
            type="submit"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>

          <b-button
            variant="link"
            @click="confirmDelete"
          >
            {{ $t('board.settings.deleteBoard') }}
          </b-button>
        </form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EditBoardBackgroundModal from '@/components/Board/EditBoardBackgroundModal';
// import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import orderby from 'lodash.orderby';

export default {
  components: {
    // BoardPlaceholder,
    EditBoardBackgroundModal,
  },

  data() {
    return {
      saving: false,
      description: null,
      isPublic: false,
      name: null,
      selectedPlatforms: [],
      // platforms: [],
      theme: null,
    };
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['platforms']),

    noPlatformsSelected() {
      return this.platforms.length === 0;
    },


    buttonLabel() {
      return this.value.length
        ? this.$t('board.settings.platformLabel', { platformCount: this.value.length })
        : this.$t('board.settings.platformPlaceholder');
    },

    sortedPlatforms() {
      const sortedPlatforms = orderby(this.platforms, ['popular', 'generation']);

      return sortedPlatforms.reverse();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    goToBoard() {
      this.$router.push({ name: 'board', params: { id: this.$route.params.id } });
    },

    async init() {
      // TODO: load board if cached board id does not match route board id
      const { board } = this;
      this.description = board.description;
      this.name = board.name;
      this.selectedPlatforms = board.platforms;
      this.isPublic = board.isPublic || false;
      this.theme = board.theme || 'default';
    },

    confirmDelete() {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        okTitle: 'Yes, delete board',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard();
          }
        });
    },

    async deleteBoard() {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', this.board.id)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
      this.$router.push({ name: 'home' });
    },

    async saveSettings() {
      this.saving = true;

      const { board } = this;

      const payload = {
        ...board,
        description: this.description,
        name: this.name,
        // platforms: this.platforms,
        isPublic: this.isPublic,
        theme: this.theme,
      };

      console.log(payload);

      this.$store.commit('SET_ACTIVE_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch((e) => {
          console.log(e);
          this.saving = false;

          this.$bvToast.toast('There was an saving board settings', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Board settings saved');
      // TODO: route back to board
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.platforms-dropdown .dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
