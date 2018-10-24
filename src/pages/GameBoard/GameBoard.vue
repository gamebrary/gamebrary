<template lang="html">
    <div
        class="lists"
        ref="lists"
        @dragscrollstart="dragScrollActive = true"
        @dragscrollend="dragScrollActive = false"
        :class="{ nightMode, 'drag-scroll-active': dragScrollActive }"
        v-dragscroll:nochilddrag
    >
        <!-- TODO: add empty state -->
        <list
            :name="list.name"
            :games="list.games"
            :listIndex="listIndex"
            :key="list.name"
            v-if="list"
            v-for="(list, listIndex) in gameLists[platform.code]"
            @end="dragEnd"
            @remove="tryDelete(listIndex)"
        />

        <add-list
            @update="updateLists()"
            @scroll="scroll"
        />
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import AddList from '@/components/Lists/AddList';
import toasts from '@/mixins/toasts';
import List from '@/components/GameBoard/List';
import draggable from 'vuedraggable';
import firebase from 'firebase';
import { mapState } from 'vuex';

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
            gameData: null,
            loading: false,
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
        ...mapState(['user', 'gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },

        nightMode() {
            return this.user && this.user.settings ? this.user.settings.nightMode : false;
        },
    },

    mounted() {
        if (!this.list) {
            this.loadGameData();
        }
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

            if (this.activePlatform) {
                this.activePlatform.forEach((list) => {
                    if (list && list.games.length) {
                        list.games.forEach((id) => {
                            if (!gameList.includes(id)) {
                                gameList.push(id);
                            }
                        });
                    }
                });

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
                    });
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "~styles/game-board.scss";

    .draggable * {
        color: $color-white;
    }

    .nightMode {
        background: #333 !important;

        .games {
            background: $color-dark-gray;
        }

        .list-header {
            box-shadow: 0 0 5px 5px $color-dark-gray;
        }
    }
</style>
