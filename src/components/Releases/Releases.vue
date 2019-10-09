<template lang="html">
    <div class="releases">
        <template v-if="loaded">
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
                        <small>
                            {{ $t('releases.published', {
                                date: formattedDate(notification.published_at)
                            })}}
                        </small>
                    </div>
                </div>

                <vue-markdown :source="notification.body" />
            </div>
        </template>

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
        this.loaded = Boolean(this.releases);

        this.load();
    },

    methods: {
        formattedDate(date) {
            return moment(date).fromNow();
        },

        load() {
            // TODO: use await / async
            this.$store.dispatch('LOAD_RELEASES')
                .then(() => {
                    this.loaded = true;
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .release {
        margin-bottom: $gp;
        border-bottom: 1px solid #e5e5e5;
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
