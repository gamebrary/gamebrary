<!-- eslint-disable max-len -->
<template lang="html">
    <div :class="['list', { dark: darkModeEnabled }]">
        <div class="list-header" :class="{ searching: showSearch }">
            <div v-if="showSearch">
                {{ $t('game.addPlural') }}
                <strong>{{ list[listIndex].name }}</strong>
            </div>

            <list-name-edit
                v-else
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists('List name saved')"
            />
        </div>

        <game-search
            v-if="showSearch"
            :list-id="listIndex"
        />

        <draggable
            v-else
            :class="['games', { 'empty': isEmpty }]"
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
        </draggable>

        <footer v-if="!showSearch">
            <button
                :class="listButtonClass"
                :title="$t('list.moveLeft')"
                :disabled="listIndex === 0"
                @click="moveList(listIndex, listIndex - 1)"
            >
                <i class="fas fa-caret-left" />

                <template v-if="isEmpty">
                    <br>
                    <small>{{ $t('list.moveLeft') }}</small>
                </template>
            </button>

            <button
                @click="addGame"
                :class="listButtonClass"
                :title="$t('game.add')"
            >
                <i class="fas fa-plus" />

                <template v-if="isEmpty">
                    <br>
                    <small>{{ $t('game.add') }}</small>
                </template>
            </button>

            <button
                v-if="hasMultipleGames"
                :class="listButtonClass"
                :title="$t('list.sortByName')"
                @click="sortListAlphabetically"
            >
                <i class="fas fa-sort-alpha-down" />
            </button>

            <button
                v-if="hasMultipleGames"
                :class="listButtonClass"
                :title="$t('list.sortByRating')"
                @click="sortListByRating"
            >
                <i class="fas fa-sort-numeric-up" />
            </button>

            <modal
                v-if="games && games.length"
                ref="addList"
                :message="`This list contains ${games.length} games, all games will be deleted as well.`"
                title="Are you sure?"
                :action-text="$t('list.delete')"
                @action="deleteList"
            >
                <button
                    :class="listButtonClass"
                    :title="$t('list.delete')"
                >
                    <i class="far fa-trash-alt" />
                </button>
            </modal>

            <button
                v-else
                :class="listButtonClass"
                :title="$t('list.delete')"
                @click="deleteList"
            >
                <i class="far fa-trash-alt" />

                <template v-if="isEmpty">
                    <br>
                    <small>{{ $t('list.delete') }}</small>
                </template>
            </button>

            <button
                :class="listButtonClass"
                :title="$t('list.moveRight')"
                :disabled="listIndex === (Object.keys(list).length - 1)"
                @click="moveList(listIndex, listIndex + 1)"
            >
                <i class="fas fa-caret-right" />

                <template v-if="isEmpty">
                    <br>
                    <small>{{ $t('list.moveRight') }}</small>
                </template>
            </button>
        </footer>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import Modal from '@/components/Modal/Modal';
import GameCard from '@/components/GameCard/GameCard';
import GameSearch from '@/components/GameSearch/GameSearch';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        Modal,
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

        listButtonClass() {
            const empty = this.isEmpty
                ? 'tiny'
                : '';

            const defaultClass = `small filled ${empty}`;

            return this.darkModeEnabled
                ? `${defaultClass} accent`
                : `${defaultClass} info'`;
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        showSearch() {
            return this.activeList === this.listIndex;
        },

        hasMultipleGames() {
            return this.games.length > 1;
        },

        isEmpty() {
            return this.games.length === 0;
        },
    },

    methods: {
        deleteList() {
            this.$store.commit('REMOVE_LIST', this.listIndex);

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'List deleted' });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        moveList(from, to) {
            this.$store.commit('MOVE_LIST', { from, to });
            this.updateLists('List moved');
        },

        addGame() {
            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST', this.listIndex);
        },

        updateLists(toastMessage) {
            const message = toastMessage || 'List saved';

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        sortListAlphabetically() {
            this.$store.commit('SORT_LIST_ALPHABETICALLY', this.listIndex);
            this.updateLists('List sorted alphabetically');
        },

        sortListByRating() {
            this.$store.commit('SORT_LIST_BY_RATING', this.listIndex);
            this.updateLists('List sorted by game rating');
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
        background: $color-light-gray;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 81px);

        &.dark {
            background: $color-dark-gray;
        }

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

            &.searching {
                background: $color-green;
            }
        }

        .games {
            height: 100%;
            overflow: hidden;
            max-height: calc(100vh - 154px);
            min-height: 80px;
            overflow-y: auto;
            overflow-y: overlay;
            margin-top: $list-header-height;
            padding: 0 $gp / 2;
            width: 100%;

            &.empty {
                margin: ($list-header-height + $gp / 2) $gp / 2 $gp / 2;
                padding: $gp;
                width: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed $color-gray;
            }
        }
    }

    footer {
        height: 42px;
        padding: 0 $gp / 2;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .empty {
            font-size: 12px;
            border: 0 !important;
        }
    }
</style>
