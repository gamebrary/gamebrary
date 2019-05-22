<!-- eslint-disable max-len -->
<template lang="html">
    <div :class="['list', viewClass, coversSizeClass, { dark: darkModeEnabled }, transparent]">
        <div class="list-header" :class="{ searching, editing }">
            <div v-if="searching">
                {{ $t('gameSearch.title') }}
                <strong>{{ list[listIndex].name }}</strong>
            </div>

            <div v-else-if="editing">
                <strong>{{ list[listIndex].name }}</strong> settings
            </div>

            <list-name-edit
                v-else
                :list-name="name"
                :list-index="listIndex"
                :game-count="games.length"
                @update="updateLists('List name saved')"
            />

            <button class="small" @click="editList" v-if="!editing && !searching">
                <i class="fas fa-cog" />
            </button>
        </div>

        <game-search
            v-if="searching"
            :list-id="listIndex"
        />

        <list-settings
            v-else-if="editing"
            @update="updateLists"
        />

        <draggable
            v-else
            :class="['games', { 'empty': isEmpty }]"
            :list="games"
            :id="listIndex"
            :move="validateMove"
            v-bind="gameDraggableOptions"
            @end="end"
            @start="start"
        >
            <component
                v-for="game in games"
                :is="gameCardComponent"
                :key="`covers-${game}`"
                :id="game"
                :game-id="game"
                :list-id="listIndex"
            />
        </draggable>

        <button
            v-if="!searching && !editing"
            @click="addGame"
            class="add-game-button small"
            :title="$t('list.add')"
        >
            <i class="fas fa-plus" />
        </button>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/Lists/ListNameEdit';
import ListSettings from '@/components/Lists/ListSettings';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardCover from '@/components/GameCards/GameCardCover';
import GameCardWide from '@/components/GameCards/GameCardWide';
import GameCardText from '@/components/GameCards/GameCardText';
import GameSearch from '@/components/GameSearch/GameSearch';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    name: 'List',

    components: {
        GameCardDefault,
        GameCardCover,
        GameCardWide,
        GameCardText,
        GameSearch,
        ListNameEdit,
        ListSettings,
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
            gameCardComponents: {
                single: 'GameCardDefault',
                covers: 'GameCardCover',
                wide: 'GameCardWide',
                text: 'GameCardText',
            },
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform', 'activeListIndex', 'settings', 'searchActive']),

        ...mapGetters(['darkModeEnabled']),

        list() {
            return this.gameLists[this.platform.code];
        },

        searching() {
            return this.activeListIndex === this.listIndex && this.searchActive;
        },

        editing() {
            return this.activeListIndex === this.listIndex && !this.searchActive;
        },

        isEmpty() {
            return this.games.length === 0;
        },

        view() {
            return this.list[this.listIndex].view;
        },

        coversSizeClass() {
            return `covers-${this.coversSize}`;
        },

        coversSize() {
            const activeList = this.list[this.listIndex];

            return activeList.coversSize || 3;
        },

        gameCardComponent() {
            return this.view
                ? this.gameCardComponents[this.view]
                : 'GameCardDefault';
        },

        viewClass() {
            return this.list[this.listIndex].view || 'single';
        },

        transparent() {
            return this.settings
                && this.settings.wallpapers
                && this.settings.wallpapers[this.platform.code]
                && this.settings.wallpapers[this.platform.code].url
                && this.settings.wallpapers[this.platform.code].transparent
                ? 'transparent'
                : '';
        },
    },

    methods: {
        updateLists(toastMessage) {
            this.$store.commit('CLEAR_ACTIVE_LIST_INDEX');

            const message = toastMessage || 'List saved';

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        editList() {
            if (this.editing) {
                this.$store.commit('CLEAR_ACTIVE_LIST_INDEX');
            } else {
                this.$store.commit('SET_ACTIVE_LIST_INDEX', this.listIndex);
            }
        },

        addGame() {
            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST_INDEX', this.listIndex);
            this.$store.commit('SET_SEARCH_ACTIVE', true);
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
        background-color: $color-light-gray;
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 81px);
        transition: width 200ms;

        .games {
            display: grid;
        }

        &.transparent {
            background-color: $color-light-gray-transparent;
        }

        &.wide {
            width: $list-width-wide;
        }

        &.covers {
            .games {
                padding-top: $gp / 2;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: $gp / 4;
            }

            &.covers-3 {
                width: 300px;

                .games {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            &.covers-4 {
                width: 400px;

                .games {
                    grid-template-columns: repeat(4, 1fr);
                }
            }

            &.covers-5 {
                width: 500px;

                .games {
                    grid-template-columns: repeat(5, 1fr);
                }
            }

        }

        &.dark {
            background-color: $color-dark-gray;

            &.transparent {
                background-color: $color-dark-gray-transparent;
            }

            .list-header {
                background-color: $color-darker-gray;
            }

            .add-game-button {
                color: $color-white;
            }
        }

        .list-header {
            align-items: center;
            background: $color-dark-gray;
            color: $color-white;
            display: flex;
            height: $list-header-height;
            justify-content: space-between;
            padding-left: $gp / 2;
            position: absolute;
            width: 100%;

            &.searching {
                background: $color-green;
            }

            &.editing {
                background: $color-blue;
            }
        }

        .games {
            height: 100%;
            overflow: hidden;
            max-height: calc(100vh - 154px);
            min-height: 80px;
            overflow-y: auto;
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

    .list-settings {
        padding: $gp;
    }

    .add-game-button {
        width: 100%;
    }
</style>
