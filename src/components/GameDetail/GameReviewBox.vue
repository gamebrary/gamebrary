<template lang="html">
    <div v-if="game" class="review-box">
        <game-rating :rating="game.rating" />

        <div class="info">
            <section v-if="playerPerspectives">
                <strong>Perspective</strong> {{ playerPerspectives }}
            </section>

            <section v-if="gameModes">
                <strong>Game Mode</strong> {{ gameModes }}
            </section>

            <section v-if="genres">
                <strong>Genre</strong> {{ genres }}
            </section>

            <section v-if="gamePlatforms">
                <strong>Platforms</strong> {{ gamePlatforms }}
            </section>

            <section v-if="developers">
                <strong>Developer</strong> {{ developers }}
            </section>

            <section v-if="publishers">
                <strong>Publishers</strong> {{ publishers }}
            </section>

            <!-- <section v-if="releaseDate">
                <strong>Release date</strong> {{ releaseDate }}
            </section> -->
            <!-- <game-links /> -->
        </div>
    </div>
</template>

<script>
import GameLinks from '@/components/GameDetail/GameLinks';
import GameRating from '@/components/GameDetail/GameRating';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        GameRating,
        GameLinks,
    },

    computed: {
        ...mapState([
            'game',
            'platforms',
        ]),

        ...mapGetters([
            'playerPerspectives',
            'developers',
            'gameModes',
            'gamePlatforms',
            'genres',
            'publishers',
        ]),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.review-box {
    display: grid;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    grid-template-columns: 100px auto;
    grid-gap: $gp;
    padding: $gp;
    align-items: center;

    strong {
        color: $color-red;
    }

    section {
        margin-bottom: $gp / 3;
    }
}
</style>
