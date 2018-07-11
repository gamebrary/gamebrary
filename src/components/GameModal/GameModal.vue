<template lang="html">
    <div class="game-modal" v-if="game">
        <md-card>
            <div class="game-header">
                <div class="game-background" :style="style">
                    <img
                        :src="coverUrl"
                        :alt="game.name"
                        class="game-cover"
                        width="80"
                    >
                </div>

                <h2
                    class="game-title"
                    :class="{ small: game.name.length > 28 }"
                >{{ game.name }}</h2>

                <md-divider></md-divider>
            </div>

            <p class="game-description">{{ game.summary }}</p>

            <div v-if="game.screenshots">
                <h3>Screenshots ({{ game.screenshots.length }})</h3>

                <div class="game-screenshots no-wrap">
                    <img
                        v-if="game.screenshots"
                        :src="getImageUrl(img.cloudinary_id)"
                        :key="index"
                        v-for="(img, index) in game.screenshots"
                        class="image"
                    >
                </div>
            </div>

            <h3>Videos ({{ game.videos.length }})</h3>

            <div class="game-videos no-wrap">
                <div
                    class="game-video"
                    v-for="{ video_id } in game.videos"
                    :key="video_id"
                >
                    <iframe
                        :src="`https://www.youtube.com/embed/${video_id}?rel=0&autohide=1`"
                        frameborder="0"
                        width="426"
                        height="240"
                        allow="autoplay; encrypted-media"
                        allowfullscreen
                    />
                </div>
            </div>
        </md-card>
    </div>
</template>

<script>
export default {
    props: {
        gameId: [Number, String],
    },

    data() {
        return {
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
            return this.gameId ? this.gameData[this.gameId] : null;
        },

        style() {
            const imageUrl = this.game && this.game.screenshots
                ? `background-image: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)})`
                : null;

            return imageUrl || '';
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';
            return this.gameData && this.gameData[this.gameId].cover
                ? `${url}${this.gameData[this.gameId].cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },
    },

    methods: {
        getVideoUrl(id) {
            return `https://www.youtube.com/embed/${id}?rel=0&autohide=1`;
        },

        getImageUrl(cloudinaryId) {
            return cloudinaryId
                ? `https://images.igdb.com/igdb/image/upload/t_720p/${cloudinaryId}.jpg`
                : null;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    h3 {
        margin: $gp;
    }

    .md-dialog-container .md-tabs-navigation {
        padding: 0;
    }

    .game-background {
        display: flex;
        background-size: cover;
        min-height: 20vh;
        width: 100%;
        align-items: center;
        background: $nin-lt-gray;

        .game-cover {
            margin: 0 $gp;
            border: 5px solid $nin-white;
            box-shadow: 0 0 5px 0 $nin-gray;
        }
    }

    .game-title {
        padding: $gp / 2 $gp;
        margin: 0;
        line-height: 1.5rem;
        height: 40px;
        background: rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.small {
            @media($medium) {
                font-size: 18px;
            }

            @media($small) {
                font-size: 16px;
            }
        }
    }

    .game-description {
        padding: 0 $gp;
        font-size: .8rem;
    }

    .no-wrap {
        overflow: auto;
        white-space: nowrap;
    }

    .game-screenshots {
        img {
            height: 100px;
            width: auto;
        }
    }

    .game-video {
        margin-top: $gp;
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100% !important;
        }
    }
</style>
