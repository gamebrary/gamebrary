<template lang="html">
    <div v-if="game" class="review-box">
        <div class="info">
            <!-- TODO: get icons for everything -->
            <section v-if="playerPerspectives">
                <strong>Perspective</strong> {{ playerPerspectives }}
            </section>

            <section v-if="timeToBeat">
                <strong>Time to beat</strong> {{ timeToBeat }}
            </section>

            <section v-if="gameModes">
                <strong>{{ $t('gameDetail.gameModes') }}</strong> {{ gameModes }}
            </section>

            <section v-if="genres">
                <strong>{{ $t('gameDetail.genres') }}</strong> {{ genres }}
            </section>

            <section v-if="gamePlatforms">
                <!-- TODO: show current platform icon,
                and also show "available on these other platforms" -->
                <strong>{{ $t('gameDetail.gamePlatforms') }}</strong> {{ gamePlatforms }}
            </section>

            <section v-if="developers">
                <strong>{{ $t('gameDetail.developers') }}</strong> {{ developers }}
            </section>

            <section v-if="publishers">
                <strong>{{ $t('gameDetail.publishers') }}</strong> {{ publishers }}
            </section>

            <section v-if="releaseDate">
                <strong>Release date</strong> {{ moment.unix(releaseDate).format('ll') }}
            </section>

            <game-links />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import GameLinks from '@/components/GameDetail/GameLinks';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        GameLinks,
    },

    data() {
        return {
            moment,
        };
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
            'releaseDate',
            'genres',
            'publishers',
        ]),

        timeToBeat() {
            const momentDate = moment.unix(this.game.time_to_beat);

            return this.game && this.game.time_to_beat
                ? `${momentDate.format('h')}h ${momentDate.format('m')}m`
                : null;
        },
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
