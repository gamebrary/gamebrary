<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <router-link tag="img" :to="gameRoute" :src="coverUrl" />

        <div class="game-info">
            <h4 v-text="game.name" />
            <game-rating v-if="showGameRating" small :rating="game.rating" />

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
                class="game-drag-handle info small hollow"
                title="Drag game"
            >
                <i class="fas fa-hand-rock" />
            </button>

            <button
                v-if="list.games.includes(gameId)"
                @click="removeGame"
                title="Delete game"
                class="small error hollow"
                :class="{ accent: settings && !settings.nightMode }"
            >
                <i class="fas fa-trash" />
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
import { $success, $error } from '@/shared/modals';
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
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user']),

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

        gameRoute() {
            const { id, slug } = this.game;

            return {
                name: 'game-detail',
                params: { id, slug },
            };
        },
    },

    methods: {
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
                    $success('List saved');
                })
                .catch(() => {
                    $error('Authentication error');
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
                    $success('List saved');
                })
                .catch(() => {
                    $error('Authentication error');
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

            h4 {
                margin: 0;
            }
        }

        .game-card-options {
            position: absolute;
            opacity: 0;
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
