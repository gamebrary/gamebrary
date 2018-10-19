<template lang="html">
    <div
        class="lists"
        ref="lists"
        @dragscrollstart="dragScrollActive = true"
        @dragscrollend="dragScrollActive = false"
        :class="{ nightMode, 'drag-scroll-active': dragScrollActive }"
        v-dragscroll:nochilddrag
    >
        <list
            :name="list.name"
            :games="list.games"
            :listIndex="listIndex"
            :key="list.name"
            v-if="list"
            v-for="(list, listIndex) in user.lists"
            @end="dragEnd"
            @remove="tryDelete(listIndex)"
        />

        <add-list
            @update="updateLists(true)"
            @scroll="scroll"
        />
    </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import AddList from '@/components/Lists/AddList';
import toasts from '@/mixins/toasts';
import List from '@/components/GameBoard/List';
import draggable from 'vuedraggable';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
    components: {
        draggable,
        List,
        AddList,
    },

    directives: {
        dragscroll,
    },

    mixins: [toasts],

    data() {
        return {
            dragging: false,
            draggingId: null,
            gameData: null,
            loading: false,
            activeList: null,
            showDeleteConfirm: false,
            dragScrollActive: false,
            listDraggableOptions: {
                animation: 500,
                handle: '.list-drag-handle',
                group: { name: 'lists' },
                draggable: '.list',
                ghostClass: 'list-placeholder',
            },
        };
    },

    computed: {
        ...mapState(['user']),

        isEmpty() {
            return !this.user.lists.filter(list => list && list.games && list.games.length).length;
        },

        nightMode() {
            return this.user && this.user.settings ? this.user.settings.nightMode : false;
        },
    },

    mounted() {
        if (!this.isEmpty) {
            this.loadGameData();
        }

        this.checkDataAge();
    },

    methods: {
        checkDataAge() {
            const lastUpdated = this.$store.state.dataUpdatedTimestamp;
            const diff = moment.duration(moment().diff(lastUpdated));

            if (diff.asMinutes() > 15) {
                this.$store.dispatch('LOAD_LISTS');
            }
        },

        scroll() {
            this.$nextTick(() => {
                const lists = this.$refs.lists;
                lists.scrollLeft = lists.scrollWidth;
            });
        },

        tryDelete(index) {
            const hasGames = this.user.lists[index].games.length > 0;

            if (hasGames) {
                this.showDeleteConfirm = true;
                this.activeList = index;

                this.$swal({
                    title: 'Are you sure?',
                    text: 'This lists contains games, all games will be deleted as well.',
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonClass: 'primary small',
                    cancelButtonClass: 'small',
                    confirmButtonText: 'Delete',
                }).then(({ value }) => {
                    if (value) {
                        this.deleteList(this.activeList);
                    }
                });
            } else {
                this.deleteList(index);
            }
        },

        deleteList(index) {
            this.$store.commit('REMOVE_LIST', index);
            this.updateLists();
            this.$success('List deleted');
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.$store.commit('UPDATE_LIST', this.user.lists);
            this.updateLists();
        },

        updateLists(forceReload) {
            this.$store.dispatch('UPDATE_LISTS')
                .then(() => {
                    if (this.user.lists.length === 1 && forceReload) {
                        location.reload();
                    }
                });
        },

        loadGameData() {
            const gameList = [];
            this.user.lists.forEach((list) => {
                if (list && list.games.length) {
                    list.games.forEach((id) => {
                        if (!gameList.includes(id)) {
                            gameList.push(id);
                        }
                    });
                }
            });

            this.$store.dispatch('LOAD_GAMES', gameList)
                .catch(() => {
                    this.$swal({
                        title: 'Uh no!',
                        text: 'There was an error loading your game data',
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonClass: 'primary',
                        confirmButtonText: 'Retry',
                    }).then(({ value }) => {
                        if (value) {
                            this.loadGameData();
                        }
                    });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    @import "~styles/game-board.scss";

    .draggable * {
        color: $color-white;
    }

    .nightMode {
        background: #333 !important;

        .games {
            background: $color-dark-gray;
        }

        .list-header {
            box-shadow: 0 0 5px 5px $color-dark-gray;
        }
    }
</style>
