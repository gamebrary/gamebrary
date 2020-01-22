<!-- TODO: refactor to live in platform settings -->
<template>
  <div class="setting wallpaper-upload">
    <template v-if="wallpaperUrl">
      <div class="current-wallpaper">
        <i class="far fa-image" />
        <h5>{{ $t('settings.wallpaper.wallpaper') }}</h5>
      </div>

      <div/>

      <div>
        <modal
          ref="addList"
          :title="$t('settings.wallpaper.currentWallpaper')"
          large
          action-text="Remove wallpaper"
          @action="removeWallpaper"
        >
          <img
            v-if="wallpaperUrl"
            :src="wallpaperUrl"
            class="preview"
            alt="Uploaded wallpaper"
          >

          <div
            slot="content"
            class="wallpaper-preview"
          >
            <img
              v-if="wallpaperUrl"
              :src="wallpaperUrl"
              alt="Uploaded wallpaper"
            >
          </div>
        </modal>
      </div>
    </template>

    <template v-else>
      <i class="far fa-image" />
      <h5>{{ $t('settings.wallpaper.title') }}</h5>

      <button
        class="primary small"
        @click="triggerUpload"
      >
        <i
          v-if="loading"
          class="fas fa-sync-alt fast-spin"
        />
        <i
          v-else
          class="fas fa-cloud-upload-alt"
        />
        Upload file
      </button>

      <input
        ref="fileInput"
        hidden
        class="file-input"
        type="file"
        accept="image/*"
        @change="handleUpload"
      >
    </template>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      progressUpload: 0,
      file: File,
      uploadTask: '',
      wallpapers: {},
      loading: false,
    };
  },

  computed: {
    ...mapState(['user', 'settings', 'platform', 'wallpaperUrl']),
  },

  mounted() {
    this.wallpapers = this.settings && this.settings.wallpapers
      ? JSON.parse(JSON.stringify(this.settings.wallpapers))
      : {};

    if (!this.wallpapers[this.platform.code]) {
      this.wallpapers[this.platform.code] = {};
    }
  },

  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },

    removeWallpaper() {
      delete this.wallpapers[this.platform.code].url;

      this.saveSettings();
    },

    saveSettings() {
      const settings = {
        ...this.settings,
        wallpapers: this.wallpapers,
      };

      this.$store.dispatch('SAVE_SETTINGS', settings)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'Settings saved' });
          this.loading = false;
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'There was an error saving your settings', type: 'error' });
          this.loading = false;
        });
    },

    handleUpload(e) {
      this.loading = true;
      const file = e.target.files[0];
      const extenstion = file.name.split('.')[1];

      firebase.storage().ref(`${this.user.uid}/wallpapers/${this.platform.code}.${extenstion}`).put(file)
        .then(({ state, metadata }) => {
          if (state === 'success') {
            if (!this.wallpapers[this.platform.code]) {
              this.wallpapers[this.platform.code] = {};
            }

            this.wallpapers[this.platform.code].url = metadata.fullPath;

            this.saveSettings({
              ...this.settings,
              wallpapers: this.wallpapers,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  img.preview {
    max-width: 100px;
    cursor: pointer;
    height: auto;
    border: 1px solid transparent;
    border-radius: var(--border-radius);

    &:hover {
      border-color: var(--accent-color);
    }
  }

  .current-wallpaper {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: $gp / 2;
    margin-right: $gp;
  }

  .file-input {
    display: none;
  }

  .wallpaper-preview {

    img {
      width: 100%;
    }
  }

  .remove-wallpaper {
    position: absolute;
    right: 36px;
    margin-top: 4px;
    width: 20px;
  }
</style>
