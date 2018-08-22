<template lang="html">
    <div v-if="game">
        <game-header />

        <section class="game-details">
            <h2 v-html="game.name" />
            <p class="game-description">{{ game.summary }}</p>
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
import GameHeader from '@/components/Game/GameHeader';
import GameScreenshots from '@/components/Game/GameScreenshots';
import GameVideos from '@/components/Game/GameVideos';
import GameReviewBox from '@/components/Game/GameReviewBox';

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
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .game-details {
        padding: 0 $gp / 2;
    }
</style>
