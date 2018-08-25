<template lang="html">
    <div class="public-game-board">
        <span v-if="!loaded && !error">
            Loading...
        </span>
        <div class="lists" v-if="loaded">
            <div
                class="list"
                v-for="(list, index) in lists"
                :key="index"
            >
                <div class="list-header">
                    {{ list.name }} ({{ list.games.length }})
                </div>

                <div class="games">
                    <md-card v-for="game in list.games" :key="game">
                        <md-card-header>
                            <md-card-media>
                                <img
                                    width="80"
                                    :src="getGameCover(game)"
                                />
                            </md-card-media>

                            <md-card-header-text>
                                <h4 class="game-title">{{ games[game].name }}</h4>

                                <div class="game-rating">
                                    {{ parseInt(games[game].rating) }}
                                </div>
                            </md-card-header-text>
                        </md-card-header>
                    </md-card>
                </div>
            </div>
        </div>

        <div v-if="error">
            ERROR
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loaded: false,
            lists: null,
            error: false,
            games: {},
        };
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            const listId = this.$route.params.id;

            if (listId) {
                this.$store.dispatch('LOAD_SHARE_LIST', listId)
                    .then((lists) => {
                        this.lists = lists;
                        this.loadGameData();
                    })
                    .catch(() => {
                        this.error = true;
                    });
            }
        },

        getGameCover(id) {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';

            return this.games && this.games[id].cover
                ? `${url}${this.games[id].cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        loadGameData() {
            const gameList = [];
            this.lists.forEach((list) => {
                if (list && list.games.length) {
                    list.games.forEach((id) => {
                        if (!gameList.includes(id)) {
                            gameList.push(id);
                        }
                    });
                }
            });

            this.$store.dispatch('LOAD_SHARE_GAMES', gameList)
                .then((data) => {
                    this.loaded = true;
                    data.forEach((game) => {
                        this.games[game.id] = { ...game };
                    });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";
    @import "~styles/game-board.scss";
</style>
