<template lang="html">
    <div :class="['game-detail-placeholder', { dark: darkModeEnabled }]">
        <div class="game-hero" />

        <div class="game-detail-container">
            <div class="game-detail">
                <placeholder image class="game-cover" />

                <div>
                    <placeholder :lines="1" class="game-title" />
                    <game-rating :rating="100" placeholder />
                    <placeholder :lines="5" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GameRating from '@/components/GameDetail/GameRating';
import Placeholder from '@/components/Placeholder/Placeholder';

export default {
    components: {
        GameRating,
        Placeholder,
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.game-detail-placeholder {
    display: flex;
    justify-content: center;
    background: $color-light-gray;
    min-height: calc(100vh - #{$navHeight});

    &.dark {
        background: $color-darkest-gray;

        .game-detail-container {
            background-color: $color-dark-gray;
        }
    }
}

.game-hero {
    background-color: $color-dark-gray;
    position: absolute;
    width: 100%;
    left: 0;
    height: 400px;
    z-index: 1;

    @media($small) {
        display: none;
    }
}

.game-detail-container {
    background-color: $color-white;
    -webkit-box-shadow: 0 0 2px 0 $color-gray;
    box-shadow: 0 0 2px 0 $color-gray;
    width: $container-width;
    max-width: 100%;
    z-index: 1;
    margin: $gp * 3;
    padding: $gp 0;
    border-radius: $border-radius;

    @media($small) {
        margin: 0;
        padding-top: $gp * 3;
        border-radius: 0;
    }
}

.game-detail {
    display: grid;
    grid-template-columns: 180px auto;
    grid-gap: $gp * 2;
    margin: 0 $gp;

    @media($small) {
        grid-template-columns: auto;
    }
}

.game-cover {
    --placeholder-image-width: 175px;
    --placeholder-image-height: 220px;

    @media($small) {
        --placeholder-image-width: 240px;
        --placeholder-image-height: 300px;
        width: 240px;
        margin: 0 auto;
    }
}

.game-title {
    --placeholder-text-height: 30px;
    width: 50%;

    @media($small) {
        width: 50%;
        margin: 0 auto;
    }
}

.game-rating {
    margin-bottom: $gp;
}
</style>
