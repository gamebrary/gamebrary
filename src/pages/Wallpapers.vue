<template lang="html">
  <!-- TODO: show space used -->
  <!-- TODO: allow to apply wallpaper to board from here -->
  <b-container class="pt-3">
    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />

    <empty-state
      v-if="showEmptyState"
      :title="$t('wallpapers.title')"
      message="Upload a wallpaper to customize your boards"
      action-text="Upload a wallpaper"
      :busy="saving"
      @action="triggerFileUpload"
    />

    <template v-else>
      <!-- TODO: translate "browse" -->
      <!-- TODO: add skeleton -->
      <!-- TODO: add progress bar -->
      <!-- TODO: sort by -->
      <!-- TODO: add wallpaper preview carousel -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">
          <b-button
            size="sm"
            :variant="nightMode ? 'dark' : 'light'"
            @click="$router.push({ name: 'settings' })"
          >
            <icon name="chevron-left" />
          </b-button>

          {{ $t('wallpapers.title') }}
        </h3>

        <b-button
          variant="primary"
          @click="triggerFileUpload"
        >
          <b-spinner
            small
            v-if="saving"
          />
          <span v-else>
            {{ $t('wallpapers.form.label') }}
          </span>
        </b-button>
      </div>

      <b-alert
        v-if="isDuplicate && !saving && file && file.name"
        show
        dismissible
        variant="warning"
      >
        {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
      </b-alert>

      <!-- <h5>{{ $t('wallpapers.list.title') }}</h5> -->

      <!-- <small class="d-block text-center">{{ formattedSpaceUsed }} of 64MB used</small> -->
      <!-- <b-progress :value="spaceUsed" max="67108864" variant="success" class="mb-3" /> -->

      <b-card
        v-if="wallpapers.length"
        v-for="wallpaper in wallpapers"
        :key="wallpaper.name"
        :img-src="wallpaper.url"
        :img-alt="wallpaper.name"
        img-left
        img-width="180"
        class="mb-3 overflow-hidden word-wrap"
      >
        <h6>
          {{ wallpaper.name }}

          <b-badge v-if="wallpaper.metadata">
            {{ bytesToSize(wallpaper.metadata.size) }}
          </b-badge>
        </h6>

        <b-button
          variant="danger"
          size="sm"
          @click="confirmDeleteWallpaper(wallpaper)"
        >
          <icon name="trash" white />
        </b-button>
      </b-card>

      <b-alert show v-else>You don't have any wallpapers.</b-alert>
    </template>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

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

    showEmptyState() {
      return this.wallpapers.length === 0;
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

    // spaceUsed() {
    //   return this.wallpapers.reduce((total, file) => total + file.metadata.size, 0);
    // },
  },

  methods: {
    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },

    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (bytes === 0) return '0 Byte';

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);

      return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
    },

    uploadWallpaper() {
      if (this.isDuplicate) {
        return this.$bvToast.toast('File already exists', { variant: 'warning' });
      }

      if (!this.file) {
        return false;
      }

      this.saving = true;

      return this.$store.dispatch('UPLOAD_WALLPAPER', this.file)
        .then(() => {
          this.$bvToast.toast('File uploaded');
          this.file = null;
          this.saving = false;
          this.$bus.$emit('WALLPAPER_UPLOADED');
        })
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
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
          this.$bvToast.toast('There was an error deleting wallpaper', { variant: 'danger' });
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
