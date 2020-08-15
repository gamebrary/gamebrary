<template lang="html">
  <b-dropdown-item v-b-modal:board-settings>
    <b-icon-kanban class="mr-1" />
    Board settings

    <b-modal
      id="board-settings"
      title="Board settings"
      hide-footer
      body-class="p-0"
      @shown="getSettings"
    >
      <b-list-group flush>

        <b-list-group-item>
          <wallpaper-upload />
        </b-list-group-item>

        <b-list-group-item>
          <label for="theme">Theme</label>
          <b-form-select
            id="theme"
          >
            <b-form-select-option
              v-for="{ id, name } in themes"
              :key="id"
              :value="id"
            >
              {{ name }}
            </b-form-select-option>
          </b-form-select>
        </b-list-group-item>

        <b-list-group-item>
          <b-button
            :title="$t('list.delete')"
            variant="danger"
            @click="promptDeleteBoard"
          >
            <i class="far fa-trash-alt" />
            Delete board
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import { mapState } from 'vuex';
import themes from '@/themes';
import WallpaperUpload from '@/components/WallpaperUpload';

export default {
  components: {
    WallpaperUpload,
  },

  data() {
    return {
      themes,
      saving: false,
    };
  },

  computed: {
    ...mapState(['user', 'platform', 'gameLists']),
  },

  methods: {
    getSettings() {
      // console.log('get settings bitdch!');
      // const { sortOrder } = this.gameLists[this.platform.code][this.listIndex];
      //
      // this.sortOrder = sortOrder || 'sortByCustom';
    },

    promptDeleteBoard() {
      this.$bvModal.msgBoxConfirm('All your data will be removed', {
        title: 'Are you sure you want to delete this board?',
        okVariant: 'danger',
        okTitle: 'Yes, delete board! Hahaha!',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard();
          }
        });
    },

    deleteBoard() {
      this.$store.commit('REMOVE_PLATFORM');

      this.$store.dispatch('SAVE_LIST_NO_MERGE', this.gameLists)
        .then(() => {
          this.$router.push({ name: 'platforms' });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    // async save() {
    //   this.saving = true;
    //
    //   const gameLists = JSON.parse(JSON.stringify(this.gameLists));
    //
    //   gameLists[this.platform.code][this.listIndex].sortOrder = this.sortOrder;
    //
    //   await this.$store.dispatch('SAVE_LIST', gameLists)
    //     .catch(() => {
    //       this.saving = false;
    //
    //       this.$bvToast.toast('There was an error renaming list', {
    //         title: 'Error',
    //         variant: 'danger',
    //       });
    //     });
    //
    //   this.saving = false;
    //
    //   this.$bvToast.toast('List renamed', {
    //     title: 'Saved',
    //     variant: 'success',
    //   });
    //
    //   this.$bvModal.hide('board-settings');
    // },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
