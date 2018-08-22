<template lang="html">
    <div class="game-header">
        <div class="game-background" :style="style">
            <img
                :src="coverUrl"
                :alt="game.name"
                class="game-cover"
                width="80"
            >

            <div class="game-rating" v-if="game.esrb || game.pegi">
                <img
                    v-if="game.esrb"
                    :src='`/static/img/esrb/${esrb[game.esrb.rating]}.png`'
                    :alt="esrb.synopsis"
                >

                <img
                    v-if="game.pegi"
                    :src='`/static/img/pegi/${pegi[game.pegi.rating]}.png`'
                    :alt="game.pegi.synopsis"
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

    props: {
        gameId: [Number, String],
    },

    computed: {
        ...mapState(['game', 'pegi', 'esrb']),

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';
            return this.game && this.game.cover
                ? `${url}${this.game.cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        style() {
            const imageUrl = this.game && this.game.screenshots
                ? `background: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)}); background-size: cover;`
                : null;

            return imageUrl || '';
        },
    },

    methods: {
        getImageUrl(cloudinaryId) {
            return cloudinaryId
                ? `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${cloudinaryId}.jpg`
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .game-background {
        display: flex;
        min-height: 20vh;
        width: 100%;
        align-items: center;
        background-color: $nin-red;

        .game-cover {
            margin: 0 $gp;
            border: 5px solid $nin-white;
            background-size: contain;
            box-shadow: 0 0 5px 0 $nin-gray;
        }

        .game-rating {
            position: absolute;
            top: $gp;
            right: $gp;
            img {
                height: 50px;
            }
        }
    }
</style>
