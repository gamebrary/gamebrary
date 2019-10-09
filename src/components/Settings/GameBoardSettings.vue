<template lang="html">
    <section class="setting-box">
        <h5 class="title">
            Game board
            <span v-if="showBoardSpecificSettings">({{ platform.name }})</span>
        </h5>

        <!-- <div class="setting">
            <i class="fas fa-users" />
            <h5>{{ $t('settings.public') }}</h5>

            <toggle-switch
                id="nightMode"
                v-model="value.public"
            />
        </div> -->

        <div class="setting">
            <i class="fas fa-star-half-alt" />
            <h5>{{ $t('settings.ratings') }}</h5>

            <toggle-switch
                id="gameRatings"
                v-model="value.hideGameRatings"
            />
        </div>

        <template v-if="showBoardSpecificSettings">
            <wallpaper-upload />

            <div class="setting">
                <i class="fas fa-palette" />
                <h5>Global theme</h5>

                <select v-model="value.theme[platform.code]">
                    <option v-for="{ id, name } in themes" :key="id" :value="id">
                        {{ name }}
                    </option>
                </select>
            </div>

            <!-- TODO: refactor gameBoard to allow public data source -->
            <!-- <section>
                <h3>{{ $t('gameBoard.settings.shareLink') }}</h3>
                <div class="links">
                    <a class="link primary" :href="tweetUrl" target="_blank">
                        <i class="fab fa-twitter" />
                    </a>

                    <a class="link primary reddit" :href="redditUrl" target="_blank">
                        <i class="fab fa-reddit" />
                    </a>

                    <a class="link info" :href="shareUrl" target="_blank">
                        <i class="fas fa-link" />
                    </a>
                </div>
            </section> -->

            <div class="setting">
                <i class="fas fa-exclamation-triangle" />
                <h5>{{ $t('gameBoard.settings.dangerZone') }}</h5>

                <modal
                    :action-text="`Delete forever`"
                    :message="`Your ${platform.name} collection will be deleted forever.`"
                    :title="`Delete ${platform.name} collection`"
                    padded
                    show-close
                    @action="deletePlatform"
                >
                    <button
                        class="small warning"
                        :title="$t('list.delete')"
                    >
                        <i class="far fa-trash-alt" />
                        Delete {{ platform.name }} collection
                    </button>
                </modal>
            </div>
        </template>
    </section>
</template>

<script>
import { mapState } from 'vuex';
import themes from '@/themes';
import Modal from '@/components/Modal';
import WallpaperUpload from '@/components/WallpaperUpload';
import ToggleSwitch from '@/components/ToggleSwitch';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
    components: {
        WallpaperUpload,
        Modal,
        ToggleSwitch,
    },

    props: {
        value: Object,
    },

    data() {
        return {
            themes,
        };
    },

    computed: {
        ...mapState(['user', 'platform', 'gameLists']),

        shareText() {
            return `Check out my ${this.platform.name} collection at Gamebrary`;
        },

        showBoardSpecificSettings() {
            return this.$route.name === 'game-board' && this.platform;
        },

        tweetUrl() {
            return `https://twitter.com/intent/tweet?text=${this.shareText}&url=${encodeURIComponent(this.shareUrl)}`;
        },

        redditUrl() {
            return `https://www.reddit.com/submit?url=${this.shareUrl}&title=${this.shareText}`;
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:4000'
                : 'https://app.gamebrary.com';

            return `${url}/s?id=${this.user.uid}&list=${this.platform.code}`;
        },
    },

    methods: {
        deletePlatform() {
            this.$store.commit('REMOVE_PLATFORM');

            const db = firebase.firestore();

            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: false })
                .then(() => {
                    this.$router.push({ name: 'platforms' });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .list-settings {
        display: grid;
        grid-gap: $gp;

        section {
            margin-bottom: $gp;
        }

        h3 {
            margin: $gp / 2 0;
        }
    }

    .links {
        a {
            &.reddit {
                background-color: #ff4500;
            }
        }
    }
</style>
