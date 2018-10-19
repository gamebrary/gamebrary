<template lang="html">
    <div :class="['rating', ratingClass, { 'small': small}]">
        <span v-if="!isNaN(rating)">{{ parseInt(rating, 10) }}</span>
        <span v-else>?</span>
    </div>
</template>

<script>
export default {
    props: {
        rating: Number,
        small: Boolean,
    },

    computed: {
        ratingClass() {
            const gameRating = Number(this.rating);
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
@import "~styles/styles.scss";

.rating {
    position: relative;
    width: 100px;
    height: 57.74px;
    background-color: $color-gray;
    margin: 28.87px 0;
    font-size: 60px;
    display: flex;
    align-items: center;
    color: $color-white;
    font-weight: bold;

    &.small {
        width: 26px;
        height: 15px;
        font-size: 15px;
        margin: 12px 0 8px;

        &:before,
        &:after {
            border-left: 13px solid transparent;
            border-right: 13px solid transparent;
        }

        &:before {
            border-bottom: 8px solid $color-gray;
        }

        &:after {
            border-top: 8px solid $color-gray;
        }
    }

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
        border-bottom: 28.87px solid $color-light-gray;
    }

    &:after {
        top: 100%;
        border-top: 28.87px solid $color-light-gray;
    }

    &.excellent {
        background-color: $color-green;

        &:before { border-bottom-color: $color-green; }
        &:after { border-top-color: $color-green; }
    }
    &.good {
        background-color: $color-light-green;

        &:before { border-bottom-color: $color-light-green; }
        &:after { border-top-color: $color-light-green; }
    }
    &.average {
        background-color: $color-orange;

        &:before { border-bottom-color: $color-orange; }
        &:after { border-top-color: $color-orange; }
    }
    &.bad {
        background-color: $color-red;

        &:before { border-bottom-color: $color-red; }
        &:after { border-top-color: $color-red; }
    }
}
</style>
