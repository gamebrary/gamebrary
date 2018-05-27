<template lang="html">
    <at-modal v-model="showGameModal" :styles="modalStyles" show-close :show-footer="false">
        <div class="game-modal" v-if="game">
            <div class="hero">
                <img :src="getImageUrl(game.screenshots[0].cloudinary_id)" alt="">
            </div>

            <div class="content">
                <div class="header">
                    <img :src="coverUrl(game.cover.cloudinary_id)" alt="" class="cover">
                    <div class="description">
                        <span class="title">
                            {{game.name}}
                            <at-tag color="success">{{Math.round(game.aggregated_rating)}}</at-tag>
                        </span>
                        <p class="summary">{{game.summary}}</p>
                    </div>
                </div>

                <img
                    :src="getImageUrl(img.cloudinary_id)"
                    :key="img"
                    v-for="img in game.screenshots"
                    class="image"
                >
            </div>
            <img
              :src="image"
              :key="image"
              v-for="image in game.screenshots"
            >
        </div>
    </at-modal>
</template>

<script>
export default {
    data() {
        return {
            showGameModal: false,
            id: null,
            modalStyles: {
                top: '20px',
                width: '720px',
                maxWidth: '100%',
            },
        };
    },

    computed: {
        gameData() {
            return this.$store.state.games;
        },

        game() {
            return this.gameData[this.id];
        },
    },

    mounted() {
        this.$bus.$on('OPEN_GAME_MODAL', (id) => {
            this.showGameModal = true;
            this.id = id;
        });
    },

    methods: {
        getImageUrl(cloudinaryId) {
            return `https://images.igdb.com/igdb/image/upload/t_720p/${cloudinaryId}.jpg`;
        },

        coverUrl(cloudinaryId) {
            return `https://images.igdb.com/igdb/image/upload/t_720p/${cloudinaryId}.jpg`;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .at-modal {
        background: #cfc;
        top: $gp !important;
    }

    .game-modal {
        height: calc(100vh - 100px);
        overflow: auto;

    }

    .hero {
        height: 240px;
        overflow: hidden;
        background: $nin-red;

        img {
            width: 100%;
        }
    }

    .content {
        margin-top: -240px;
        width: 100%;
        height: 100%;

        .title {
            font-size: 24px;
            font-weight: bold;

        }

        .header {
            display: flex;
            align-items: flex-start;
            height: 200px;
            margin: 140px $gp * 2 $gp * 2;

            .cover {
                height: 200px;
                width: auto;
                display: block;
                padding: $gp;
                background: $nin-lt-gray;
            }
        }

        .description {
            padding: $gp;
            min-height: 100px;
            margin-top: 100px;
        }

        img {
            width: calc(100% / 3);
            height: auto;
        }
    }
</style>
