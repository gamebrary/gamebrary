<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img :src="coverUrl" @click="openDetails" :alt="game.name">

        <div class="game-info">
            <h4 v-text="game.name" @click="openDetails" />

            <game-rating
                v-if="showGameRating"
                :rating="game.rating"
                small
            />

            <div class="tags" v-if="tags">
                <div v-for="({ games, hex }, name) in tags" :key="name">
                    <button
                        class="tag small"
                        :style="`background-color: ${hex}`"
                        v-if="games.includes(game.id)"
                    >
                        {{ name }}
                    </button>
                </div>
            </div>

            <button
                v-if="searchResult"
                class="primary small"
                @click="addGame"
            >
                <i class="fas fa-plus" />
            </button>
        </div>

        <div class="game-card-options" v-if="!searchResult">
            <button
                v-if="!searchResult"
                class="game-drag-handle accent small filled"
                title="Drag game"
            >
                <i class="far fa-hand-paper" />
            </button>

            <button
                class="accent small filled"
                @click="openTags"
            >
                <i class="fas fa-tag" />
            </button>

            <button
                v-if="list.games.includes(gameId)"
                @click="removeGame"
                title="Delete game"
                class="small error filled"
                :class="{ accent: settings && !settings.nightMode }"
            >
                <i class="far fa-trash-alt" />
            </button>

            <button v-else @click="addGame" title="Add game">
                <i class="fas fa-plus" />
            </button>
        </div>
    </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        GameRating,
    },

    props: {
        gameId: Number,
        listId: Number,
        searchResult: Boolean,
    },

    computed: {
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags']),

        showGameRating() {
            return this.settings && this.settings.showGameRatings && !this.searchResult;
        },

        gameCardClass() {
            return [
                'game-card',
                {
                    'search-result': this.searchResult,
                    dark: this.settings && this.settings.nightMode,
                },
            ];
        },

        activePlatform() {
            return this.gameLists[this.platform.code];
        },

        list() {
            return this.activePlatform[this.listId];
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
    },

    methods: {
        openDetails() {
            this.$bus.$emit('OPEN_GAME', this.game.id);
        },

        openTags() {
            this.$bus.$emit('OPEN_TAGS', this.game.id);
        },

        addGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$emit('added');
            this.$store.commit('ADD_GAME', data);

            this.$ga.event({
                eventCategory: 'game',
                eventAction: 'add',
                eventLabel: 'addGame',
                eventValue: data,
            });

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'Game added to list' });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        removeGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$store.commit('REMOVE_GAME', data);

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'Game removed' });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    $gameCoverWidth: 80px;

    .game-card {
        background-color: $color-white;
        margin-top: $gp / 2;
        position: relative;
        display: flex;
        align-items: center;

        &.card-placeholder {
            background: $color-light-gray;
            outline: 1px dashed $color-gray;
            opacity: 0.6;

            .game-card-options {
                display: none;
            }
        }

        &.dark {
            background: $color-gray;

            img {
                opacity: 0.9;
            }
        }

        &:hover {
            .game-card-options {
                transition: opacity 300ms ease;
                opacity: 1;
                pointer-events: all;
            }
        }

        img {
            width: $gameCoverWidth;
            height: auto;
            display: flex;
            cursor: pointer;
        }

        .game-info {
            padding: $gp / 2 $gp;
            width: calc(100% - 116px);

            a {
                text-decoration: none;
                color: $color-dark-gray;
            }

            h4 {
                margin: 0;
            }
        }

        .game-card-options {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            top: 0;
            right: 0;
            transition: opacity 300ms ease;
            width: $iconSmallSize + $gp / 4;

            button {
                margin-top: $gp / 4;
            }

            .game-drag-handle {
                @include drag-cursor;
            }
        }
    }
</style>
