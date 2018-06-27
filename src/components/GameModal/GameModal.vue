<template lang="html">
    <md-dialog
        :md-active.sync="showGameModal"
        @md-closed="close"
    >
        <div class="game-modal" v-if="game">
            <md-card>
                <div class="game-header">
                    <div class="game-background" :style="style">
                        <md-button
                            class="md-icon-button close md-dense"
                            @click="close"
                        >
                            <md-icon>close</md-icon>
                        </md-button>

                        <img
                            :src="coverUrl(game.cover.cloudinary_id)"
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
    </md-dialog>
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

        style() {
            const imageUrl = this.game && this.game.screenshots
                ? `background-image: url(${this.getImageUrl(this.game.screenshots[0].cloudinary_id)})`
                : null;

            return imageUrl || '';
        },
    },

    mounted() {
        this.$bus.$on('OPEN_GAME_MODAL', (id) => {
            this.showGameModal = true;
            this.id = id;
        });
    },

    methods: {
        close() {
            this.showGameModal = false;
            this.$router.push({ name: 'home' });
        },

        getVideoUrl(id) {
            return `https://www.youtube.com/embed/${id}?rel=0&autohide=1`;
        },

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

    .game-modal {
        overflow: auto;
        margin-top: 20vh;
        padding-top: 30px;
    }

    // h3 {
    //     margin: $gp;
    // }

    .close {
        @include floating-close-button;
        z-index: 999999;

        .md-icon.md-theme-default {
            color: $nin-white;
        }
    }

    .md-dialog-container .md-tabs-navigation {
        padding: 0;
    }

    .game-header {
        position: fixed;
        width: 100%;
        height: 20vh;
        top: 0;
        z-index: 1;
    }

    .game-background {
        display: flex;
        background-size: cover;
        min-height: 20vh;
        width: 100%;
        align-items: center;

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
