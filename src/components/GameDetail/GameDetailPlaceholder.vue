<template lang="html">
    <div :class="['game-detail-placeholder', { dark: darkModeEnabled }]">
        <div class="game-hero" />

        <div class="game-detail-container">
            <div class="game-detail">
                <img :src="coverUrl" :alt="gamePreviewData.name" class="game-cover">

                <div>
                    <h2>{{ gamePreviewData.name }}</h2>
                    <game-rating :rating="gamePreviewData.rating" placeholder />
                    <placeholder :lines="5" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameRating from '@/components/GameDetail/GameRating';
import Placeholder from '@/components/Placeholder/Placeholder';

export default {
    components: {
        GameRating,
        Placeholder,
    },

    props: {
        id: [Number, String],
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
        ...mapState(['games']),

        gamePreviewData() {
            return this.games[this.id];
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/';

            return this.games && this.games[this.id].cover
            ? `${url}${this.games[this.id].cover.cloudinary_id}.jpg`
            : '/static/no-image.jpg';
        },
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

.game-cover {
    border: 5px solid $color-gray;
    background-size: contain;
    width: 100%;
    height: auto;

    @media($small) {
        border: 3px solid $color-gray;
        height: auto;
        width: auto;
        min-width: auto;
        max-width: 100%;
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
