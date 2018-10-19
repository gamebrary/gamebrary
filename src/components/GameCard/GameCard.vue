<template lang="html">
    <div
        v-if="gameId && games"
        :class="['game-card', { nightMode, 'search-result': searchResult }]"
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
                v-if="user.settings && user.settings.showGameRatings && !searchResult"
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
            return this.user
                && this.user.settings.showGameRatings
                && Boolean(Number(this.game.rating));
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
