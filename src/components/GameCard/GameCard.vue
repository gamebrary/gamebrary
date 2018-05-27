<template lang="html">
    <div class="game" v-if="gameId && gameData">
        <img
            width="80"
            :src="coverUrl"
            @click="openGame"
        />

        <div>
            <h2>{{ game.name }}</h2>

            <at-button v-if="list.games.includes(gameId)" @click="removeGame">Remove</at-button>
            <at-button v-else @click="addGame">Add</at-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        gameId: Number,
        listId: Number,
    },

    computed: {
        list() {
            return this.$store.state.user.lists[this.listId];
        },

        game() {
            return this.gameData[this.gameId];
        },

        gameData() {
            return this.$store.state.games;
        },

        coverUrl() {
            const url = 'https://images.igdb.com/igdb/image/upload/t_720p/';
            return this.gameData && this.gameData[this.gameId].cover
                ? `${url}${this.gameData[this.gameId].cover.cloudinary_id}.jpg`
                : null;
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
            this.$bus.$emit('OPEN_GAME_MODAL', this.gameId);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .game {
        color: $nin-black;
        width: 100%;
        // height: 80px;
        // margin: 10px;
        // overflow: auto;
        display: grid;
        grid-template-columns: 100px auto;
        grid-gap: 10px;

        cursor: grab;
        background: $nin-white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        border-radius: $border-radius;
    }

    h2 {
        font-size: 14px;
    }

    .game img {
        width: 100px;
        height: auto;
        margin-bottom: 5px;
    }
</style>
