<template lang="html">
    <div class="game-detail-placeholder">
        <div class="game-hero" />

        <div class="game-detail-container">
            <div class="game-detail">
                <img :src="coverUrl" :alt="gamePreviewData.name" class="game-cover">

                <div>
                    <h2>{{ gamePreviewData.name }}</h2>
                    <game-rating :rating="gamePreviewData.rating" />
                    <placeholder :lines="3" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import GameRating from '@/components/GameDetail/GameRating';
import Placeholder from '@/components/Placeholder';

export default {
    components: {
        GameRating,
        Placeholder,
    },

    props: {
        id: [Number, String],
    },

    computed: {
        ...mapState(['games']),

        gamePreviewData() {
            return this.games[this.id];
        },

        coverUrl() {
            const game = this.games[this.id];

            return game.cover && game.cover.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
                : '/static/no-image.jpg';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.game-detail-placeholder {
    display: flex;
    justify-content: center;
    background: var(--modal-background);
    min-height: calc(100vh - #{$navHeight});
}

.game-hero {
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
    border: 5px solid #a5a2a2;
    background-size: contain;
    width: 100%;
    height: auto;

    @media($small) {
        border: 3px solid #a5a2a2;
        height: auto;
        width: auto;
        min-width: auto;
        max-width: 100%;
    }
}

.game-detail-container {
    -webkit-box-shadow: 0 0 2px 0 #a5a2a2;
    box-shadow: 0 0 2px 0 #a5a2a2;
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
