<template lang="html">
    <div
        v-if="gameId && games[gameId]"
        :class="['game-card', { 'search-result': searchResult, dark: settings.nightMode }]"
    >
        <img :src="coverUrl" v-if="searchResult" width="50" />

        <router-link
            v-else
            :to="{ name: 'game-detail', params: { id: this.game.id, slug: this.game.slug } }"
        >
            <img :src="coverUrl" width="80" />
        </router-link>

        <div class="game-info">
            <h4 class="game-title">{{ game.name }}</h4>

            <game-rating
                v-if="settings && settings.showGameRatings && !searchResult"
                small
                :rating="game.rating"
            />

            <button class="primary hollow small" @click="addGame" v-if="searchResult">
                <i class="fas fa-plus" />
                Add to list
            </button>
        </div>

        <div class="options" v-if="!searchResult">
            <button
                v-if="!searchResult"
                class="game-drag-handle accent small hollow"
                title="Drag game"
            >
                <i class="fas fa-hand-rock" />
            </button>

            <button
                v-if="list.games.includes(gameId)"
                @click="removeGame"
                title="Delete game"
                class="accent small hollow"
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
import firebase from 'firebase';
import toasts from '@/mixins/toasts';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        GameRating,
    },

    mixins: [toasts],

    props: {
        gameId: Number,
        listId: Number,
        searchResult: Boolean,
    },

    computed: {
        ...mapState(['settings', 'games', 'gameLists', 'platform', 'user']),

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
        addGame() {
            const data = {
                listId: this.listId,
                gameId: this.gameId,
            };

            this.$emit('added');
            this.$store.commit('ADD_GAME', data);

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$success('List saved');
                })
                .catch(() => {
                    this.$error('Authentication error');
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
                    this.$success('List saved');
                })
                .catch(() => {
                    this.$error('Authentication error');
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "~styles/game-board.scss";

    .game-card {
        background-color: $color-white;
        margin-bottom: $gp / 2;
        position: relative;
        display: grid;
        grid-template-columns: 80px auto 40px;

        &.dark {
            background: $color-gray;

            img {
                opacity: 0.9;
            }
        }

        &.search-result {
            grid-template-columns: 50px auto 0;

            .game-title { margin-bottom: $gp / 2; }
            .game-info { padding: $gp / 2; }
        }

        .game-info { padding: $gp / 2 $gp; }
        .game-title { margin: 0; }

        &:hover {
            .options {
                transition: all 300ms ease;
                max-height: 100px;
                opacity: 1;
            }
        }

        .options {
            opacity: 0;
            transition: all 300ms ease;
            max-height: 0;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            flex-direction: column;
            transition: all 300ms ease;

            .game-drag-handle {
                @include drag-cursor;
            }
        }
    }
</style>
