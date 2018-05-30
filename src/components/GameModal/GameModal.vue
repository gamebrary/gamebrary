<template lang="html">
    <md-dialog :md-active.sync="showGameModal">
        <div class="game-modal" v-if="game">
            <md-card>
                <md-card-media-cover md-text-scrim>
                    <md-button class="md-icon-button close md-dense" @click="showGameModal = false">
                      <md-icon>close</md-icon>
                    </md-button>


                    <div class="game-title">
                        <img
                            :src="coverUrl(game.cover.cloudinary_id)"
                            :alt="game.name"
                            class="game-cover"
                            width="80"
                        >

                        <h1>{{ game.name }}</h1>
                    </div>

                    <md-card-media md-ratio="16:9">
                        <img :src="getImageUrl(game.screenshots[0].cloudinary_id)" alt="">
                    </md-card-media>
                </md-card-media-cover>

                <md-card-content>
                    <md-tabs md-dynamic-height>
                        <md-tab md-label="About">
                            {{game.summary}}
                        </md-tab>

                        <md-tab
                            v-if="game.screenshots"
                            :md-label="`Screenshots (${game.screenshots.length})`"
                        >
                            <img
                                :src="getImageUrl(img.cloudinary_id)"
                                :key="index"
                                v-for="(img, index) in game.screenshots"
                                class="image"
                            >
                        </md-tab>

                        <md-tab :md-label="`Videos (${game.videos.length})`" v-if="game.videos">
                            <div
                                class="video"
                                v-for="{ video_id } in game.videos"
                                :key="video_id"
                            >
                                <iframe
                                    :src="`https://www.youtube.com/embed/${video_id}?rel=0&autohide=1`"
                                    frameborder="0"
                                    allow="autoplay; encrypted-media"
                                    allowfullscreen
                                />
                            </div>
                        </md-tab>
                    </md-tabs>
                </md-card-content>
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
    },

    mounted() {
        this.$bus.$on('OPEN_GAME_MODAL', (id) => {
            this.showGameModal = true;
            this.id = id;
        });
    },

    methods: {
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

    .close {
        margin: 0;
        position: absolute;
        top: $gp / 2;
        right: $gp / 2;

        .md-icon.md-theme-default {
            color: $nin-white;
        }
    }

    .md-dialog {
        max-width: 768px;
    }

    .game-modal {
        overflow: auto;
    }

    .md-dialog-container .md-tabs-navigation {
        padding: 0;
    }

    .game-title {
        display: grid;
        grid-template-columns: 100px auto;
        grid-gap: $gp;
        position: absolute;
        bottom: -$gp;
        z-index: 99999;
        width: 100%;
        align-items: center;

        .game-cover {
            margin: 0 $gp;
            border: 5px solid $nin-white;
            box-shadow: 0 0 5px 0 $nin-gray;
        }

        h1 {
            color: $nin-white;
            text-shadow: 0 0 5px $nin-black;
        }
    }

    .video {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;
        height: 0;
    }
    .video iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
