<template lang="html">
    <div class="list">
        <div class="list-header">
            <list-name-edit
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists"
            />

            <span class="list-drag-handle">
                <md-icon>drag_handle</md-icon>
            </span>
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

        <list-footer
            @add="addGame"
            @remove="remove"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import ListFooter from '@/components/GameBoard/ListFooter';
import GameCard from '@/components/GameCard/GameCard';

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
        lists() {
            return this.$store.state.user.lists;
        },
    },

    methods: {
        updateLists() {
            this.$store.dispatch('UPDATE_LISTS');
        },

        validateMove({ from, to }) {
            const isDifferentList = from.id !== to.id;
            const isDuplicate = this.lists[to.id].games.includes(Number(this.draggingId));
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
            this.$bus.$emit('OPEN_SEARCH_MODAL', this.listIndex);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

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

        .list-drag-handle {
            .md-icon {
                @include drag-cursor;
                color: $nin-white;
            }
        }
    }

    .list-placeholder {
        opacity: 0.25;
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

    .md-bottom-bar {
        --md-theme-default-background: #{$nin-lt-gray};
    }
</style>
