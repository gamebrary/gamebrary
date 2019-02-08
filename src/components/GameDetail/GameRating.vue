<template lang="html">
    <div
        :class="['game-rating', { small, dark }]">

        <span v-for="n in 5" :key="`star-${n}`">
            <i class="fas fa-star" v-if="(roundedRating - n) + 1 >= 1" />
            <i class="fas fa-star-half" v-if="(roundedRating - n) + 1 === .5" />
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        rating: Number,
        small: Boolean,
        placeholder: Boolean,
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),

        roundedRating() {
            return Math.round((this.rating / 20) * 2) / 2;
        },

        dark() {
            return this.darkModeEnabled || this.placeholder;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.game-rating {
    color: $color-orange;
    font-size: 20px;

    &.small {
        font-size: 12px;
    }

    &.dark {
        color: $color-dark-gray !important;
    }
}
</style>
