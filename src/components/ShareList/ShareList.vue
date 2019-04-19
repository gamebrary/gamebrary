<template lang="html">
    <modal
        title="Share your list"
        message="Use the following URL to share this list."
        close-text="OK"
        padded
    >
        <button class="small info" title="Share">
            <i class="fas fa-share-alt" />
        </button>

        <div slot="content">
            <div class="links">
                <a class="link small tiny primary" :href="tweetUrl" target="_blank">
                    <i class="fab fa-twitter" />
                </a>

                <a class="link small tiny primary reddit" :href="redditUrl" target="_blank">
                    <i class="fab fa-reddit" />
                </a>

                <a class="link small tiny info" :href="shareUrl" target="_blank">
                    <i class="fas fa-link" />
                </a>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal/Modal';

export default {
    components: {
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
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .links {
        text-align: center;

        a {
            &.reddit {
                background-color: #ff4500;
            }
        }
    }
</style>
