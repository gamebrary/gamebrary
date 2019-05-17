<template lang="html">
    <div v-if="game" class="review-box">
        <div class="info">
            <section v-if="playerPerspectives">
                <strong>Perspective</strong> {{ playerPerspectives }}
            </section>

            <section v-if="gameModes">
                <strong>{{ $t('gameDetails.reviewBox.gameModes') }}</strong> {{ gameModes }}
            </section>

            <section v-if="genres">
                <strong>{{ $t('gameDetails.reviewBox.genres') }}</strong> {{ genres }}
            </section>

            <section v-if="gamePlatforms">
                <strong>{{ $t('gameDetails.reviewBox.gamePlatforms') }}</strong> {{ gamePlatforms }}
            </section>

            <section v-if="developers">
                <strong>{{ $t('gameDetails.reviewBox.developers') }}</strong> {{ developers }}
            </section>

            <section v-if="publishers">
                <strong>{{ $t('gameDetails.reviewBox.publishers') }}</strong> {{ publishers }}
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
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
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
    text-align: left;
    display: grid;
    margin: 0 auto;
    // grid-template-columns: 100px auto;
    grid-gap: $gp;
    padding: $gp 0;
    align-items: center;

    strong {
        color: $color-red;
    }

    section {
        margin-bottom: $gp / 3;
    }
}
</style>
