<template lang="html">
    <div class="game-header" :style="style">
        <img :src="coverUrl" :alt="game.name" class="game-cover" />

        <div class="game-rating" v-if="hasRatings">
            <img
                v-if="game.esrb"
                :src='`/static/img/esrb/${igdb.esrb[game.esrb.rating]}.png`'
                :alt="game.esrb.synopsis"
            >

            <img
                v-if="game.pegi"
                :src='`/static/img/pegi/${igdb.pegi[game.pegi.rating]}.png`'
                :alt="game.pegi.synopsis"
            >
        </div>
    </div>
</template>

<script>
import igdb from '@/shared/igdb';
import { mapState } from 'vuex';

export default {
    props: {
        gameId: [Number, String],
    },

    data() {
        return {
            igdb,
        };
    },

    computed: {
        ...mapState(['game']),

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_big/';
            return this.game && this.game.cover
                ? `${url}${this.game.cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        style() {
            return this.game && this.game.screenshots
                ? `background-image: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)});`
                : '';
        },

        hasRatings() {
            return this.game.esrb || this.game.pegi;
        },
    },

    methods: {
        getImageUrl(cloudinaryId) {
            return cloudinaryId
                ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${cloudinaryId}.jpg`
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .game-header {
        display: flex;
        min-height: 20vh;
        width: 100%;
        position: relative;
        align-items: center;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 50%;
        background-color: $color-red;

        @media($small) {
            background-size: cover;
            background-position: center;
        }

        .game-cover {
            margin: $gp;
            border: 5px solid $color-white;
            background-size: contain;
            height: 200px;

            @media($small) {
                border: 3px solid $color-white;
                height: 140px;
            }
        }

        .game-rating {
            position: absolute;
            top: $gp;
            right: $gp;

            img {
                height: 60px;
                margin-left: $gp;

                @media($small) {
                    margin-left: 0;
                    height: 50px;
                }
            }
        }
    }
</style>
