<template lang="html">
    <div class="list-settings">
        <section class="actions">
            <button
                class="small primary hollow"
                :title="$t('list.moveLeft')"
                :disabled="activeListIndex === 0"
                @click="moveList(activeListIndex, activeListIndex - 1)"
            >
                <i class="fas fa-caret-left" />

                {{ $t('list.moveLeft') }}
            </button>

            <button
                class="small primary hollow"
                :title="$t('list.moveRight')"
                :disabled="activeListIndex === (Object.keys(gameLists[platform.code]).length - 1)"
                @click="moveList(activeListIndex, activeListIndex + 1)"
            >
                <i class="fas fa-caret-right" />

                {{ $t('list.moveRight') }}
            </button>
        </section>

        <section>
            <h4>List view</h4>

            <button
                v-for="(icon, view) in views"
                :key="view"
                class="small primary hollow"
                @click="setListView(view)"
            >
                <i :class="icon" />
                {{ view }}
            </button>
        </section>

        <section v-if="hasMultipleGames">
            <h4>Sort List</h4>

            <button
                class="small info hollow"
                :title="$t('list.sortByName')"
                @click="sortListAlphabetically"
            >
                <i class="fas fa-sort-alpha-down" />
                {{ $t('list.sortByName') }}
            </button>

            <button
                class="small info hollow"
                :title="$t('list.sortByRating')"
                @click="sortListByRating"
            >
                <i class="fas fa-sort-numeric-up" />
                {{ $t('list.sortByRating') }}
            </button>
        </section>

        <modal
            v-if="activeList.games && activeList.games.length"
            ref="addList"
            :message="warningMessage"
            title="Are you sure?"
            :action-text="$t('list.delete')"
            @action="deleteList"
        >
            <button
                class="error hollow tiny small"
                :title="$t('list.delete')"
            >
                <i class="far fa-trash-alt" />
                {{ $t('list.delete') }}
            </button>
        </modal>

        <button
            v-else
            class="error hollow tiny small"
            :title="$t('list.delete')"
            @click="deleteList"
        >
            <i class="far fa-trash-alt" />
            {{ $t('list.delete') }}
        </button>

        <footer>
            <button class="small filled info" @click="cancel" title="back">
                <i class="fas fa-chevron-left" />
                Back
            </button>
        </footer>
    </div>
</template>

<script>
import Modal from '@/components/Modal/Modal';
import { mapGetters, mapState } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        Modal,
    },

    data() {
        return {
            localList: {},
            views: {
                single: 'fas fa-square',
                covers: 'fas fa-th-large',
                wide: 'fas fa-minus',
            },
        };
    },

    computed: {
        ...mapState(['user', 'activeListIndex', 'gameLists', 'platform']),
        ...mapGetters(['activeList']),

        hasMultipleGames() {
            return this.activeList.games.length > 1;
        },

        disableSave() {
            return this.localList.name === this.activeList.name;
        },

        warningMessage() {
            const gameCount = this.activeList.games.length;

            return `This list contains ${gameCount} games, all games will be deleted as well.`;
        },
    },

    mounted() {
        this.localList = JSON.parse(JSON.stringify(this.activeList));
    },

    methods: {
        deleteList() {
            this.$store.commit('REMOVE_LIST', this.activeListIndex);

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'List deleted' });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                });
        },

        setListView(view) {
            this.$store.commit('UPDATE_LIST_VIEW', {
                listIndex: this.activeListIndex,
                view,
            });

            this.$emit('update');
        },

        cancel() {
            this.$store.commit('CLEAR_ACTIVE_LIST_INDEX');
        },

        moveList(from, to) {
            this.$store.commit('MOVE_LIST', { from, to });
            this.$emit('update', 'List moved');
        },

        sortListAlphabetically() {
            this.$store.commit('SORT_LIST_ALPHABETICALLY', this.activeListIndex);
            this.$emit('update', 'List sorted alphabetically');
        },

        sortListByRating() {
            this.$store.commit('SORT_LIST_BY_RATING', this.activeListIndex);
            this.$emit('update', 'List sorted by game rating');
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .list-settings {
        margin-top: $list-header-height;
    }

    section {
        margin-bottom: $gp;
    }

    .actions, footer {
        display: flex;
        justify-content: space-between;
    }

    footer {
        border-top: 1px solid $color-gray;
        padding-top: $gp / 2;
        margin-top: $gp / 2;
    }
</style>
