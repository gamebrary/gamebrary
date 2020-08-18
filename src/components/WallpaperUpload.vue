<template>
  <b-list-group-item>
    <h5>{{ $t('settings.wallpaper.wallpaper') }}</h5>

    <template v-if="wallpaperUrl">
      <b-img
        fluid
        :src="wallpaperUrl"
        class="mb-2"
        alt="Uploaded wallpaper"
      />

      <b-button @click="removeWallpaper" variant="outline-danger">
        <b-icon-trash />
      </b-button>
    </template>

    <template v-else>
      <b-button @click="triggerUpload">
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
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapState } from 'vuex';

export default {
  components: {
  },

  data() {
    return {
      file: File,
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
      // TODO: delete file in firestore
      delete this.wallpapers[this.platform.code].url;

      this.saveSettings();
    },

    saveSettings() {
      const settings = {
        ...this.settings,
        wallpapers: this.wallpapers,
      };

      this.$store.dispatch('SAVE_SETTINGS_LEGACY', settings)
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
            // TODO use this.$set instead
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
