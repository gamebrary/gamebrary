<template lang="html">
    <div class="list">
        <div class="list-header">
            <list-name-edit
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists"
            />

            <div class="list-actions">
                <md-menu md-direction="bottom-start">
                    <md-button class="md-icon-button" md-menu-trigger>
                        <i class="fas fa-caret-down"></i>
                    </md-button>

                    <md-menu-content>
                        <md-button
                            class="md-dense md-default"
                            @click="sortList(listIndex)"
                        >
                            <i class="fas fa-sort-alpha-down" />
                            Sort games
                        </md-button>

                        <md-button @click="remove">
                            <i class="far fa-trash-alt" />
                            Delete list
                        </md-button>
                    </md-menu-content>
                </md-menu>
            </div>
        </div>

        <draggable
            :list="games"
            class="games"
            :id="listIndex"
            @end="end"
            @start="start"
            :move="validateMove"
            :options="gameDraggableOptions"
        >
            <game-card
                v-for="game in games"
                :key="game"
                :id="game"
                :game-id="game"
                :listId="listIndex"
            />

            <md-empty-state
                v-if="!games.length"
                md-icon="face"
                md-label="List empty"
                md-description="Click the button below to add a game to this list"
            >
                <md-button
                    class="md-raised"
                    @click="addGame"
                >
                    Add game
                </md-button>
            </md-empty-state>
        </draggable>

        <md-bottom-bar v-if="games.length">
            <md-button @click="addGame">
                <i class="fas fa-plus" />
                Add game
            </md-button>
        </md-bottom-bar>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import ListFooter from '@/components/GameBoard/ListFooter';
import GameCard from '@/components/GameCard/GameCard';
import { mapState } from 'vuex';

export default {
    components: {
        ListFooter,
        GameCard,
        ListNameEdit,
        draggable,
    },

    props: {
        name: String,
        games: [Object, Array],
        listIndex: [String, Number],
    },

    data() {
        return {
            gameDraggableOptions: {
                handle: '.game-drag-handle',
                ghostClass: 'card-placeholder',
                animation: 500,
                group: {
                    name: 'games',
                },
            },
        };
    },

    computed: {
        ...mapState(['user']),
    },

    methods: {
        updateLists() {
            this.$store.dispatch('UPDATE_LISTS');
        },

        sortList(listIndex) {
            this.$store.commit('SORT_LIST', listIndex);
            this.updateLists();
        },

        validateMove({ from, to }) {
            const isDifferentList = from.id !== to.id;
            const isDuplicate = this.user.lists[to.id].games.includes(Number(this.draggingId));
            const validMove = isDifferentList && isDuplicate;
            return !validMove;
        },

        start({ item }) {
            this.dragging = true;
            this.draggingId = item.id;
        },

        end() {
            this.$emit('end');
        },

        remove() {
            this.$emit('remove');
        },

        addGame() {
            this.$bus.$emit('TOGGLE_DRAWER', {
                panelName: 'search',
                listIndex: this.listIndex,
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";
    @import "~styles/game-board.scss";
</style>
