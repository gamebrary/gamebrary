<template lang="html">
    <div class="lists" :class="{ empty: isEmpty }" ref="lists">
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
            class="columns"
            :options="{ group:{ name:'lists'} }"
            @end="end"
        >
            <div v-for="({name, games}, index) in lists" :key="name" class="list">
                <div class="list-header">
                    <strong
                        v-if="!editing || editingIndex !== index"
                        @click="startTitleEdit(index, name)"
                    >
                        {{name}}
                    </strong>
                    <input
                        v-else
                        @blur="endTitleEdit(index)"
                        @keyup.enter="endTitleEdit(index)"
                        v-model="editingListName"
                    >

                    <md-menu>
                        <md-button class="md-dense md-icon-button" md-menu-trigger>
                            <md-icon>more_vert</md-icon>
                        </md-button>

                        <md-menu-content>
                            <md-menu-item>
                                <md-button class="md-dense md-primary" @click="addGame(index)">
                                    Add game
                                </md-button>
                            </md-menu-item>

                            <md-divider></md-divider>

                            <md-menu-item>
                                <md-button class="md-dense md-primary" @click="tryDelete(index)">
                                    Delete List
                                </md-button>
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>

                    <md-dialog-confirm
                        :md-active.sync="showDeleteConfirm"
                        md-title="Are you sure?"
                        md-content="This lists contains games, all games will be deleted as well."
                        md-confirm-text="Delete"
                        @md-confirm="deleteList(activeList)"
                    />
                </div>

                <draggable
                    :list="games"
                    class="games"
                    @end="end"
                    @start="start"
                    :options="{ group: { name:'games', put: !games.includes(Number(draggingId))}}"
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
            </div>

            <add-list @update="updateLists" @scroll="scroll" />
        </draggable>
    </div>
</template>

<script>
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
        };
    },

    computed: {
        lists() {
            return this.$store.state.user.lists;
        },

        user() {
            return this.$store.state.user;
        },

        cacheData() {
            return this.$store.state.games;
        },

        isEmpty() {
            return !this.lists.filter(list => list.games.length).length;
        },
    },

    mounted() {
        if (!this.isEmpty) {
            this.loadGameData();
        }

        this.checkDataAge();
    },

    methods: {
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

    .lists {
        height: calc(100vh - 60px);
        padding: $gp;
        background: $nin-gray;
        overflow-x: auto;

        &.empty {
            background: $nin-white;
        }
    }

    .md-button {
        margin: 0;
    }

    .columns {
        display: flex;
        align-items: flex-start;
    }

    .list {
        flex-shrink: 0;
        background: $nin-white;
        position: relative;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 92px);
    }

    .list-header {
        background: $nin-dk-gray;
        padding: $gp / 4 $gp / 4 $gp / 4 $gp;
        display: flex;
        align-items: center;
        position: absolute;
        width: 100%;
        justify-content: space-between;
        box-shadow: 0 0 5px 5px $nin-lt-gray;
        color: $nin-white;

        .md-button .md-icon {
            color: $nin-white;
        }
    }

    .games {
        height: 100%;
        overflow: hidden;
        min-height: 100px;
        max-height: calc(100vh - 132px);
        overflow-y: auto;
        overflow-y: overlay;
        column-gap: $gp;
        background: $nin-lt-gray;
        margin-top: 40px;
        padding: $gp / 2;
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
</style>
