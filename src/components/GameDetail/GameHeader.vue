<template lang="html">
    <div class="game-header">
        <img :src="coverUrl" :alt="game.name" class="game-cover" />

        <div class="game-rating" v-if="game.age_ratings">
            <img
                v-for="{ rating, synopsis, id } in game.age_ratings"
                :key="id"
                :src='`/static/img/age-ratings/${ageRatings[rating]}.png`'
                :alt="synopsis"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        gameId: [Number, String],
    },

    computed: {
        ...mapState(['game', 'platform']),
        ...mapGetters(['ageRatings']),

        coverUrl() {
            return this.game && this.game.cover
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.game.cover.image_id}.jpg`
                : '/static/no-image.jpg';
        },

        style() {
            return this.game && this.game.screenshots
                ? `background: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)}) center center no-repeat; background-size: cover;`
                : '';
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
    @import "~styles/styles";

    .game-header {
        display: flex;
        min-height: 20vh;
        width: 100%;
        position: relative;
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: $gp;
    }

    .game-cover {
        border: 5px solid var(--modal-text-color);
        background-size: contain;
        width: 100%;
        height: auto;

        @media($small) {
            border: 3px solid var(--modal-text-color);
            height: auto;
            width: auto;
            min-width: auto;
            max-width: 100%;
        }
    }

    .game-rating {
        margin-top: $gp;
        display: grid;
        grid-template-columns: auto auto;

        img {
            height: 60px;
            margin-left: $gp;

            @media($small) {
                display: none;
            }
        }
    }
</style>
