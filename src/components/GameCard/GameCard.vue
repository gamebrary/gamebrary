<template lang="html">
    <md-card v-if="gameId && gameData" :class="{ nightMode }">
        <md-card-header>
            <md-card-media @click.native="openGame">
                <img
                    width="80"
                    :src="coverUrl"
                />
            </md-card-media>

            <md-card-header-text @click="openGame">
                <h4 class="game-title">{{ game.name }}</h4>

                <div v-if="showGameRating" class="game-rating">
                    {{ parseInt(game.aggregated_rating) }}
                </div>
            </md-card-header-text>

            <md-button
                v-if="!searchResult"
                class="md-dense md-icon-button md-primary game-drag-handle"
            >
                <md-icon>drag_handle</md-icon>
            </md-button>

            <md-button
                v-if="list.games.includes(gameId)"
                class="md-dense md-icon-button md-primary trash"
                @click="removeGame"
            >
                <md-icon>delete</md-icon>
            </md-button>

            <md-button
                v-else
                class="md-dense md-icon-button md-primary trash"
                @click="addGame"
            >
                <md-icon>add</md-icon>
            </md-button>
        </md-card-header>
    </md-card>
</template>

<script>
export default {
    props: {
        gameId: Number,
        listId: Number,
        searchResult: Boolean,
    },

    computed: {
        list() {
            return this.$store.state.user.lists[this.listId];
        },

        settings() {
            return this.$store.state.user.settings;
        },

        game() {
            return this.gameData[this.gameId];
        },

        gameData() {
            return this.$store.state.games;
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';
            return this.gameData && this.gameData[this.gameId].cover
                ? `${url}${this.gameData[this.gameId].cover.cloudinary_id}.jpg`
                : null;
        },

        nightMode() {
            return this.$store.state.user.settings.nightMode;
        },

        showGameRating() {
            return this.settings.showGameRatings && Boolean(Number(this.game.aggregated_rating));
        },
    },

    methods: {
        addGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$store.commit('ADD_GAME', data);
            this.$store.dispatch('UPDATE_LISTS');
        },

        removeGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$store.commit('REMOVE_GAME', data);
            this.$store.dispatch('UPDATE_LISTS');
        },

        openGame() {
            if (!this.searchResult) {
                this.$router.push({
                    name: 'game',
                    params: {
                        id: this.game.id,
                        slug: this.game.slug,
                    },
                });

                this.$bus.$emit('OPEN_GAME_MODAL', this.gameId);
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .md-card {
        min-height: 100px;
    }

    .md-card-media, .md-card-header-text h2 {
        cursor: pointer;
    }

    .card-placeholder {
        opacity: 0.25;
    }

    .md-card-header {
        height: auto;
        padding: $gp / 2;
        margin: 0;

        .trash {
            position: absolute;
            bottom: 10px;
            right: 14px;
        }

        .game-drag-handle {
            position: absolute;
            top: 10px;
            right: 8px;
        }
    }

    .md-card-media {
        height: auto;
        margin: 0 $gp 0 0;
    }

    .md-card-header-text {
        margin-right: $gp * 2;

        .game-title {
            margin: 0;
        }
    }

    .game-rating {
        padding: 4px 6px;
        border-radius: 2px;
        font-size: 11px;
        line-height: 11px;
        background: $zelda-green;
        color: $nin-white;
        display: inline-flex;
        align-items: center;
    }

    .nightMode {
        background: $nin-dk-gray;

        h4 {
            color: $nin-gray;
        }
    }

</style>
