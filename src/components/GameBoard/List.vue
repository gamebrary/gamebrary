<template lang="html">
    <div class="list">
        <div class="list-header">
            <list-name-edit
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists"
            />

            <div :class="['list-actions', { show: listOptionsActive }]">
                <div class="more-actions" v-show="listOptionsActive">
                    <button
                        v-if="hasGames"
                        class="small"
                        @click="sortList"
                    >
                        <i class="fas fa-sort-alpha-down" />
                    </button>

                    <button @click="addGame" class="small">
                        <i class="fas fa-plus" />
                    </button>

                    <button @click="remove" class="small">
                        <i class="far fa-trash-alt" />
                    </button>
                </div>

                <button
                    v-if="listOptionsActive"
                    class="small accent hollow"
                    @click="cancelListEdit"
                >
                    <i class="fas fa-times" />
                </button>

                <button @click="editList" class="small accent hollow" v-else>
                    <i class="fas fa-pencil-alt" />
                </button>
            </div>
        </div>

        <game-search v-if="showSearch" :list-id="listIndex" />

        <draggable
            v-else
            class="games"
            :list="games"
            :id="listIndex"
            :move="validateMove"
            :options="gameDraggableOptions"
            @end="end"
            @start="start"
        >
            <game-card
                v-for="game in games"
                :key="game"
                :id="game"
                :game-id="game"
                :list-id="listIndex"
            />

            <div class="empty-list" v-if="!games.length">
                <img src="/static/img/empty-collection.png" />
                <h3>This list is empty</h3>

                <button class="primary" @click="addGame">
                    <i class="fas fa-plus" />
                    Add game
                </button>
            </div>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import GameCard from '@/components/GameCard/GameCard';
import GameSearch from '@/components/GameSearch/GameSearch';
import { mapState } from 'vuex';
import firebase from 'firebase';
import toasts from '@/mixins/toasts';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});

export default {
    components: {
        GameCard,
        GameSearch,
        ListNameEdit,
        draggable,
    },

    mixins: [toasts],

    props: {
        name: String,
        games: [Object, Array],
        listIndex: [String, Number],
    },

    data() {
        return {
            showAddGame: false,
            listEditActive: false,
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
        ...mapState(['user', 'gameLists', 'platform', 'activeList']),

        list() {
            return this.gameLists[this.platform.code];
        },

        showSearch() {
            return this.showAddGame && this.activeList === this.listIndex && this.listOptionsActive;
        },

        listOptionsActive() {
            return this.listEditActive && this.activeList === this.listIndex;
        },

        hasGames() {
            return this.games.length > 1;
        },
    },

    methods: {
        editList() {
            this.listEditActive = true;
            this.$store.commit('SET_ACTIVE_LIST', this.listIndex);
        },

        cancelListEdit() {
            this.listEditActive = false;
            this.showAddGame = false;
            this.$store.commit('SET_ACTIVE_LIST', null);
        },

        addGame() {
            this.listEditActive = true;
            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST', this.listIndex);
            this.showAddGame = true;
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

        sortList() {
            this.$store.commit('SORT_LIST', this.listIndex);
            this.updateLists();
        },

        validateMove({ from, to }) {
            const isDifferentList = from.id !== to.id;
            const isDuplicate = this.list[to.id].games.includes(Number(this.draggingId));
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
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "~styles/game-board.scss";

    .list {
        overflow-x: hidden;
    }

    .list-actions {
        display: flex;
        flex-direction: row;
        transition: max-width 100ms ease;
        max-width: $iconSmallSize;
        overflow: hidden;

        .more-actions {
            display: flex;
            min-width: $iconSmallSize;
            max-width: $iconSmallSize * 3;
        }

        &.show {
            transition: max-width 300ms ease;
            max-width: $iconSmallSize * 4;
        }
    }
</style>
