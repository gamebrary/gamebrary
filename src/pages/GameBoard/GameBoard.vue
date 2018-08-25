<template lang="html">
    <div
        class="lists"
        ref="lists"
        @dragscrollstart="dragScrollActive = true"
        @dragscrollend="dragScrollActive = false"
        :class="{ nightMode, 'drag-scroll-active': dragScrollActive }"
        :style="{ background: user.settings.backgroundColor }"
        v-dragscroll:nochilddrag
    >
        <md-snackbar :md-active.sync="errorLoading">
            <span>There was an error loading your game data</span>
            <md-button class="md-primary" @click="loadGameData">Retry</md-button>
        </md-snackbar>

        <empty-board v-if="isEmpty" />

        <list
            :name="list.name"
            :games="list.games"
            :listIndex="listIndex"
            :key="list.name"
            v-if="list"
            v-for="(list, listIndex) in user.lists"
            @end="dragEnd"
            @remove="tryDelete(listIndex)"
        />

        <md-dialog-confirm
            :md-active.sync="showDeleteConfirm"
            md-title="Are you sure?"
            md-content="This lists contains games, all games will be deleted as well."
            md-confirm-text="Delete"
            @md-confirm="deleteList(activeList)"
        />

        <add-list
            @update="updateLists(true)"
            @scroll="scroll"
        />
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import AddList from '@/components/Lists/AddList';
import List from '@/components/GameBoard/List';
import EmptyBoard from '@/components/GameBoard/EmptyBoard';
import draggable from 'vuedraggable';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
    components: {
        draggable,
        List,
        EmptyBoard,
        AddList,
    },

    directives: {
        dragscroll,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            gameData: null,
            loading: false,
            activeList: null,
            showDeleteConfirm: false,
            errorLoading: false,
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
        ...mapState(['user']),

        isEmpty() {
            return !this.user.lists.filter(list => list && list.games && list.games.length).length;
        },

        nightMode() {
            return this.user && this.user.settings ? this.user.settings.nightMode : false;
        },

        isGameRoute() {
            return this.$route.params && this.$route.params.id && this.$route.name === 'game';
        },
    },

    mounted() {
        if (!this.isEmpty) {
            this.loadGameData();
        }

        if (this.isGameRoute) {
            this.openGame();
        }

        this.checkDataAge();
    },

    methods: {
        openGame() {
            const gameId = this.$route.params.id;

            if (gameId) {
                this.$nextTick(() => {
                    this.$bus.$emit('TOGGLE_DRAWER', {
                        panelName: 'game',
                        gameId,
                    });
                });

                return;
            }

            this.$router.push({ name: 'home' });
        },

        checkDataAge() {
            const lastUpdated = this.$store.state.dataUpdatedTimestamp;
            const diff = moment.duration(moment().diff(lastUpdated));

            if (diff.asMinutes() > 15) {
                this.$store.dispatch('LOAD_LISTS');
            }
        },

        scroll() {
            this.$nextTick(() => {
                const lists = this.$refs.lists;
                lists.scrollLeft = lists.scrollWidth;
            });
        },

        tryDelete(index) {
            const hasGames = this.user.lists[index].games.length > 0;

            if (hasGames) {
                this.showDeleteConfirm = true;
                this.activeList = index;
            } else {
                this.deleteList(index);
            }
        },

        deleteList(index) {
            this.$store.commit('REMOVE_LIST', index);
            this.updateLists();
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.$store.commit('UPDATE_LIST', this.user.lists);
            this.updateLists();
        },

        updateLists(forceReload) {
            this.$store.dispatch('UPDATE_LISTS')
                .then(() => {
                    if (this.user.lists.length === 1 && forceReload) {
                        location.reload();
                    }
                });
        },

        loadGameData() {
            const gameList = [];
            this.user.lists.forEach((list) => {
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
                    this.errorLoading = true;
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .lists {
        display: flex;
        align-items: flex-start;
        height: calc(100vh - 48px);
        padding: $gp;
        background: $nin-gray;
        overflow-x: auto;
        overflow-x: overlay;
        display: flex;
        @include drag-cursor;

        &.drag-scroll-active {
            @include dragging-cursor;
        }


        &.empty {
            background: $nin-white;
        }
    }

    .draggable * {
        color: $nin-white;
    }

    .nightMode {
        background: #333 !important;

        .games {
            background: $nin-dk-gray;
        }

        .list-header {
            box-shadow: 0 0 5px 5px $nin-dk-gray;
        }
    }
</style>
