<template lang="html">
    <div class="releases">
        <div class="release" v-for="notification in releases" :key="notification.id">
            <div class="release-info">
                <a class="link primary small hollow">
                    {{ notification.tag_name }}
                </a>

                <div>
                    <h3>{{ notification.name }}</h3>
                    <small>Published {{ moment(notification.published_at).fromNow() }}</small>
                </div>
            </div>

            <vue-markdown :source="notification.body" />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import VueMarkdown from 'vue-markdown';
import { mapState } from 'vuex';

export default {
    components: {
        VueMarkdown,
    },

    data() {
        return {
            moment,
        };
    },

    computed: {
        ...mapState(['releases']),
    },

    mounted() {
        this.$store.dispatch('LOAD_RELEASES')
            .catch(() => {
                this.$bus.$emit('TOAST', { message: 'Error loading releases', type: 'error' });
            });
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
