<template>
    <div class="wallpaper-upload">
        <div class="loading" v-if="loading">
            <i class="fas fa-sync-alt fa-2x fast-spin" />
        </div>

        <div v-else>
            Upload wallpaper
            <input
                type="file"
                accept='image/*'
                @change="handleUpload"
            />

            <div v-if="wallpaperUrl">
                Current wallpaper
                <img
                    :src="wallpaperUrl"
                    alt="Uploaded wallpaper"
                />

                <button class="error small" @click="clearWallpaper">
                    <i class="fas fa-trash" />
                    Remove wallpaper
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapState } from 'vuex';

export default {
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
    },

    methods: {
        clearWallpaper() {
            delete this.wallpapers[this.platform.code];

            this.$bus.$emit('SAVE_SETTINGS', {
                ...this.settings,
                wallpapers: this.wallpapers,
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

                        this.$bus.$emit('SAVE_SETTINGS', {
                            ...this.settings,
                            wallpapers: this.wallpapers,
                        });

                        this.loading = false;
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
        align-items: center;
        flex-direction: column;
    }

    img {
        width: 100%;
        max-height: 300px;
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
