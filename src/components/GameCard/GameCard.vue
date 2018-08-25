<template lang="html">
    <md-card v-if="gameId && games" :class="{ nightMode }">
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
                    {{ parseInt(game.rating) }}
                </div>
            </md-card-header-text>

            <md-button
                v-if="!searchResult"
                class="md-dense md-icon-button game-drag-handle"
            >
                <md-icon>drag_handle</md-icon>
            </md-button>

            <md-button
                v-if="list.games.includes(gameId)"
                class="md-dense md-icon-button trash"
                @click="removeGame"
            >
                <md-icon>delete</md-icon>
            </md-button>

            <md-button
                v-else
                class="md-dense md-icon-button md-default trash"
                @click="addGame"
            >
                <md-icon>add</md-icon>
            </md-button>
        </md-card-header>
    </md-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        gameId: Number,
        listId: Number,
        searchResult: Boolean,
    },

    computed: {
        ...mapState(['user', 'games']),

        list() {
            return this.user.lists[this.listId];
        },

        game() {
            return this.games[this.gameId];
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';
            return this.games && this.games[this.gameId].cover
                ? `${url}${this.games[this.gameId].cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        nightMode() {
            return this.user && this.user.settings ? this.user.settings.nightMode : null;
        },

        showGameRating() {
            return this.user && this.user.settings.showGameRatings && Boolean(Number(this.game.rating));
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
                this.$bus.$emit('TOGGLE_DRAWER', {
                    panelName: 'game',
                    gameId: this.game.id,
                });

                this.$router.push({
                    name: 'game',
                    params: {
                        id: this.game.id,
                        slug: this.game.slug,
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .md-card {
        min-height: 100px;
        width: 100%;
        margin: 0 0 $gp / 2;

        &:last-child {
            margin-bottom: 0;
        }
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
            white-space: normal;
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
