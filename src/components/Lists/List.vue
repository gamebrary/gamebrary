<!-- eslint-disable max-len -->
<template lang="html">
    <div :class="['list', viewClass, { unique }]">
        <header>
            <span>
                <i
                    class="fas fa-magic"
                    title="List sorted automatically"
                    v-if="autoSortEnabled"
                />
                {{ list[listIndex].name }} ({{ gameList.length }})
            </span>

            <list-settings :list-index="listIndex" />
        </header>

        <div
            :class="`game-grid game-grid-${listIndex}`"
            v-if="view === 'grid'"
        >
            <component
                v-for="game in gameList"
                :is="gameCardComponent"
                :key="`grid-${game}`"
                :id="game"
                :game-id="game"
                :list-id="listIndex"
            />
        </div>

        <draggable
            v-else
            :class="['games', { 'empty': isEmpty }]"
            :list="gameList"
            :id="listIndex"
            :move="validateMove"
            v-bind="gameDraggableOptions"
            @end="end"
            @start="start"
        >
            <component
                v-for="game in sortedGames"
                :is="gameCardComponent"
                :key="`grid-${game}`"
                :id="game"
                :game-id="game"
                :list-id="listIndex"
            />
        </draggable>

        <game-search :list-id="listIndex" />
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import Masonry from 'masonry-layout';
import ListSettings from '@/components/Lists/ListSettings';
import GameCardDefault from '@/components/GameCards/GameCardDefault';
import GameCardGrid from '@/components/GameCards/GameCardGrid';
import GameCardWide from '@/components/GameCards/GameCardWide';
import GameCardText from '@/components/GameCards/GameCardText';
import GameSearch from '@/components/GameSearch';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    name: 'List',

    components: {
        GameCardDefault,
        GameCardGrid,
        GameCardWide,
        GameCardText,
        GameSearch,
        ListSettings,
        draggable,
    },

    props: {
        name: String,
        gameList: [Object, Array],
        listIndex: [String, Number],
    },

    data() {
        return {
            masonry: null,
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
                grid: 'GameCardGrid',
                wide: 'GameCardWide',
                text: 'GameCardText',
            },
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform', 'settings', 'games']),

        ...mapGetters(['brandingEnabled']),

        autoSortEnabled() {
            const list = this.list[this.listIndex];

            return list && list.sortOrder && list.sortOrder !== 'sortByCustom';
        },

        sortedGames() {
            const sortOrder = this.list[this.listIndex].sortOrder || 'sortByCustom';
            const { gameList } = this;

            switch (sortOrder) {
            case 'sortByCustom':
                return gameList;
            case 'sortByRating':
                return gameList.sort((a, b) => {
                    const gameA = this.games[a] && this.games[a].rating
                        ? this.games[a].rating
                        : 0;

                    const gameB = this.games[b] && this.games[b].rating
                        ? this.games[b].rating
                        : 0;

                    if (gameA > gameB) {
                        return -1;
                    }

                    return gameA < gameB ? 1 : 0;
                });
            case 'sortByName':
                return gameList.sort((a, b) => {
                    const gameA = this.games[a] && this.games[a].name
                        ? this.games[a].name.toUpperCase()
                        : '';

                    const gameB = this.games[b] && this.games[b].name
                        ? this.games[b].name.toUpperCase()
                        : '';

                    if (gameA < gameB) {
                        return -1;
                    }

                    return gameA > gameB ? 1 : 0;
                });
            default:
                return gameList;
            }
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        isEmpty() {
            return this.gameList.length === 0;
        },

        view() {
            return this.list[this.listIndex].view;
        },

        unique() {
            return this.list.length === 1;
        },

        gameCardComponent() {
            return this.view && Object.keys(this.gameCardComponents).includes(this.view)
                ? this.gameCardComponents[this.view]
                : 'GameCardDefault';
        },

        viewClass() {
            return this.list[this.listIndex].view || 'single';
        },
    },

    watch: {
        view() {
            this.initGrid();

            setTimeout(() => {
                this.initGrid();
            }, 500);
        },

        gameList() {
            this.initGrid();

            setTimeout(() => {
                this.initGrid();
            }, 500);
        },
    },

    mounted() {
        this.initGrid();

        setTimeout(() => {
            this.initGrid();
        }, 500);
    },

    methods: {
        initGrid() {
            if (this.view === 'grid') {
                this.$nextTick(() => {
                    // eslint-disable-next-line
                    this.masonry = new Masonry(`.game-grid-${this.listIndex}`, {
                        itemSelector: '.game-card',
                        gutter: 4,
                    });
                });
            }
        },

        updateLists(toastMessage) {
            const message = toastMessage || 'List saved';

            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
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
    @import "~styles/styles";

    .list {
        flex-shrink: 0;
        cursor: default;
        position: relative;
        width: 300px;
        background: var(--list-background);
        border-radius: $border-radius;
        overflow: hidden;
        margin-right: $gp;
        max-height: calc(100vh - 100px);

        .games {
            display: grid;
        }

        &.unique {
            @media($small) {
                width: calc(100vw - 80px);
            }
        }

        header {
            align-items: center;
            background: var(--list-header-background);
            color: var(--list-header-text-color);
            display: flex;
            height: $list-header-height;
            justify-content: space-between;
            padding-left: $gp / 2;
            position: absolute;
            border-radius: $border-radius;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            width: 100%;
        }

        .games {
            height: 100%;
            overflow: hidden;
            max-height: calc(100vh - 150px);
            min-height: 80px;
            overflow-y: auto;
            margin-top: $list-header-height;
            padding: $gp / 2 $gp / 2 0;
            width: 100%;

            &.empty {
                margin: ($list-header-height + $gp / 2) $gp / 2 $gp / 2;
                padding: $gp;
                width: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed #a5a2a2;
            }
        }
    }

    .list-settings {
        padding: $gp;
    }

    .game-grid {
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;
        max-height: calc(100vh - 154px);
        min-height: 80px;
        overflow-y: auto;
        margin-top: $list-header-height;
        padding: 4px;
        width: 100%;
    }
</style>
