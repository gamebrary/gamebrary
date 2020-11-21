<template lang="html">
  <!-- TODO: show space used -->
  <!-- TODO: allow to apply wallpaper to board from here -->
  <b-container class="pt-2">
    <!-- TODO: translate "browse" -->
    <!-- TODO: add skeleton -->
    <!-- TODO: add progress bar -->
    <!-- TODO: sort by -->
    <div class="d-flex justify-content-between align-items-center">
      <h2>{{ $t('wallpapers.title') }}</h2>

      <b-button
        variant="primary"
        @click="uploadWallpaper"
      >
        {{ $t('wallpapers.form.label') }}
      </b-button>
    </div>

    <b-form-file
      class="d-none"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />

    <b-alert v-if="isDuplicate && !saving && file && file.name" show variant="warning">
      {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
    </b-alert>

    <!-- <h5>{{ $t('wallpapers.list.title') }}</h5> -->

    <small class="d-block text-center">{{ formattedSpaceUsed }} of 64MB used</small>
    <b-progress :value="spaceUsed" max="67108864" variant="success" class="mb-3" />

    <b-card
      v-if="wallpapers.length"
      v-for="wallpaper in wallpapers"
      :key="wallpaper.name"
      :img-src="wallpaper.url"
      :img-alt="wallpaper.name"
      img-left
      img-width="180"
      class="mb-3"
    >
      <p>{{ wallpaper.name }} <b-badge>{{ bytesToSize(wallpaper.metadata.size) }}</b-badge></p>

      <b-button
        variant="danger"
        size="sm"
        @click="confirmDeleteWallpaper(wallpaper)"
      >
        <icon name="trash" white />
      </b-button>
    </b-card>

    <b-alert show v-else>You don't have any wallpapers.</b-alert>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      file: null,
      saving: false,
      loading: false,
      isPaid: true,
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),
    ...mapGetters(['nightMode']),

    existingFiles() {
      return this.wallpapers.map(({ name }) => name);
    },

    isDuplicate() {
      const { file, existingFiles } = this;

      return file && file.name && existingFiles.includes(file.name);
    },

    formattedSpaceUsed() {
      return this.spaceUsed
        ? this.bytesToSize(this.spaceUsed)
        : null;
    },

    spaceUsed() {
      return this.wallpapers.reduce((total, file) => total + file.metadata.size, 0);
    },
  },

  methods: {
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (bytes === 0) return '0 Byte';

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

      return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
    },

    uploadWallpaper() {
      if (this.isDuplicate) {
        return this.$bvToast.toast('File already exists', { title: '!', variant: 'warning' });
      }

      if (!this.file) {
        return false;
      }

      this.saving = true;

      return this.$store.dispatch('UPLOAD_WALLPAPER', this.file)
        .then(() => {
          this.$bvToast.toast('File uploaded', { title: 'Success', variant: 'success' });
          this.file = null;
          this.saving = false;
          this.$bus.$emit('WALLPAPER_UPLOADED');
        })
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error uploading wallpaper', { title: 'Error', variant: 'danger' });
        });
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
