<template lang="html">
  <b-container>
    <empty-state
      v-if="showEmptyState"
      :title="$t('wallpapers.title')"
      message="Upload a wallpaper to customize your boards"
      action-text="Upload a wallpaper"
      :busy="saving"
      @action="triggerFileUpload"
    />

    <template v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">
          {{ $t('wallpapers.title') }}
        </h3>

        <div class="space-used ml-auto mr-3 pt-3">
          <small class="d-block text-center" :class="{ 'text-danger': outOfSpace }">
            {{ formattedSpaceUsed }} of {{ bytesToSize(maxSpace) }} used
          </small>

          <b-progress
            :value="spaceUsed"
            :max="maxSpace"
            :variant="outOfSpace ? 'danger' : 'success'"
            class="mb-3"
          />
        </div>

        <b-button
          variant="primary"
          :disabled="outOfSpace"
          @click="triggerFileUpload"
        >
          <b-spinner small v-if="saving" />

          <template v-else>
            <i class="fas fa-upload fa-fw" aria-hidden />
            <span class="d-none d-sm-inline">Upload</span>
          </template>
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

      <div
        v-if="wallpapers.length"
        class="wallpapers"
      >
        <b-card
          v-for="wallpaper in wallpapers"
          :key="wallpaper.name"
          :img-src="wallpaper.url"
          :img-alt="wallpaper.name"
          img-top
          bg-variant="transparent"
          img-width="180"
          class="mb-3 overflow-hidden word-wrap"
        >
          <h6>
            {{ wallpaper.name }}

            <b-badge v-if="wallpaper.metadata && wallpaper.metadata.size">
              {{ bytesToSize(wallpaper.metadata.size) }}
            </b-badge>
          </h6>

          <b-button
            variant="danger"
            size="sm"
            @click="confirmDeleteWallpaper(wallpaper)"
          >
            <i class="fas fa-trash-alt fa-fw" aria-hidden />
          </b-button>
        </b-card>
      </div>

      <b-alert show v-else>You don't have any wallpapers.</b-alert>
    </template>

    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />
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
      maxSpace: '67108864', // 64mb storage limit
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

    spaceUsed() {
      return this.wallpapers.reduce((total, file) => total + file.metadata.size || 0, 0);
    },

    outOfSpace() {
      return this.spaceUsed >= this.maxSpace;
    },
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

      this.$bvToast.toast('File deleted');

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

.space-used {
  width: 120px;
}

.wallpapers {
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  @media(max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media(max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
