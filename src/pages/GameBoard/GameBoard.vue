<template lang="html">
    <div
        class="lists"
        ref="lists"
        @dragscrollstart="dragScrollActive = true"
        @dragscrollend="dragScrollActive = false"
        :class="{ dark: settings.nightMode, 'drag-scroll-active': dragScrollActive }"
        v-dragscroll:nochilddrag
    >
        <template v-if="loading">
            Loading...
        </template>

        <template v-else>
            <list
                :name="list.name"
                :games="list.games"
                :listIndex="listIndex"
                :key="`${list.name}-${listIndex}`"
                v-if="list"
                v-for="(list, listIndex) in gameLists[platform.code]"
                @end="dragEnd"
                @remove="tryDelete(listIndex)"
            />

            <add-list
                @update="updateLists()"
                @scroll="scroll"
            />
        </template>
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import AddList from '@/components/Lists/AddList';
import toasts from '@/mixins/toasts';
import List from '@/components/GameBoard/List';
import draggable from 'vuedraggable';
import { mapState } from 'vuex';
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
    },

    directives: {
        dragscroll,
    },

    mixins: [toasts],

    data() {
        return {
            dragging: false,
            draggingId: null,
            loading: false,
            gameData: null,
            activeList: null,
            showDeleteConfirm: false,
            dragScrollActive: false,
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
        ...mapState(['user', 'gameLists', 'platform', 'settings']),

        list() {
            return this.gameLists[this.platform.code];
        },

        nightMode() {
            return this.user && this.user.settings ? this.user.settings.nightMode : false;
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

                this.$swal({
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
            this.$success('List deleted');
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.updateLists();
        },

        updateLists() {
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$success('List saved');
                })
                .catch(() => {
                    this.$error('Authentication error');
                });
        },

        loadGameData() {
            const gameList = [];

            if (this.list) {
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
                            this.$swal({
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
        @include drag-cursor;

        &.dark {
            background: #222 !important;
        }

        &.drag-scroll-active {
            @include dragging-cursor;
        }

        &.empty {
            background: $color-white;
        }
    }

    .list-placeholder {
        opacity: 0.25;
    }

    .card-placeholder {
        opacity: 0.25;
    }
</style>
