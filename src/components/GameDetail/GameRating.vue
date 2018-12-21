<!-- eslint-disable -->
<template lang="html">
    <div :class="['game-rating', ratingClass, { 'small': small, dark: darkModeEnabled }]">
        <span class="rating">
            {{ formattedRating }}
        </span>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 3 91 111">
            <path d="M49 3L4 29v52l45 26 46-26V29zm0 95L12 77V34l37-21 38 21v43zm0 0" />
        </svg>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        rating: Number,
        small: Boolean,
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),

        ratingClass() {
            const gameRating = Number(this.rating);
            if (gameRating === 100) { return 'master'; }
            if (gameRating >= 90) { return 'amazing'; }
            if (gameRating >= 80) { return 'great'; }
            if (gameRating >= 70) { return 'good'; }
            if (gameRating >= 60) { return 'okay'; }
            return 'bad';
        },

        formattedRating() {
            return isNaN(this.rating)
                ? '?'
                : parseInt(this.rating, 10);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.game-rating {
    width: 100px;
    height: 115px;
    position: relative;

    &.small {
        margin-top: $gp / 2;
        width: 34px;
        height: 39px;

        .rating {
            font-size: 20px;
        }
    }

    &.master { fill: #0e9246; color: #0e9246; }
    &.amazing { fill: #7dbb42; color: #7dbb42; }
    &.great { fill: #fecc09; color: #fecc09; }
    &.good { fill: #f68e1e; color: #f68e1e; }
    &.okay { fill: #ee4723; color: #ee4723; }
    &.bad { fill: #bc2025; color: #bc2025; }

    &.dark {
        fill: $color-dark-gray !important;
        color: $color-dark-gray !important;
    }

    .rating {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: bold;
    }
}
</style>
