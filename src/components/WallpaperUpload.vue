<template>
  <b-list-group-item>
    <template v-if="wallpaperUrl">
      <h5>{{ $t('settings.wallpaper.wallpaper') }}</h5>

      <modal
        ref="addList"
        :title="$t('settings.wallpaper.currentWallpaper')"
        large
        action-text="Remove wallpaper"
        @action="removeWallpaper"
      >

        <b-img
          fluid
          v-if="wallpaperUrl"
          :src="wallpaperUrl"
          class="preview"
          alt="Uploaded wallpaper"
        />

        <div
          slot="content"
          class="wallpaper-preview"
        >
          <img
            fluid
            v-if="wallpaperUrl"
            :src="wallpaperUrl"
            alt="Uploaded wallpaper"
          >
        </div>
      </modal>
    </template>

    <template v-else>
      <h5>{{ $t('settings.wallpaper.title') }}</h5>

      <b-button @click="triggerUpload">
        <i
          v-if="loading"
          class="fas fa-sync-alt fast-spin"
        />
        <i
          v-else
          class="fas fa-cloud-upload-alt"
        />
        Upload file
      </b-button>

      <input
        ref="fileInput"
        hidden
        class="file-input"
        type="file"
        accept="image/*"
        @change="handleUpload"
      >
    </template>
  </b-list-group-item>
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
          this.$bvToast.toast('Settings saved', { title: 'Success', variant: 'success' });
          this.loading = false;
        })
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { title: 'Error', variant: 'danger' });
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
