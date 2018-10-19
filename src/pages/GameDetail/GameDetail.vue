<template lang="html">
    <div class="game" v-if="game">
        <game-header />

        <section class="game-details">
            <h2 v-html="game.name" />
            <p class="game-description" v-html="game.summary" />
            <game-review-box />
            <game-screenshots />
            <game-videos />
            <div class="source">
                Source: <a href="https://www.igdb.com/">IGDB</a>
            </div>
        </section>
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
        ...mapState(['game']),
    },

    mounted() {
        this.$store.commit('SET_ACTIVE_GAME', this.$route.params.id);
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game {
        border-radius: $border-radius;
        background-color: $color-light-gray;
        overflow: hidden;
    }

    .game-details {
        padding: 0 $gp;
    }
    .source {
        padding-bottom: $gp;
        text-align: center;

        a {
            color: $color-blue;
            text-decoration: none;
        }
    }
</style>
