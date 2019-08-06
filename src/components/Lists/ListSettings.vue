<template lang="html">
    <div class="list-settings">
        <h4>{{ $t('list.moveList') }}</h4>

        <div class="button-grid">
            <button
                class="xsmall primary hollow"
                :title="$t('list.moveLeft')"
                :disabled="isFirst"
                @click="moveList(activeListIndex, activeListIndex - 1)"
            >
                <i class="fas fa-arrow-left" />

                {{ $t('list.moveLeft') }}
            </button>

            <button
                class="xsmall primary hollow"
                :title="$t('list.moveRight')"
                :disabled="isLast"
                @click="moveList(activeListIndex, activeListIndex + 1)"
            >
                {{ $t('list.moveRight') }}
                <i class="fas fa-arrow-right" />
            </button>
        </div>

        <section>
            <h4>{{ $t('list.view') }}</h4>

            <div class="button-group">
                <button
                    v-for="(icon, view) in views"
                    :key="view"
                    class="xsmall primary"
                    :class="{ hollow: activeList.view !== view }"
                    @click="setListView(view)"
                >
                    <i :class="icon" />
                    <br>
                    {{ $t(`list.views.${view}`) }}
                </button>
            </div>
        </section>

        <section v-if="hasMultipleGames">
            <h4>{{ $t('list.sortList') }}</h4>

            <div class="button-group">
                <button
                    v-for="(icon, sortOrder) in sortOrders"
                    :key="sortOrder"
                    class="xsmall primary"
                    :class="{ hollow: activeList.sortOrder !== sortOrder }"
                    @click="setListSort(sortOrder)"
                >
                    <i :class="icon" />
                    <br>
                    {{ $t(`list.${sortOrder}`) }}
                </button>
            </div>
        </section>

        <footer>
            <button
                class="filled tiny info hollow"
                title="back"
                v-shortkey="['esc']"
                @shortkey="cancel"
                @click="cancel"
            >
                <i class="fas fa-chevron-left" />
                {{ $t('global.back') }}
            </button>

            <modal
                v-if="activeList.games && activeList.games.length"
                ref="addList"
                :message="warningMessage"
                title="Are you sure?"
                :action-text="$t('list.delete')"
                padded
                @action="deleteList"
            >
                <button
                    class="error hollow tiny"
                    :title="$t('list.delete')"
                >
                    <i class="far fa-trash-alt" />
                    {{ $t('list.delete') }}
                </button>
            </modal>

            <button
                v-else
                class="error hollow tiny"
                :title="$t('list.delete')"
                @click="deleteList"
            >
                <i class="far fa-trash-alt" />
                {{ $t('list.delete') }}
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
                grid: 'fas fa-th-large',
                wide: 'fas fa-minus',
                text: 'fas fa-font',
            },
            sortOrders: {
                sortByName: 'fas fa-sort-alpha-down',
                sortByRating: 'fas fa-star',
                sortByReleaseDate: 'fas fa-calendar-alt',
                sortByCustom: 'fas fa-user',
            },
        };
    },

    computed: {
        ...mapState(['user', 'activeListIndex', 'gameLists', 'platform']),
        ...mapGetters(['activeList', 'darkModeEnabled']),

        isFirst() {
            return this.activeListIndex === 0;
        },

        isLast() {
            const lastListIndex = Object.keys(this.gameLists[this.platform.code]).length - 1;

            return this.activeListIndex === lastListIndex;
        },

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

        this.$bus.$on('GAMES_ADDED', () => {
            this.sort(this.activeList.sortOrder);
        });
    },

    beforeDestroy() {
        this.$bus.$off('GAMES_ADDED');
    },

    methods: {
        deleteList() {
            this.$store.commit('REMOVE_LIST', this.activeListIndex);

            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: true })
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'List deleted' });
                    this.$store.commit('CLEAR_ACTIVE_LIST_INDEX');
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

        setListSort(sortOrder) {
            this.$store.commit('UPDATE_LIST_SORT', {
                listIndex: this.activeListIndex,
                sortOrder,
            });
            this.sort(sortOrder);
            this.$emit('update');
        },

        setCoversSize(size) {
            this.$store.commit('UPDATE_LIST_COVERS_SIZE', {
                listIndex: this.activeListIndex,
                size,
            });

            this.$emit('update');
        },

        sort(sortOrder) {
            if (sortOrder === 'sortByName') {
                this.$store.commit('SORT_LIST_ALPHABETICALLY', this.activeListIndex);
                this.$emit('update', 'List sorted alphabetically');
            } else if (sortOrder === 'sortByRating') {
                this.$store.commit('SORT_LIST_BY_RATING', this.activeListIndex);
                this.$emit('update', 'List sorted by game rating');
            } else if (sortOrder === 'sortByReleaseDate') {
                this.$store.commit('SORT_LIST_BY_RELEASE_DATE', this.activeListIndex);
                this.$emit('update', 'List sorted by game rating');
            }
        },

        cancel() {
            this.$store.commit('CLEAR_ACTIVE_LIST_INDEX');
        },

        moveList(from, to) {
            this.$store.commit('MOVE_LIST', { from, to });
            this.$emit('update', 'List moved');
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .list-settings {
        background: $color-light-gray;
        margin-top: $list-header-height;
    }

    section {
        margin-bottom: $gp;
    }

    h4 {
        margin-bottom: $gp / 2;
    }

    .actions, footer {
        display: flex;
        justify-content: space-between;
    }

    footer {
        border-top: 1px solid $color-gray;
        padding-top: $gp / 2;
        margin-top: $gp;
    }

    .button-group {
        border: 1px solid $color-blue;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .button-grid {
        display: flex;
        justify-content: space-between;
        margin-bottom: $gp;
    }
</style>
