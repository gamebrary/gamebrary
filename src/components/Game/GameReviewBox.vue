<template lang="html">
    <div v-if="game" class="review-box">
        <div class="rating" :class="ratingClass">
            <span v-if="!isNaN(gameRating)">{{ gameRating }}</span>
            <span v-else>?</span>
        </div>

        <div class="info">
            <section>
                <strong>Perspective</strong> {{ playerPerspectives }}
            </section>
            <section>
                <strong>Game Mode</strong> {{ gameModes }}
            </section>
            <section>
                <strong>Genre</strong> {{ genres }}
            </section>

            <section>
                <strong>Platforms</strong>
                <span
                    v-for="{ slug, name } in game.platforms"
                    :key="slug"
                >
                    <i class="fab fa-windows" v-if="slug === 'win'" />
                    <i class="fab fa-steam" v-else-if="slug === 'steam--1'" />
                    <i class="fab fa-apple" v-else-if="slug === 'mac'" />
                    <i class="fab fa-playstation" v-else-if="slug === 'ps4--1'" />
                    <i class="fab fa-xbox" v-else-if="slug === 'xboxone'" />
                    <i class="fab fa-linux" v-else-if="slug === 'linux'" />
                    <i class="fab fa-nintendo-switch" v-else-if="slug === 'nintendo-switch'" />
                    <i class="fab fa-playstation" v-else-if="slug === 'psn'" />
                    <i class="fab fa-playstation" v-else-if="slug === 'psvita'" />
                    <i class="fas fa-gamepad" v-else />
                    <md-tooltip md-direction="top">
                        {{ name }}
                    </md-tooltip>
                </span>
            </section>
            <section>
                <strong>Developer</strong> {{ developers }}
            </section>
            <section>
                <strong>Publishers</strong> {{ publishers }}
            </section>
            <section>
                <strong>Release date</strong> {{ releaseDate }}
            </section>
            <game-links />
        </div>
    </div>
</template>

<script>
import GameLinks from '@/components/Game/GameLinks';
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
            'gameRating',
            'genres',
            'publishers',
            'releaseDate',
        ]),

        ratingClass() {
            const gameRating = Number(this.gameRating);
            if (gameRating >= 90) { return 'excellent'; }
            if (gameRating >= 80) { return 'good'; }
            if (gameRating >= 70) { return 'average'; }
            if (gameRating < 70) { return 'bad'; }
            return '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/variables.scss";

.review-box {
    display: grid;
    grid-template-columns: 100px auto;
    grid-gap: $gp;


    section {
        strong {
            color: $nin-red;
        }
    }

    .rating {
        position: relative;
        width: 100px;
        height: 57.74px;
        background-color: #ccc;
        margin: 28.87px 0;
        font-size: 60px;
        display: flex;
        align-items: center;
        color: $nin-white;
        font-weight: bold;

        span {
            margin: 0 auto;
        }

        &:before,
        &:after {
            content: "";
            position: absolute;
            width: 0;
            left: 0;
            border-left: 50px solid transparent;
            border-right: 50px solid transparent;
        }

        &:before {
            bottom: 100%;
            border-bottom: 28.87px solid #ccc;
        }

        &:after {
            top: 100%;
            border-top: 28.87px solid #ccc;
        }

        &.excellent {
            background-color: #27ae60;

            &:before { border-bottom-color: #27ae60; }
            &:after { border-top-color: #27ae60; }
        }
        &.good {
            background-color: #78ae62;

            &:before { border-bottom-color: #78ae62; }
            &:after { border-top-color: #78ae62; }
        }
        &.average {
            background-color: #fcb410;

            &:before { border-bottom-color: #fcb410; }
            &:after { border-top-color: #fcb410; }
        }
        &.bad {
            background-color: #ff4e50;

            &:before { border-bottom-color: #ff4e50; }
            &:after { border-top-color: #ff4e50; }
        }
    }
}
</style>
