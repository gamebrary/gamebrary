<template lang="html">
    <div v-if="game" class="review-box">
        <section v-if="gamePlatforms && gamePlatforms.length > 0">
            <h4>{{ $t('gameDetail.gamePlatforms') }}</h4>

            <div class="platforms">
                <platform
                    v-for="platform in gamePlatforms"
                    :key="platform.name"
                    :platform="platform"
                />
            </div>
        </section>

        <div class="info">
            <!-- TODO: get icons for everything -->
            <section v-if="playerPerspectives">
                <strong>{{ $t('gameDetail.perspective') }}</strong>
                {{ playerPerspectives }}
            </section>

            <section v-if="timeToBeat">
                <strong>{{ $t('gameDetail.timeToBeat') }}</strong>
                {{ timeToBeat }}
            </section>

            <section v-if="gameModes">
                <strong>{{ $t('gameDetail.gameModes') }}</strong>
                {{ gameModes }}
            </section>

            <section v-if="genres">
                <strong>{{ $t('gameDetail.genres') }}</strong>
                {{ genres }}
            </section>

            <section v-if="developers">
                <strong>{{ $t('gameDetail.developers') }}</strong>
                {{ developers }}
            </section>

            <section v-if="publishers">
                <strong>{{ $t('gameDetail.publishers') }}</strong>
                {{ publishers }}
            </section>

            <section v-if="releaseDate">
                <strong>{{ $t('gameDetail.releaseDate') }}</strong>
                {{ moment.unix(releaseDate).format('ll') }}
            </section>

            <game-links />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import GameLinks from '@/components/GameDetail/GameLinks';
import Platform from '@/components/Platforms/Platform';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        Platform,
        GameLinks,
    },

    data() {
        return {
            moment,
        };
    },

    computed: {
        ...mapState(['game']),

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

    .platforms {
        display: flex;
        flex-wrap: wrap;

        .platform {
            margin-right: $gp / 2;

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
