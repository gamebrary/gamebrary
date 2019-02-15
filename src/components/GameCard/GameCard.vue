<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img :src="coverUrl" @click="openDetails" :alt="game.name">

        <div class="game-info">
            <a @click="openDetails">
                <h4 v-text="game.name" />
            </a>

            <game-rating
                v-if="showGameRatings"
                :rating="game.rating"
                small
                @click.native="openDetails"
            />

            <div class="tags" v-if="!searchResult && tags">
                <div v-for="({ games, hex }, name) in tags" :key="name">
                    <button
                        class="tag small"
                        :style="`background-color: ${hex}`"
                        v-if="games.includes(game.id)"
                        @click="openTags"
                    >
                        {{ name }}
                    </button>
                </div>
            </div>

            <button
                v-if="searchResult"
                class="primary small tiny"
                @click="addGame"
            >
                <i class="fas fa-plus" />
                Add to {{ addToLabel }}
            </button>

            <div :class="['game-card-options', { dark: darkModeEnabled}]" v-else>
                <button
                    v-if="!searchResult"
                    :class="['small tiny', { 'accent filled': !darkModeEnabled, info: darkModeEnabled }]"
                    title="Drag game"
                >
                    <i class="far fa-hand-paper" />
                </button>

                <button
                    :class="['small tiny', { 'accent filled': !darkModeEnabled, info: darkModeEnabled }]"
                    @click="openTags"
                >
                    <i class="fas fa-tag" />
                </button>

                <button
                    v-if="list.games.includes(gameId)"
                    @click="removeGame"
                    title="Delete game"
                    :class="['small tiny error', { filled: !darkModeEnabled, info: darkModeEnabled }]"
                >
                    <i class="far fa-trash-alt" />
                </button>

                <button v-else @click="addGame" title="Add game">
                    <i class="fas fa-plus" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

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

        ...mapGetters(['darkModeEnabled']),

        showGameRatings() {
            return this.settings && !this.settings.hideGameRatings;
        },

        gameCardClass() {
            return [
                'game-card',
                {
                    'search-result': this.searchResult,
                    dark: this.darkModeEnabled,
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

        addToLabel() {
            return this.list.name.length >= 8
                ? 'list'
                : this.list.name;
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
        display: grid;
        grid-template-columns: $gameCoverWidth auto;

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

        .game-cover {
            display: flex;
            align-items: center;
        }

        img {
            width: $gameCoverWidth;
            height: auto;
            display: flex;
            align-self: center;
            cursor: pointer;
        }

        .game-info {
            padding: $gp / 2 $gp;
            width: 100%;

            .game-rating {
                margin: $gp / 2 0;
            }

            &:hover {
                a {
                    text-decoration: underline;
                }
            }

            a {
                color: $color-darkest-gray;
                cursor: pointer;
            }
        }

        &:hover {
            .game-card-options {
                opacity: 1;
            }
        }

        .game-card-options {
            opacity: 0;
            width: auto;
            transition: all 200ms linear;

            .game-drag-handle {
                @include drag-cursor;
            }
        }
    }

    .tags {
        margin: $gp / 2 0;
    }
</style>
