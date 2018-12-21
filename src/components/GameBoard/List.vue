<template lang="html">
    <div :class="['list', { dark: darkModeEnabled }]">
        <div class="list-header">
            <div v-if="showSearch">
                {{ $t('game.addPlural') }}
            </div>

            <list-name-edit
                v-else
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists"
            />
        </div>

        <game-search
            v-if="showSearch"
            :list-id="listIndex"
        />

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
                [ {{ $t('empty') }} ]
            </div>

        </draggable>

        <footer v-if="!showSearch" :class="{ dark: darkModeEnabled }">
            <button
                class="small accent"
                :class="{ hollow: darkModeEnabled }"
                :title="$t('list.moveLeft')"
                :disabled="listIndex === 0"
                @click="moveList(listIndex, listIndex - 1)"
            >
                <i class="fas fa-caret-left" />
            </button>

            <button
                @click="addGame"
                class="small accent"
                :class="{ hollow: darkModeEnabled }"
                :title="$t('game.add')"
            >
                <i class="fas fa-plus" />
            </button>

            <button
                v-if="hasGames"
                :class="['small accent', { hollow: darkModeEnabled }]"
                :title="$t('list.sortByName')"
                @click="sortListAlphabetically"
            >
                <i class="fas fa-sort-alpha-down" />
            </button>

            <button
                v-if="hasGames"
                :class="['small accent', { hollow: darkModeEnabled }]"
                :title="$t('list.sortByRating')"
                @click="sortListByRating"
            >
                <i class="fas fa-sort-numeric-up" />
            </button>

            <button
                :class="['small accent', { hollow: darkModeEnabled }]"
                :title="$t('list.delete')"
                @click="remove"
            >
                <i class="far fa-trash-alt" />
            </button>

            <button
                :class="['small accent', { hollow: darkModeEnabled }]"
                :title="$t('list.moveRight')"
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
import { mapState, mapGetters } from 'vuex';
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

        ...mapGetters(['darkModeEnabled']),

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

        sortListAlphabetically() {
            this.$store.commit('SORT_LIST_ALPHABETICALLY', this.listIndex);
            this.updateLists();
        },

        sortListByRating() {
            this.$store.commit('SORT_LIST_BY_RATING', this.listIndex);
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
