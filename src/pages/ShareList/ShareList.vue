<template lang="html">
    <main v-dragscroll:nochilddrag>
        <span v-if="loading">Loading...</span>

        <section
            v-if="!loading && listData && publicGameData"
            v-for="list in listData"
            :key="list.name"
        >
            <header>{{ list.name }} ({{ list.games.length }})</header>

            <div class="empty-list" v-if="!list.games.length">
                <h3>This collection is empty</h3>
            </div>

            <div class="games" v-else>
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
import { swal } from '@/shared/modals';
import { dragscroll } from 'vue-dragscroll';
import { mapState } from 'vuex';

import 'firebase/firestore';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    directives: {
        dragscroll,
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
            const { userId, listName } = this.$route.params;

            db.collection('lists').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.listData = data[listName];
                        this.loadGameData();
                    }
                })
                .catch(() => {
                    this.loading = false;
                    this.handleError();
                });
        },

        loadGameData() {
            const gameList = this.listData.map(({ games }) => games).filter(Boolean).join().replace(/(^,)|(,$)/g, '');

            if (gameList.length > 0) {
                this.$store.dispatch('LOAD_PUBLIC_GAMES', gameList)
                    .catch(() => {
                        this.handleError();
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                this.loading = false;
            }
        },

        handleError() {
            swal({
                title: 'Uh no!',
                text: 'There was an error loading game data',
                type: 'error',
                showCancelButton: true,
                confirmButtonClass: 'primary',
                confirmButtonText: 'Retry',
            }).then(({ value }) => {
                if (value) {
                    this.load();
                } else {
                    this.$router.push({ name: 'home' });
                }
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    main {
        align-items: flex-start;
        background: $color-gray;
        box-sizing: border-box;
        display: flex;
        height: 100vh;
        overflow-x: auto;
        overflow-x: overlay;
        padding: $gp;
        user-select: none;
        @include drag-cursor;

        &.drag-scroll-active {
            @include dragging-cursor;
        }
    }

    section {
        flex-shrink: 0;
        cursor: default;
        position: relative;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 48px);

        header {
            align-items: center;
            background: $color-dark-gray;
            color: $color-white;
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
            max-height: calc(100vh - 78px);
            overflow-y: auto;
            overflow-y: overlay;
            column-gap: $gp;
            background: $color-light-gray;
            margin-top: 30px;
            padding: $gp / 2 $gp / 2 0;
            width: 100%;
        }
    }


        .game-card {
            background-color: $color-white;
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
