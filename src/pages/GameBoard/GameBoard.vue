<template lang="html">
    <div
        class="lists"
        ref="lists"
        :class="{ dark: darkModeEnabled }"
    >
        <game-board-placeholder v-if="loading" />

        <template>
            <list
                :name="list.name"
                :games="list.games"
                :listIndex="listIndex"
                :key="`${list.name}-${listIndex}`"
                v-if="list && !loading"
                v-for="(list, listIndex) in gameLists[platform.code]"
                @end="dragEnd"
                @remove="tryDelete(listIndex)"
            />

            <onboard v-if="!list" />

            <add-list
                @update="updateLists()"
                @scroll="scroll"
            />
        </template>
    </div>
</template>

<script>
import AddList from '@/components/Lists/AddList';
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import Onboard from '@/components/GameBoard/Onboard';
import Panel from '@/components/Panel/Panel';
import { $success, $error, swal } from '@/shared/modals';
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
        AddList,
        GameBoardPlaceholder,
        Onboard,
        Panel,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            loading: false,
            gameData: null,
            activeList: null,
            showDeleteConfirm: false,
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
            return this.gameLists && this.gameLists[this.platform.code]
                ? this.gameLists[this.platform.code]
                : null;
        },
    },

    mounted() {
        this.loadGameData();

        document.title = `${this.platform.name} - Gamebrary`;
    },

    methods: {
        scroll() {
            this.$nextTick(() => {
                const lists = this.$refs.lists;
                lists.scrollLeft = lists.scrollWidth;
            });
        },

        tryDelete(index) {
            const hasGames = this.list[index].games.length > 0;

            if (hasGames) {
                this.showDeleteConfirm = true;
                this.activeList = index;

                swal({
                    title: 'Are you sure?',
                    text: 'This lists contains games, all games will be deleted as well.',
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonClass: 'primary small',
                    cancelButtonClass: 'small',
                    confirmButtonText: 'Delete',
                }).then(({ value }) => {
                    if (value) {
                        this.deleteList(this.activeList);
                    }
                });
            } else {
                this.deleteList(index);
            }
        },

        deleteList(index) {
            this.$store.commit('REMOVE_LIST', index);
            this.updateLists();
            $success('List deleted');
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.updateLists();
        },

        updateLists() {
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    $success('List saved');
                })
                .catch(() => {
                    $error('Authentication error');
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
                        .catch(() => {
                            swal({
                                title: 'Uh no!',
                                text: 'There was an error loading your game data',
                                type: 'error',
                                showCancelButton: true,
                                confirmButtonClass: 'primary',
                                confirmButtonText: 'Retry',
                            }).then(({ value }) => {
                                if (value) {
                                    this.loadGameData();
                                }
                            });
                        })
                        .finally(() => {
                            this.loading = false;
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
        background: $color-gray;
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
