<template lang="html">
    <div>
        <md-empty-state
            v-if="isEmpty"
            md-icon="library_add"
            md-label="Welcome"
            md-description="Click the button below to add your first game!"
        >
            <md-button
                class="md-dense md-raised md-accent"
                @click="addGame(0)"
            >
                Add Game
            </md-button>
        </md-empty-state>

        <draggable
            v-else
            :list="lists"
            class="lists"
            ref="lists"
            :class="{ empty: isEmpty, nightMode, 'drag-scroll-active': dragScrollActive }"
            :style="{ background: settings.backgroundColor }"
            v-dragscroll:nochilddrag
            @dragscrollstart="dragScrollActive = true"
            @dragscrollend="dragScrollActive = false"
            :options="{
                handle: '.drag-handle',
                group: { name: 'lists' },
                draggable: '.list',
                dragClass: 'dragging',
            }"
            @end="end"
        >
            <div
                v-if="lists"
                v-for="({name, games}, index) in lists"
                :key="name"
                class="list"
            >
                <div class="list-header">
                    <strong
                        v-if="!editing || editingIndex !== index"
                        @click="startTitleEdit(index, name)"
                    >
                        {{name}}
                    </strong>

                    <input
                        v-else
                        v-model="editingListName"
                        @blur="endTitleEdit(index)"
                        @keyup.enter="endTitleEdit(index)"
                    >

                    <div class="list-actions">
                        <md-button
                            :md-ripple="false"
                            class="md-dense md-icon-button drag-handle"
                        >
                            <md-icon>drag_handle</md-icon>
                        </md-button>
                    </div>
                </div>

                <draggable
                    :list="games"
                    class="games"
                    :id="index"
                    @end="end"
                    @start="start"
                    :move="validateMove"
                    :options="{
                        handle: '.game-drag-handle',
                        group: {
                            name:'games',
                        }
                    }"
                >
                    <game-card
                        v-for="game in games"
                        :key="game"
                        :id="game"
                        :game-id="game"
                        :listId="index"
                    />

                    <md-empty-state
                        v-if="!games.length"
                        md-icon="face"
                        md-label="List empty"
                        md-description="Click the button below to add a game to this list"
                    >
                        <md-button class="md-raised" @click="addGame(index)">Add game</md-button>
                    </md-empty-state>
                </draggable>

                <md-bottom-bar>
                    <md-bottom-bar-item
                        md-label="Add Game"
                        md-icon="playlist_add"
                        @click="addGame(index)"
                    />

                    <md-bottom-bar-item
                        md-label="Delete list"
                        md-icon="delete_sweep"
                        @click="tryDelete(index)"
                    />
                </md-bottom-bar>
            </div>

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

    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import GameCard from '@/components/GameCard/GameCard';
import AddList from '@/components/Lists/AddList';
import draggable from 'vuedraggable';
import moment from 'moment';

export default {
    components: {
        draggable,
        AddList,
        GameCard,
    },

    directives: {
        dragscroll,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            editing: false,
            editingIndex: null,
            editingListName: '',
            gameData: null,
            loading: false,
            activeList: null,
            showDeleteConfirm: false,
            dragScrollActive: false,
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

        cacheData() {
            return this.$store.state.games;
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

        this.checkDataAge();
    },

    methods: {
        validateMove({ from, to }) {
            const isDifferentList = from.id !== to.id;
            const isDuplicate = this.lists[to.id].games.includes(Number(this.draggingId));
            const validMove = isDifferentList && isDuplicate;
            return !validMove;
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

        addGame(list) {
            this.$bus.$emit('OPEN_SEARCH_MODAL', list);
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

        start({ item }) {
            this.dragging = true;
            this.draggingId = item.id;
        },

        end() {
            this.dragging = false;
            this.draggingId = null;
            this.$store.commit('UPDATE_LIST', this.lists);
            this.updateLists();
        },

        updateLists() {
            this.$store.dispatch('UPDATE_LISTS');
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

            this.$store.dispatch('LOAD_GAMES', gameList);
        },

        startTitleEdit(index, listName) {
            this.editing = true;
            this.editingIndex = index;
            this.editingListName = listName;
        },

        endTitleEdit(listId) {
            if (this.editing) {
                const newName = this.editingListName;
                this.editing = false;
                this.editingIndex = null;
                this.editingListName = '';
                this.$store.commit('UPDATE_LIST_NAME', { listId, newName });
                this.updateLists();
            }
        },

    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .md-bottom-bar {
        --md-theme-default-background: #{$nin-lt-gray};
    }

    .md-button {
        margin: 0;
    }

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

    .list {
        flex-shrink: 0;
        cursor: default;
        background: $nin-white;
        position: relative;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 81px);
    }

    .list-header {
        align-items: center;
        background: $nin-dk-gray;
        box-shadow: 0 0 5px 5px $nin-lt-gray;
        color: $nin-white;
        display: flex;
        height: 30px;
        justify-content: space-between;
        padding: 0 $gp / 2;
        position: absolute;
        width: 100%;

        .md-button .md-icon {
            @include drag-cursor;
            color: $nin-white;
        }
    }

    .games {
        height: 100%;
        overflow: hidden;
        min-height: 100px;
        max-height: calc(100vh - 182px);
        overflow-y: auto;
        overflow-y: overlay;
        column-gap: $gp;
        background: $nin-lt-gray;
        margin-top: 30px;
        padding: $gp / 2 $gp / 2 $gp / 3;
        width: 100%;

        .game:not(:last-child) {
            margin-bottom: $gp / 2;
        }
    }

    .draggable * {
        color: $nin-white;
    }

    .md-card {
        margin-bottom: $gp / 2;

        &:last-child {
            margin-bottom: 0;
        }
    }

    input {
        color: $nin-black;
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
