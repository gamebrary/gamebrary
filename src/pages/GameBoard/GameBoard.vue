<template lang="html">
    <draggable
        v-dragscroll:nochilddrag
        class="lists"
        ref="lists"
        :list="lists"
        :class="{ nightMode, 'drag-scroll-active': dragScrollActive }"
        :style="{ background: settings.backgroundColor }"
        :options="listDraggableOptions"
        @dragscrollstart="dragScrollActive = true"
        @dragscrollend="dragScrollActive = false"
        @end="dragEnd"
    >
        <md-snackbar :md-active.sync="errorLoading">
            <span>There was an error loading your game data</span>
            <md-button class="md-primary" @click="loadGameData">Retry</md-button>
        </md-snackbar>

        <empty-board v-if="isEmpty" />

        <list
            :name="name"
            :games="games"
            :listIndex="listIndex"
            :key="name"
            v-if="lists"
            v-for="({name, games}, listIndex) in lists"
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
            @update="updateLists"
            @scroll="scroll"
        />
    </draggable>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import AddList from '@/components/Lists/AddList';
import List from '@/components/GameBoard/List';
import EmptyBoard from '@/components/GameBoard/EmptyBoard';
import draggable from 'vuedraggable';
import moment from 'moment';

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
        lists() {
            return this.$store.state.user.lists;
        },

        user() {
            return this.$store.state.user;
        },

        settings() {
            return this.$store.state.user.settings;
        },

        isEmpty() {
            return !this.lists.filter(list => list.games.length).length;
        },

        nightMode() {
            return this.$store.state.user.settings.nightMode;
        },
    },

    mounted() {
        if (!this.isEmpty) {
            this.loadGameData();
        }

        if (this.$route.params) {
            this.openGame(this.$route.params);
        }

        this.checkDataAge();
    },

    methods: {
        openGame({ id }) {
            if (id) {
                this.$nextTick(() => {
                    this.$bus.$emit('OPEN_GAME_MODAL', id);
                });
            } else {
                this.$router.push({ name: 'home' });
            }
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
            const hasGames = this.lists[index].games.length > 0;

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
            this.$store.commit('UPDATE_LIST', this.lists);
            this.updateLists();
        },

        updateLists() {
            this.$store.dispatch('UPDATE_LISTS')
                .then(() => {
                    if (this.lists.length === 1) {
                        location.reload();
                    }
                });
        },

        loadGameData() {
            const gameList = [];
            this.user.lists.forEach(({ games }) => {
                if (games.length) {
                    games.forEach((id) => {
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
