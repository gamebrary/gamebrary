<template lang="html">
    <div class="list-settings">
        <section>
            <h3>{{ $t('gameBoard.settings.wallpaper') }}</h3>
            <wallpaper-upload />
        </section>

        <section>
            <h3>{{ $t('gameBoard.settings.shareLink') }}</h3>
            <div class="links">
                <a class="link tiny primary" :href="tweetUrl" target="_blank">
                    <i class="fab fa-twitter" />
                </a>

                <a class="link tiny primary reddit" :href="redditUrl" target="_blank">
                    <i class="fab fa-reddit" />
                </a>

                <a class="link tiny info" :href="shareUrl" target="_blank">
                    <i class="fas fa-link" />
                </a>
            </div>
        </section>

        <section>
            <h3>{{ $t('gameBoard.settings.dangerZone') }}</h3>
            <!-- TODO: move to it's own component -->
            <!-- TODO: translate -->
            <modal
                :action-text="`Delete forever`"
                :message="`Your ${platform.name} collection will be deleted forever.`"
                :title="`Delete ${platform.name} collection`"
                padded
                show-close
                @action="deletePlatform"
            >
                <button
                    class="small accent hollow"
                    :title="$t('list.delete')"
                >
                    <i class="far fa-trash-alt" />
                    Delete {{ platform.name }} collection
                </button>
            </modal>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal/Modal';
import WallpaperUpload from '@/components/WallpaperUpload/WallpaperUpload';

export default {
    components: {
        WallpaperUpload,
        Modal,
    },

    computed: {
        ...mapState(['user', 'platform']),

        shareText() {
            return `Check out my ${this.platform.name} collection at GAMEBRARY`;
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
            this.$router.push({ name: 'platforms' });
            this.$emit('update', true);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

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
