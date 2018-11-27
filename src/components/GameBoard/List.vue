<template lang="html">
    <div :class="['list', { dark: settings && settings.nightMode }]">
        <div class="list-header">
            <list-name-edit
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists"
            />
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

            <div class="empty" v-if="games.length === 0">
                [ Empty ]
            </div>

        </draggable>

        <footer v-if="!showSearch" :class="{ dark: settings && settings.nightMode }">
            <button
                class="small accent"
                :class="{ hollow: settings && settings.nightMode }"
                title="Move list left"
                :disabled="listIndex === 0"
                @click="moveList(listIndex, listIndex - 1)"
            >
                <i class="fas fa-caret-left" />
            </button>

            <button
                @click="addGame"
                class="small accent"
                :class="{ hollow: settings && settings.nightMode }"
                title="Add game"
            >
                <i class="fas fa-plus" />
            </button>

            <button
                v-if="hasGames"
                class="small accent"
                :class="{ hollow: settings && settings.nightMode }"
                title="Sort List"
                @click="sortList"
            >
                <i class="fas fa-sort-alpha-down" />
            </button>

            <button
                class="small accent"
                :class="{ hollow: settings && settings.nightMode }"
                title="Delete List"
                @click="remove"
            >
                <i class="far fa-trash-alt" />
            </button>

            <button
                class="small accent"
                :class="{ hollow: settings && settings.nightMode }"
                title="Move list right"
                :disabled="listIndex === (Object.keys(list).length - 1)"
                @click="moveList(listIndex, listIndex + 1)"
            >
                <i class="fas fa-caret-right" />
            </button>
        </footer>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import GameCard from '@/components/GameCard/GameCard';
import GameSearch from '@/components/GameSearch/GameSearch';
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { $success, $error } from '@/shared/modals';

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
        ...mapState(['user', 'gameLists', 'platform', 'activeList', 'settings']),

        list() {
            return this.gameLists[this.platform.code];
        },

        showSearch() {
            return this.activeList === this.listIndex;
        },

        hasGames() {
            return this.games.length > 1;
        },
    },

    methods: {
        moveList(from, to) {
            this.$store.commit('MOVE_LIST', { from, to });
            this.updateLists();
        },

        addGame() {
            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST', this.listIndex);
        },

        updateLists() {
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    $success('List saved');
                })
                .catch(() => {
                    $error('Authentication error');
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

    .list {
        flex-shrink: 0;
        cursor: default;
        position: relative;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 81px);

        .list-header {
            align-items: center;
            background: $color-dark-gray;
            color: $color-white;
            display: flex;
            height: $list-header-height;
            justify-content: space-between;
            padding: 0 $gp / 2;
            position: absolute;
            width: 100%;
        }

        .games {
            height: 100%;
            overflow: hidden;
            min-height: 60px;
            max-height: calc(100vh - 154px);
            overflow-y: auto;
            overflow-y: overlay;
            column-gap: $gp;
            background: $color-light-gray;
            margin-top: $list-header-height;
            padding: 0 $gp / 2;
            width: 100%;
        }

        &.dark {
            .games {
                background: #444 !important;
            }
        }
    }

    .empty {
        position: absolute;
        width: 100%;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
    }

    footer {
        background-color: $color-light-gray;
        height: 42px;
        padding: 0 $gp / 2;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.dark {
            background: #444;
        }
    }
</style>
