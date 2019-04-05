<template lang="html">
    <div v-if="gameId && games[gameId]" :class="gameCardClass">
        <img :src="coverUrl" @click="openDetails" :alt="game.name">

        <div class="game-info">
            <a v-text="game.name" @click="openDetails" />

            <i
                v-if="!searchResult"
                class="fas fa-grip-vertical game-drag-handle"
            />

            <game-rating
                v-if="showGameRatings"
                :rating="game.rating"
                small
                @click.native="openDetails"
            />

            <i class="fas fa-tag tags" @click="openTags" v-if="!searchResult && hasTags" />

            <div class="game-tags" v-if="!searchResult && hasTags && list.view !== 'covers'">
                <div
                    v-for="({ games, hex }, name) in tags"
                    :key="name"
                    v-if="games.includes(game.id)"
                >
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
                class="primary small tiny add-to-list"
                @click="addGame"
            >
                <i class="fas fa-plus" />
                Add to {{ addToLabel }}
            </button>

            <div v-else>
                <i
                    class="far fa-trash-alt delete-game"
                    v-if="list.games.includes(gameId)"
                    title="Delete game"
                    @click="removeGame"
                />

                <button v-if="!list.games.includes(gameId)" @click="addGame" title="Add game">
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

    data() {
        return {
            showEditOptions: false,
        };
    },

    computed: {
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user', 'tags', 'activeList']),

        ...mapGetters(['darkModeEnabled']),

        showGameRatings() {
            return this.settings && !this.settings.hideGameRatings;
        },

        gameCardClass() {
            return [
                'game-card',
                this.list.view,
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

        hasTags() {
            return Object.keys(this.tags) && Object.keys(this.tags).length > 0;
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
    @import "src/styles/styles.scss";

    $gameCoverWidth: 80px;

    .game-card {
        background-color: $color-white;
        margin-top: $gp / 2;
        position: relative;
        display: grid;
        grid-template-columns: $gameCoverWidth auto;

        &.wide {
            grid-template-columns: $gameCoverWidth * .75 auto;

            img {
                width: $gameCoverWidth * .75;
            }
        }

        &.covers {
            display: flex;
            flex-direction: column;
            background: #000;

            img {
                width: 100%;
                border-radius: $border-radius / 2;
            }

            .game-drag-handle {
                top: auto;
                bottom: $gp * 2.75;
            }

            .game-info {
                position: absolute;
                padding: $gp / 3;
                font-size: 10px;
                min-height: 40px;
                bottom: 0;
                background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);


                a {
                    color: $color-white;
                    margin-right: $gp / 1.5;
                }

                .tag {
                    font-size: 10px;
                }
            }
        }

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
            flex-direction: column;

            .game-tags {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-top: $gp / 4;
            }

            i.tags {
                position: absolute;
                bottom: $gp * 1.5;
                right: $gp / 4;
            }

            .game-rating, a {
                display: inline-flex;
                font-weight: bold;
            }

            &:hover {
                a {
                    text-decoration: underline;
                }
            }

            a {
                color: $color-darkest-gray;
                cursor: pointer;
                margin-right: $gp / 2;
            }
        }

        .game-drag-handle {
            @include drag-cursor;
            position: absolute;
            color: $color-light-gray;
            right: $gp / 3;
            top: $gp / 3;

            &:hover {
                color: $color-gray;
            }
        }

        .delete-game {
            position: absolute;
            color: $color-light-gray;
            bottom: $gp / 3;
            right: $gp / 3;

            &:hover {
                color: $color-red;
            }
        }

        .tags {
            color: $color-light-gray;

            &:hover {
                color: $color-blue;
            }
        }

        .game-tag {
            margin-bottom: $gp / 3;
        }
    }

    .add-to-list {
        background: #cf0;
        margin-top: $gp / 2;
    }
</style>
