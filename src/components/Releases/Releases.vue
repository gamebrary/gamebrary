<template lang="html">
    <div class="releases">
        <github-button href="https://github.com/romancmx/gamebrary/subscription" data-show-count="true" aria-label="Watch romancmx/gamebrary on GitHub">Watch</github-button>
        <github-button href="https://github.com/romancmx/gamebrary" data-show-count="true" aria-label="Star romancmx/gamebrary on GitHub">Star</github-button>
        <github-button href="https://github.com/romancmx/gamebrary/fork" data-show-count="true" aria-label="Fork romancmx/gamebrary on GitHub">Fork</github-button>
        <github-button href="https://github.com/romancmx/gamebrary/issues" data-show-count="true" aria-label="Issue romancmx/gamebrary on GitHub">Issue</github-button>

        <div
            class="release"
            v-for="notification in releases"
            :key="notification.id"
        >
            <div class="release-info">
                <a class="link primary small hollow">
                    {{ notification.tag_name }}
                </a>

                <div>
                    <h3>{{ notification.name }}</h3>
                    <small>Published {{ formattedDate(notification.published_at) }}</small>
                </div>
            </div>

            <vue-markdown :source="notification.body" />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import VueMarkdown from 'vue-markdown';
import ReleasesPlaceholder from '@/components/Releases/ReleasesPlaceholder';
import { mapState } from 'vuex';
import GithubButton from 'vue-github-button';

export default {
    components: {
        VueMarkdown,
        GithubButton,
        ReleasesPlaceholder,
    },

    computed: {
        ...mapState(['releases']),
    },

    methods: {
        formattedDate(date) {
            return moment(date).fromNow();
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .release {
        margin-bottom: $gp;
        border-bottom: 1px solid $color-light-gray;
        font-size: 12px;
        padding: $gp 0;

        .release-info {
            display: grid;
            grid-gap: $gp / 2;
            grid-template-columns: 50px auto;

            a {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .releases img {
        max-width: 100%;
    }
</style>
