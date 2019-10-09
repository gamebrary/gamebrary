<template lang="html">
    <main>
        <game-board-placeholder v-if="loading" />

        <section
            v-if="!loading && listData && publicGameData"
            v-for="list in listData"
            :key="list.name"
        >
            <header>{{ list.name }} ({{ list.games.length }})</header>

            <div class="games">
                <p v-if="!list.games.length">{{$('list.emptyList')}}</p>

                <div
                    v-if="publicGameData[game]"
                    class="game-card"
                    v-for="game in list.games"
                    :key="game"
                >
                    <img
                        v-if="publicGameData[game].cover"
                        height="30"
                        :src="`https://images.igdb.com/igdb/image/upload/t_cover_small/${publicGameData[game].cover.cloudinary_id}.jpg`"
                    />

                    <strong>{{ publicGameData[game].name }}</strong>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import firebase from 'firebase/app';
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import { mapState } from 'vuex';

import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        GameBoardPlaceholder,
    },

    data() {
        return {
            loading: true,
            listData: null,
        };
    },

    computed: {
        ...mapState(['publicGameData']),
    },

    mounted() {
        this.load();
    },

    methods: {
        load() {
            const { id, list } = this.$route.query;

            const message = this.$t('errors.loading');

            // TOOD: move to actions
            db.collection('lists').doc(id).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.listData = data[list];
                        this.loadGameData();
                    }
                })
                .catch(() => {
                    this.loading = false;
                    this.$bus.$emit('TOAST', { message, type: 'error' });
                });
        },

        loadGameData() {
            const gameList = [];

            this.listData.forEach((list) => {
                if (list && list.games.length) {
                    list.games.forEach((id) => {
                        if (!gameList.includes(id)) {
                            gameList.push(id);
                        }
                    });
                }
            });

            if (gameList.length > 0) {
                this.$store.dispatch('LOAD_PUBLIC_GAMES', gameList)
                    .then(() => {
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                        this.$bus.$emit('TOAST', { message: 'Error loading data', type: 'error' });
                    });
            } else {
                this.loading = false;
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    main {
        align-items: flex-start;
        background: #a5a2a2;
        box-sizing: border-box;
        display: flex;
        height: calc(100vh - #{$navHeight});
        overflow-x: auto;
        overflow-x: overlay;
        padding: 0 $gp;
        user-select: none;
    }

    section {
        flex-shrink: 0;
        cursor: default;
        position: relative;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - #{$navHeight + $gp * 2});

        header {
            align-items: center;
            background: #555555;
            color: #fff;
            display: flex;
            height: 30px;
            justify-content: space-between;
            padding: 0 $gp / 2;
            position: absolute;
            width: 100%;
        }

        .games {
            height: 100%;
            overflow-x: hidden;
            min-height: 60px;
            max-height: calc(100vh - #{$navHeight + $gp * 4});
            overflow-y: auto;
            overflow-y: overlay;
            column-gap: $gp;
            background: #e5e5e5;
            margin-top: 30px;
            padding: $gp / 2 $gp / 2 0;
            width: 100%;
        }
    }


        .game-card {
            background-color: #fff;
            margin-bottom: $gp / 2;
            position: relative;
            display: flex;
            align-items: center;

            img {
                width: 80px;
                height: auto;
                margin-right: $gp / 2;
                display: flex;
            }
        }
</style>
