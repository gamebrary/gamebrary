<template>
    <div class="setting wallpaper-upload">
        <template v-if="wallpaperUrl">
            <div class="current-wallpaper">
                <i class="far fa-image" />
                <h5>{{ $t('settings.wallpaper.currentWallpaper') }}</h5>
            </div>

            <div></div>

            <div>
                <modal
                    ref="addList"
                    :title="$t('settings.wallpaper.currentWallpaper')"
                    large
                    padded
                    action-text="Remove wallpaper"
                    @action="removeWallpaper"
                >
                    <img
                        v-if="wallpaperUrl"
                        class="preview"
                        :src="wallpaperUrl"
                        alt="Uploaded wallpaper"
                    />

                    <div slot="content" class="wallpaper-preview">
                        <img
                            v-if="wallpaperUrl"
                            :src="wallpaperUrl"
                            alt="Uploaded wallpaper"
                        />
                    </div>
                </modal>
            </div>
        </template>

        <template v-else>
            <i class="far fa-image" />
            <h5>{{ $t('settings.wallpaper.title') }}</h5>

            <button class="primary small" @click="triggerUpload">
                <i class="fas fa-sync-alt fast-spin" v-if="loading" />
                <i class="fas fa-cloud-upload-alt" v-else />
                Upload file
            </button>

            <input
                hidden
                class="file-input"
                ref="fileInput"
                type="file"
                accept='image/*'
                @change="handleUpload"
            />
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

            const db = firebase.firestore();

            // TOOD: move to actions
            db.collection('settings').doc(this.user.uid).set(settings)
                .then(() => {
                    this.$store.commit('SET_SETTINGS', settings);
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
        border-radius: $border-radius;

        &:hover {
            border-color: var(--link-color);
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
