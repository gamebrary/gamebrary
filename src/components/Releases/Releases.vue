<template lang="html">
    <div class="releases">
        <div
            class="release"
            v-if="loaded"
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

        <releases-placeholder v-else />
    </div>
</template>

<script>
import moment from 'moment';
import VueMarkdown from 'vue-markdown';
import ReleasesPlaceholder from '@/components/Releases/ReleasesPlaceholder';
import { mapState } from 'vuex';

export default {
    components: {
        VueMarkdown,
        ReleasesPlaceholder,
    },

    data() {
        return {
            loaded: false,
        };
    },

    computed: {
        ...mapState(['releases']),
    },

    mounted() {
        this.loadReleases();
    },

    methods: {
        loadReleases() {
            this.loaded = false;

            this.$store.dispatch('LOAD_RELEASES')
                .then(() => {
                    this.loaded = true;
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', {
                        message: 'Error loading releases',
                        type: 'error',
                    });
                });
        },

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

        h3 {
            margin: 0;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .releases img {
        max-width: 100%;
    }
</style>
