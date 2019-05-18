<template>
    <div class="wallpaper-upload">
        <div class="loading" v-if="loading">
            <i class="fas fa-sync-alt fa-2x fast-spin" />
        </div>

        <div v-else>
            <div v-show="!wallpaperUrl">
              {{ $t('settings.wallpaper.title') }}

                <input
                    type="file"
                    accept='image/*'
                    @change="handleUpload"
                />
            </div>

            <div v-if="wallpaperUrl">
                <h5>{{ $t('settings.wallpaper.transparency') }}</h5>

                <div class="button-group">
                    <button
                        class="small tiny"
                        :class="{ primary: !transparent }"
                        @click="setTransparent(false)"
                    >
                      {{ $t('no') }}
                    </button>

                    <button
                        class="small tiny"
                        :class="{ primary: transparent }"
                        @click="setTransparent(true)"
                    >
                      {{ $t('yes') }}
                    </button>
                </div>

                <br>
                <br>

                <h5>{{ $t('settings.wallpaper.currentWallpaper') }}</h5>

                <img
                    :src="wallpaperUrl"
                    alt="Uploaded wallpaper"
                />

                <button class="error small tiny" @click="removeWallpaper">
                    <i class="fas fa-trash" />
                    {{ $t('settings.wallpaper.removeWallpaper') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapState } from 'vuex';

const db = firebase.firestore();

export default {
    data() {
        return {
            progressUpload: 0,
            file: File,
            uploadTask: '',
            wallpapers: {},
            transparent: false,
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

        this.transparent = this.wallpapers[this.platform.code].transparent || false;
    },

    methods: {
        setTransparent(value) {
            this.transparent = value;
            this.saveSettings();
        },

        removeWallpaper() {
            delete this.wallpapers[this.platform.code].url;

            this.saveSettings();
        },

        saveSettings() {
            this.wallpapers[this.platform.code].transparent = this.transparent;

            const settings = {
                ...this.settings,
                wallpapers: this.wallpapers,
            };

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
    @import "~styles/styles.scss";

    .wallpaper-upload {
        display: flex;
        flex-direction: column;
    }

    img {
        width: 100%;
        height: auto;
        border: 1px solid $color-gray;
        padding: $gp / 2;
        border-radius: $border-radius;
    }

    input {
        width: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $gp / 2;
        height: auto;
        width: 100%;
        border: 1px solid $color-green;
    }

    .loading {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
</style>
