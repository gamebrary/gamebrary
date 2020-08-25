<template lang="html">
  <b-dropdown-item v-b-modal:file-settings>
    <b-icon-tags class="mr-1" />
    Manage files

    <b-modal
      id="file-settings"
      title="Manage Files"
      hide-footer
      size="xl"
      @show="loadWallpapers"
    >
      <h5>Wallpapers</h5>

      <b-form-file
        v-model="file"
        accept="image/*"
        class="mb-3"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      />

      <b-button @click="uploadFile" :disabled="!Boolean(file)">
        Upload
      </b-button>

      <hr>


      Files
      <div class="wallpapers">
        <b-card
          v-for="(file, index) in wallpapers"
          :key="file.name"
          :header="file.name"
          header-class="py-0 px-2"
          body-class="d-flex p-0 text-center justify-content-center align-items-center"
          header-tag="small"
        >
          <b-img
            :src="file.url"
            :alt="file.name"
            fluid
          />

          <b-button
            class="delete-file"
            variant="danger"
            size="sm"
            @click="confirmDeleteFile({ file, index })"
          >
            <b-icon-trash />
          </b-button>
        </b-card>
      </div>
    </b-modal>
  </b-dropdown-item>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      file: null,
      saving: false,
      loading: false,
      wallpapers: [],
    };
  },

  computed: {
    ...mapState(['user', 'board']),
  },

  methods: {
    async loadWallpapers() {
      this.wallpapers = [];
      this.loading = true;

      const files = await this.$store.dispatch('LOAD_WALLPAPERS');

      // TODO: use promise all instead
      files.forEach(async (path) => {
        const url = await this.$store.dispatch('LOAD_FIRESTORE_FILE', path);

        const name = path.split(`${this.user.uid}/wallpapers/`)[1];

        this.wallpapers.push({ name, url, path });
      });
    },

    uploadFile() {
      const { file, user } = this;

      this.saving = true;

      firebase.storage().ref(`${user.uid}/wallpapers/${file.name}`).put(file)
        .then(({ state }) => {
          if (state === 'success') {
            this.$bvToast.toast(file.name, { title: 'File uploaded', variant: 'success' });
          }
        });
    },

    confirmDeleteFile({ file, index }) {
      this.$bvModal.msgBoxConfirm(`${file.name} will be permanently removed`, {
        title: 'Are you sure you want to delete this file?',
        okVariant: 'danger',
        okTitle: 'Yes',
      })
        .then((value) => {
          if (value) {
            this.deleteFile({ file, index });
          }
        });
    },

    async deleteFile({ file, index }) {
      await this.$store.dispatch('DELETE_FIRESTORE_FILE', file.path);

      this.$bvToast.toast(file.name, { title: 'File deleted', variant: 'success' });

      this.wallpapers.splice(index, 1);

      if (this.board && this.board.wallpaper && this.board.wallpaper === file.path) {
        this.$bus.$emit('RELOAD_WALLPAPER');
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wallpapers {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;

  img {
    max-height: 140px;
  }

  .delete-file {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>
