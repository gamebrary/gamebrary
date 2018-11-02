<template lang="html">
    <!-- eslint-disable -->
    <div class="game-detail" v-if="game" :class="{ dark: settings.nightMode }">
        <main>
            <game-header />

            <div class="game-info">
                <div>
                    <h2>{{ game.name }}</h2>
                    <p class="game-description" v-html="game.summary" />
                </div>

                <game-review-box />
            </div>

            <game-screenshots />
            <game-videos />

            <div class="igdb-credit">
                <small>Powered by:</small>
                <a href="https://igdb.github.io/api/" target="_blank">
                    <svg class="pull-left mar-sm-right" height="35px" space="preserve" style="margin-left:-9px;margin-top:-7px;" version="1.1" viewBox="0 0 419.3 482.7" width="40px" xmlns="http://www.w3.org/2000/svg"><g><polygon fill="#00A552" points="210,228.7 416.4,121.1 210,478.7"></polygon><polygon fill="#009345" points="210,228.7 3.6,121.1 210,478.7"></polygon><polygon fill="#01DF6B" points="416.4,121.1 3.6,121.1 210,228.7"></polygon><polygon fill="#01DF6B" points="3.6,361 211.2,4.1 416.4,361"></polygon><polygon fill="#00A552" points="210,228.7 310.3,176.4 210,361"></polygon><polygon fill="#009345" points="110.6,176.9 210,361 210,228.7"></polygon></g></svg><svg class="pull-left" style="margin-left:-9px;" version="1.1" viewBox="0 0 419.3 100" width="120px" xmlns="http://www.w3.org/2000/svg"><g><path d="M58.4,58.2H54V5.6h4.4V58.2z" fill="#000000"></path><path d="M110.7,51.9c-1.5,2.2-4,3.9-7.2,5.1s-7,1.8-11,1.8c-4.1,0-7.8-1-11-3s-5.7-4.8-7.4-8.4
                        c-1.8-3.6-2.6-7.8-2.7-12.4v-6.6c0-7.3,1.8-13.1,5.5-17.3s8.6-6.3,14.9-6.3c5.4,0,9.8,1.4,13.1,4.1c3.3,2.8,5.3,6.6,5.9,11.4h-4.4
                        c-0.7-3.9-2.2-6.8-4.7-8.8s-5.8-3-9.8-3c-4.9,0-8.8,1.7-11.7,5.2c-2.9,3.5-4.3,8.4-4.3,14.8v6.2c0,4,0.7,7.5,2,10.6
                        c1.4,3.1,3.3,5.5,5.9,7.1c2.5,1.7,5.5,2.5,8.8,2.5c3.8,0,7.1-0.6,9.9-1.8c1.8-0.8,3.1-1.7,4-2.8V37H92.1v-3.8h18.6V51.9z" fill="#000000"></path><path d="M123.3,58.2V5.6H138c4.3,0,8.2,1,11.6,2.9c3.4,2,6.1,4.8,8,8.4c1.9,3.7,2.9,7.8,2.9,12.5v4.8
                        c0,4.7-1,8.9-2.9,12.5s-4.6,6.4-8,8.4c-3.5,2-7.4,3-11.9,3L123.3,58.2L123.3,58.2z M127.7,9.3v45.1h10c5.5,0,10-1.8,13.3-5.5
                        s5-8.6,5-14.9v-4.6c0-6.1-1.7-10.9-5-14.5s-7.6-5.5-13-5.5L127.7,9.3L127.7,9.3z" fill="#000000"></path><path d="M171.7,58.2V5.6h15.6c5.6,0,9.9,1.2,12.8,3.5c2.9,2.3,4.4,5.8,4.4,10.3c0,2.7-0.7,5.1-2.2,7.1
                        s-3.5,3.5-6.1,4.3c3.1,0.7,5.5,2.2,7.4,4.5s2.8,5,2.8,8.1c0,4.6-1.5,8.3-4.5,10.9s-7.2,3.9-12.5,3.9H171.7z M176.2,29.2h12.1
                        c3.7-0.1,6.6-0.9,8.6-2.6c2-1.7,3.1-4.1,3.1-7.3c0-3.4-1.1-5.9-3.2-7.5c-2.1-1.6-5.3-2.4-9.6-2.4h-11.1L176.2,29.2L176.2,29.2z
                        M176.2,32.9v21.5h13.3c3.8,0,6.8-1,9.1-2.9c2.2-1.9,3.3-4.6,3.3-8.1c0-3.2-1.1-5.8-3.2-7.7s-5.1-2.8-8.8-2.8H176.2z" fill="#000000"></path><path d="M215.7,55.6c0-0.8,0.3-1.6,0.8-2.2c0.5-0.6,1.3-0.9,2.3-0.9s1.7,0.3,2.3,0.9c0.6,0.6,0.8,1.3,0.8,2.2
                        c0,0.8-0.3,1.5-0.8,2.1c-0.6,0.5-1.3,0.8-2.3,0.8s-1.7-0.3-2.3-0.8C215.9,57.1,215.7,56.4,215.7,55.6z" fill="#01DF6B"></path><path d="M248.2,55.3c3,0,5.5-0.8,7.6-2.5c2-1.7,3.1-3.9,3.3-6.6h4.2c-0.1,2.4-0.9,4.6-2.2,6.5c-1.4,2-3.2,3.5-5.5,4.6
                        c-2.3,1.1-4.7,1.7-7.3,1.7c-5.1,0-9.2-1.8-12.2-5.3c-3-3.6-4.5-8.4-4.5-14.4V38c0-3.9,0.7-7.3,2-10.2c1.3-3,3.3-5.3,5.8-6.9
                        c2.5-1.6,5.5-2.4,8.8-2.4c4.3,0,7.8,1.3,10.6,3.8c2.8,2.6,4.3,5.9,4.5,10.1h-4.2c-0.2-3.1-1.3-5.5-3.3-7.4c-2-1.9-4.5-2.8-7.6-2.8
                        c-3.9,0-6.9,1.4-9.1,4.2c-2.2,2.8-3.2,6.8-3.2,11.9v1.3c0,5,1.1,8.9,3.2,11.7C241.2,53.9,244.3,55.3,248.2,55.3z" fill="#01DF6B"></path><path d="M269.5,38.1c0-3.8,0.7-7.1,2.2-10.2c1.5-3,3.5-5.4,6.2-7c2.7-1.7,5.7-2.5,9.1-2.5c5.2,0,9.4,1.8,12.6,5.5
                        c3.2,3.6,4.8,8.5,4.8,14.5v0.9c0,3.8-0.7,7.2-2.2,10.2s-3.5,5.4-6.2,7s-5.7,2.5-9.1,2.5c-5.2,0-9.4-1.8-12.6-5.5
                        c-3.2-3.6-4.9-8.5-4.9-14.5v-0.9H269.5z M273.8,39.3c0,4.7,1.2,8.5,3.6,11.5s5.6,4.5,9.5,4.5s7.1-1.5,9.5-4.5s3.6-7,3.6-11.9v-0.8
                        c0-3-0.6-5.7-1.7-8.2s-2.7-4.4-4.7-5.8c-2-1.4-4.3-2-6.9-2c-3.9,0-7,1.5-9.4,4.5s-3.6,7-3.6,11.9v0.8H273.8z" fill="#01DF6B"></path><path d="M317.2,19.1l0.1,6.4c1.4-2.4,3.3-4.1,5.4-5.3c2.2-1.2,4.6-1.8,7.2-1.8c6.2,0,10.1,2.5,11.7,7.6
                        c1.4-2.4,3.3-4.3,5.6-5.6c2.3-1.3,4.9-2,7.7-2c8.4,0,12.7,4.6,12.8,13.7v26.1h-4.3V32.4c0-3.5-0.8-6.1-2.3-7.8s-3.9-2.5-7.2-2.5
                        c-3.1,0-5.7,1.1-7.9,3c-2.1,2-3.3,4.4-3.6,7.2v25.9h-4.1V32.1c0-3.3-0.8-5.8-2.4-7.5c-1.6-1.6-3.9-2.5-7.2-2.5
                        c-2.7,0-5.1,0.8-7,2.3c-2,1.6-3.4,3.9-4.3,6.9v26.8h-4.3V19L317.2,19.1L317.2,19.1z" fill="#01DF6B"></path></g></svg>
                    </a>
            </div>
        </main>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import GameHeader from '@/components/GameDetail/GameHeader';
import GameScreenshots from '@/components/GameDetail/GameScreenshots';
import GameVideos from '@/components/GameDetail/GameVideos';
import GameReviewBox from '@/components/GameDetail/GameReviewBox';

export default {
    components: {
        GameHeader,
        GameScreenshots,
        GameVideos,
        GameReviewBox,
    },

    computed: {
        ...mapState(['game', 'settings']),
    },

    mounted() {
        this.$store.commit('SET_ACTIVE_GAME', this.$route.params.id);
    },

    destroyed() {
        this.$store.commit('SET_ACTIVE_GAME', null);
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-detail {
        display: flex;
        margin: 0 $gp;

        @media($small) {
            margin: 0;
        }

        &.dark {
            main {
                background: #333;
                color: $color-gray;
            }
        }
    }

    .game-info {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-gap: $gp * 2;
        margin: 0 $gp;

        @media($small) {
            grid-gap: $gp;
            grid-template-columns: 1fr;
        }

        .game-description {
            line-height: 1.4rem;
        }
    }

    main {
        background-color: $color-white;
        width: $container-width;
        max-width: 100%;
        margin: $gp auto;
        border-radius: $border-radius;
        overflow: hidden;

        @media($small) {
            margin: 0;
            border-radius: 0;
        }
    }

    .igdb-credit {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: $gp;
    }
</style>
