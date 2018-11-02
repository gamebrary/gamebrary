<template lang="html">
    <div class="public-game-board">
        Under construction
        <!-- <span v-if="loading">Loading...</span> -->

        <!-- <div class="lists" v-if="!loading && games">
            <div class="list" v-for="list in lists" :key="list">
                <div class="list-header">
                    {{ list.name }} ({{ list.games.length }})
                </div>

                <div class="empty-list" v-if="!list.games.length">
                    <img src="/static/img/empty-collection.png">
                    <h3>This collection is empty</h3>
                </div>

                <div class="games" v-else>
                    <img
                        v-for="game in list.games" :key="game"
                        :src="getGameCover(game)"
                    />
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import Panel from '@/components/Panel/Panel';
import toasts from '@/mixins/toasts';
// import { mapState } from 'vuex';

export default {
    components: {
        Panel,
    },

    mixins: [toasts],

    data() {
        return {
            loading: true,
            lists: null,
            games: {},
        };
    },

    mounted() {
        this.load();
    },

    methods: {
        load() {
            // const listId = this.$route.params.id;

            // db.collection('lists').doc(this.user.uid).get()
            //     .then((doc) => {
            //         if (doc.exists) {
            //             this.$store.commit('SET_GAME_LISTS', doc.data());
            //         } else {
            //             this.initList();
            //         }
            //     })
            //     .catch(() => {
            //         this.$error('Authentication error');
            //     });

            // if (listId) {
            //     this.$store.dispatch('LOAD_SHARE_LIST', listId)
            //         .then((lists) => {
            //             this.lists = lists;
            //             this.loadGameData();
            //         })
            //         .catch(() => {
            //             this.loading = false;
            //             this.$error('Error loading list');
            //         });
            // }
        },

        getGameCover(id) {
            const url = 'https://images.igdb.com/igdb/image/upload/t_cover_small/';

            return this.games && this.games[id].cover
                ? `${url}${this.games[id].cover.cloudinary_id}.jpg`
                : '/static/no-image.jpg';
        },

        loadGameData() {
            // TODO: Refactor this mess

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

            if (gameList.length > 0) {
                this.$store.dispatch('LOAD_SHARE_GAMES', gameList)
                    .then((data) => {
                        this.loading = false;

                        data.forEach((game) => {
                            this.games[game.id] = { ...game };
                        });
                    });
            } else {
                this.loading = false;
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "~styles/game-board.scss";

    .back {
        margin: $gp $gp 0;
    }

    img {
        padding: $gp / 4;
    }
</style>
