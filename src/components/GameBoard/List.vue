<!-- eslint-disable max-len -->
<template lang="html">
    <div :class="['list', viewClass, { dark: darkModeEnabled }]">
        <div class="list-header" :class="{ searching, editing }">
            <div v-if="searching">
                {{ $t('game.addPlural') }}
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

        <button
            v-if="!searching && !editing"
            @click="addGame"
            :title="$t('game.add')"
        >
            <i class="fas fa-plus" />

            <small>{{ $t('game.add') }}</small>
        </button>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListNameEdit from '@/components/GameBoard/ListNameEdit';
import ListSettings from '@/components/GameBoard/ListSettings';
import GameCard from '@/components/GameCard/GameCard';
import GameSearch from '@/components/GameSearch/GameSearch';
import { mapState, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        GameCard,
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

        viewClass() {
            return this.list[this.listIndex].view || 'single';
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
    @import "src/styles/styles.scss";

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

        &.wide {
            width: 340px;
        }

        &.covers {
            .games {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-gap: $gp / 2;
            }
        }

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

    .list-settings {
        padding: $gp;
    }

    footer {
        height: 42px;
        padding: 0 $gp / 2;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
