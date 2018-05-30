<template lang="html">
    <md-dialog :md-active.sync="showGameModal">
        <div class="game-modal" v-if="game">
            <md-card class="md-card-example">
                <md-card-media-cover md-text-scrim>
                    <md-button class="md-icon-button close md-dense" @click="showGameModal = false">
                      <md-icon>close</md-icon>
                    </md-button>
                    <md-card-media md-ratio="16:9">
                        <img :src="getImageUrl(game.screenshots[0].cloudinary_id)" alt="">
                    </md-card-media>

                    <md-card-area>
                        <md-card-header>
                            <div class="md-subhead">
                                <img
                                    :src="coverUrl(game.cover.cloudinary_id)"
                                    :alt="game.name"
                                    class="cover"
                                    width="80"
                                >

                                <span class="md-title">
                                    {{ game.name }}
                                </span>
                            </div>
                        </md-card-header>
                    </md-card-area>
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
                            <iframe
                                v-for="{ video_id } in game.videos"
                                :key="video_id"
                                :src="`https://www.youtube.com/embed/${video_id}?rel=0&autohide=1`"
                                frameborder="0"
                                allow="autoplay; encrypted-media"
                                allowfullscreen
                            />
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

    .md-card-media-cover .md-subhead {
        bottom: -$gp;
        position: absolute;
    }

    .cover {
        padding-right: $gp;
    }
</style>
