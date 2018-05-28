<!-- TODO: handle duplicates -->
<!-- TODO: edit list name -->

<template lang="html">
    <div class="lists" :class="{ empty: isEmpty }">
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
            :options="{group:{ name:'lists'}}"
            @end="end"
        >
            <div v-for="({name, games}, index) in lists" :key="name" class="list" >
                <div class="list-header">
                    <strong>{{name}}</strong>
                    <!-- {{draggingId}} -->

                    <md-button @click="addGame(index)" class="md-dense md-icon-button">
                        <md-icon>add</md-icon>
                    </md-button>

                    <at-button
                        @click="deleteList(index)"
                        size="small"
                    >
                        <i class="fas fa-minus" />
                        Delete List
                    </at-button>
                </div>

                <draggable
                    :list="games"
                    class="games"
                    @end="end"
                    @start="start"
                    :options="{ group: { name:'games' }}"
                >
                    <game-card
                        v-for="game in games"
                        :key="game"
                        :id="game"
                        :game-id="game"
                        :listId="index"
                    />
                </draggable>
            </div>

            <div class="add-list">
                <form @submit.prevent="addList">
                    <at-input v-model="listName" placeholder="Please input"></at-input>
                    <at-button
                        type="primary"
                        size="small"
                        native-type="submit"
                        :disabled="!listName"
                    >
                        Add list
                    </at-button>
                </form>
            </div>
        </draggable>

    </div>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';
import GameCollection from '@/components/Lists/GameCollection';
import draggable from 'vuedraggable';

export default {
    components: {
        draggable,
        GameCollection,
        GameCard,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            gameData: null,
            loading: false,
            listName: '',
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
    },

    methods: {
        addGame(list) {
            this.$bus.$emit('OPEN_SEARCH_MODAL', list);
        },

        deleteList(index) {
            if (this.lists.length === 1) {
                // TODO: Handle deletion of last list
                return;
            }

            this.$store.commit('REMOVE_LIST', index);
            this.updateLists();
        },

        addList() {
            this.$store.commit('ADD_LIST', this.listName);
            this.updateLists();
            this.listName = '';
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

        &:last-of-type {
            // margin-left: $gp / 3;
            margin-right: $gp * 2;
        }
    }

    .list-header {
        background: $nin-dk-gray;
        padding: $gp / 2;
        display: flex;
        align-items: center;
        position: absolute;
        width: 100%;
        justify-content: space-between;
        box-shadow: 0 0 5px 5px $nin-lt-gray;
        color: $nin-white;

        .at-btn {
            color: $nin-white;
            border-color: $nin-white;
            background: transparent;
        }
    }

    .games {
        height: 100%;
        overflow: hidden;
        min-height: 100px;
        max-height: calc(100vh - 136px);
        overflow-y: auto;
        overflow-y: overlay;
        column-gap: $gp;
        background: $nin-lt-gray;
        margin-top: 44px;
        padding: $gp / 2;
        width: 100%;

        .game:not(:last-child) {
            margin-bottom: $gp / 2;
        }
    }

    .draggable * {
        color: $nin-white;
    }

    .add-list {
        flex-shrink: 0;
        width: 300px;
        overflow: hidden;
        margin-right: $gp;
        padding-right: $gp;
        max-height: calc(100vh - 92px);

        form {
            background: $nin-dk-gray;
            padding: $gp;
            border-radius: $border-radius;
        }
    }
</style>
