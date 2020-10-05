<template lang="html">
  <div>
    <b-jumbotron
      :header="$t('wallpapers.title')"
      :lead="$t('wallpapers.subtitle')"
      header-level="5"
      fluid
    />
    <!-- TODO: show space used -->
    <!-- TODO: allow to apply wallpaper to board from here -->
    <b-container>
      <!-- TODO: convert to form -->
      <!-- TODO: translate "browse" -->
      <!-- TODO: display file names -->
      <b-row class="mb-3">
        <b-col cols="12" lg="6">
          <b-form-group
            :label="$t('wallpapers.form.label')"
            :description="$t('wallpapers.form.helperText')"
          >
            <b-form-file
              v-model="file"
              accept="image/*"
              :placeholder="$t('wallpapers.form.placeholder')"
            />
          </b-form-group>

          <b-alert v-if="isDuplicate && !saving" show variant="warning">
            {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
          </b-alert>

          <b-button
            @click="uploadWallpaper"
            variant="primary"
            :disabled="!Boolean(file) || saving || isDuplicate"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('wallpapers.form.upload') }}</span>
          </b-button>
        </b-col>
      </b-row>

      <b-form-row v-if="wallpapers.length">
        <b-col cols="12">
          <h5>{{ $t('wallpapers.list.title') }}</h5>
        </b-col>

        <b-col
          v-for="wallpaper in wallpapers"
          :key="wallpaper.name"
          cols="6"
          sm="4"
          lg="3"
        >
          <b-card
            class="mb-2"
            header-class="py-0 px-2"
            body-class="d-flex p-0 text-center justify-content-center align-items-center"
            header-tag="small"
          >
            <b-img
              :src="wallpaper.url"
              :alt="wallpaper.name"
              fluid
            />

            <b-button
              class="position-absolute delete-file"
              variant="danger"
              size="sm"
              @click="confirmDeleteWallpaper(wallpaper)"
            >
              <b-icon-trash />
            </b-button>
          </b-card>
        </b-col>
      </b-form-row>

      <b-alert show v-else>You don't have any wallpapers.</b-alert>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      file: null,
      saving: false,
      loading: false,
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),

    existingFiles() {
      return this.wallpapers.map(({ name }) => name);
    },

    isDuplicate() {
      const { file, existingFiles } = this;

      return file && file.name && existingFiles.includes(file.name);
    },
  },

  methods: {
    async uploadWallpaper() {
      const { file } = this;
      this.saving = true;

      await this.$store.dispatch('UPLOAD_WALLPAPER', file)
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error uploading wallpaper', { title: 'Error', variant: 'danger' });
        });

      this.file = null;
      this.saving = false;
      this.$bvToast.toast(file.name, { title: 'File uploaded', variant: 'success' });
      this.$bus.$emit('WALLPAPER_UPLOADED');
    },

    confirmDeleteWallpaper(file) {
      this.$bvModal.msgBoxConfirm('Wallpaper will be permanently removed', {
        title: 'Are you sure you want to delete this file?',
        okVariant: 'danger',
        okTitle: 'Yes',
      })
        .then((value) => {
          if (value) {
            this.deleteFile(file);
          }
        });
    },

    async deleteFile(file) {
      await this.$store.dispatch('DELETE_WALLPAPER', file)
        .catch(() => {
          this.$bvToast.toast('There was an error deleting wallpaper', { title: 'Error', variant: 'danger' });
        });

      this.$bvToast.toast(file.name, { title: 'File deleted', variant: 'success' });

      // const { board } = this;
      // TODO: handle wallpapers in use
      // if (board.wallpaper && this.board.wallpaper === file.path) {
      //   this.$bus.$emit('RELOAD_WALLPAPER');
      // }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.delete-file {
  bottom: .5rem;
  right: .5rem;
}
</style>
