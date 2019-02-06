<template lang="html">
    <div
        class="lists"
        ref="lists"
        v-if="user && platform"
        :class="{ dark: darkModeEnabled }"
        @click.self="loseFocus"
    >
        <game-board-placeholder v-if="loading" />

        <modal ref="game" large :show-close="false" @close="gameDetailId = null">
            <game-detail slot="content" :id="gameDetailId" v-if="gameDetailId" />
        </modal>

        <template>
            <list
                :name="list.name"
                :games="list.games"
                :listIndex="listIndex"
                :key="`${list.name}-${listIndex}`"
                v-if="list && !loading"
                v-for="(list, listIndex) in gameLists[platform.code]"
                @end="dragEnd"
            />

            <onboard v-if="!list" />

            <list-options
                @update="updateLists"
                @scroll="scroll"
            />
        </template>
    </div>
</template>

<script>
import ListOptions from '@/components/Lists/ListOptions';
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import Onboard from '@/components/GameBoard/Onboard';
import Panel from '@/components/Panel/Panel';
import GameDetail from '@/pages/GameDetail/GameDetail';
import Modal from '@/components/Modal/Modal';
import List from '@/components/GameBoard/List';
import draggable from 'vuedraggable';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        draggable,
        List,
        ListOptions,
        GameBoardPlaceholder,
        Onboard,
        Panel,
        GameDetail,
        Modal,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            loading: false,
            gameData: null,
            gameDetailId: null,
            listDraggableOptions: {
                animation: 500,
                handle: '.list-drag-handle',
                group: { name: 'lists' },
                draggable: '.list',
                ghostClass: 'list-placeholder',
            },
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        list() {
            return this.gameLists && this.platform && this.gameLists[this.platform.code]
                ? this.gameLists[this.platform.code]
                : null;
        },
    },

    mounted() {
        this.$store.commit('CLEAR_ACTIVE_LIST');

        if (this.platform) {
            this.loadGameData();

            document.title = this.platform
                ? `${this.platform.name} - Gamebrary`
                : 'Gamebrary';
        } else {
            // eslint-disable-next-line
            if (!this.user) {
                this.$router.push({ name: 'auth' });
            }
        }

        this.$bus.$on('OPEN_GAME', this.openGame);
    },

    beforeDestroy() {
        this.$bus.$off('OPEN_GAME');
    },

    methods: {
        openGame(id) {
            this.gameDetailId = id;
            this.$refs.game.open();
        },

        loseFocus() {
            this.$store.commit('CLEAR_ACTIVE_LIST');
        },

        scroll() {
            this.$nextTick(() => {
                const lists = this.$refs.lists;
                lists.scrollLeft = lists.scrollWidth;
            });
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.$bus.$emit('TOAST', { message: 'Collection updated' });
            this.updateLists();
        },

        updateLists(force) {
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: !force })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        loadGameData() {
            if (this.list) {
                const gameList = [];

                this.list.forEach((list) => {
                    if (list && list.games.length) {
                        list.games.forEach((id) => {
                            if (!gameList.includes(id)) {
                                gameList.push(id);
                            }
                        });
                    }
                });

                if (gameList.length > 0) {
                    this.loading = true;

                    this.$store.dispatch('LOAD_GAMES', gameList)
                        .then(() => {
                            this.loading = false;
                        })
                        .catch(() => {
                            this.$bus.$emit('TOAST', { message: 'Error loading game', type: 'error' });
                        });
                }
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .draggable * {
        color: $color-white;
    }

    .panel {
        margin-right: $gp;
        width: $list-width;
    }

    .lists {
        user-select: none;
        display: flex;
        align-items: flex-start;
        height: calc(100vh - 48px);
        padding: $gp;
        box-sizing: border-box;
        background-color: $color-gray;
        overflow-x: auto;
        overflow-x: overlay;
        display: flex;

        &.dark {
            background: #222 !important;
        }

        &.empty {
            background: $color-white;
        }
    }

    .list-placeholder {
        opacity: 0.25;
    }
</style>
