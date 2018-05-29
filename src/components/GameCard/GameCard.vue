<template lang="html">
    <md-card>
        <md-card-header>
            <md-card-media @click.native="openGame">
                <img
                    width="80"
                    :src="coverUrl"
                />
            </md-card-media>

            <md-card-header-text @click="openGame">
                <h4>{{ game.name }}</h4>
            </md-card-header-text>

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

    .md-card-media, .md-card-header-text h2 {
        cursor: pointer;
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
    }

    .md-card-media {
        height: auto;
        margin: 0 $gp 0 0;
    }

    .md-card-header-text {
        .md-title {
            margin-top: 0;
        }

    }

</style>
