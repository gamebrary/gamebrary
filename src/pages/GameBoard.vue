<template lang="html">
    <div
        class="game-board"
        ref="gameBoard"
        v-if="user && platform"
    >
        <game-board-placeholder :id="gameDetailId" v-if="loading" />

        <modal
            ref="game"
            large
            @close="closeGame"
        >
            <game-detail
                v-if="gameDetailId"
                slot="content"
                :id="gameDetailId"
                :list-id="gameDetailListIndex"
            />
        </modal>

        <modal
            ref="tag"
            :title="$t('tags.applyTag')"
            :message="$t('tags.useTags')"
            padded
            confirm
        >
            <div slot="content">
                <div
                    class="tags"
                    v-for="(tag, name) in tags"
                    :key="name"
                >
                    <tag
                        :label="name"
                        :hex="tag.hex"
                        :readonly="!tag.games.includes(gameTagsId)"
                        @action="tryAdd(tag.games, name)"
                        @close="removeTag(name)"
                    />
                </div>
            </div>
        </modal>

        <template>
            <list
                :name="list.name"
                :game-list="list.games"
                :listIndex="listIndex"
                :key="`${list.name}-${listIndex}`"
                v-if="list && !loading"
                v-for="(list, listIndex) in gameLists[platform.code]"
                @end="dragEnd"
            />

            <list-add
                @scroll="scroll"
                @update="updateLists"
            />
        </template>
    </div>
</template>

<script>
import GameBoardPlaceholder from '@/components/GameBoard/GameBoardPlaceholder';
import Tag from '@/components/Tag';
import ListAdd from '@/components/Lists/ListAdd';
import Modal from '@/components/Modal';
import List from '@/components/Lists/List';
import GameDetail from '@/pages/GameDetail';
import { chunk } from 'lodash';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export default {
    components: {
        draggable,
        List,
        GameBoardPlaceholder,
        ListAdd,
        Tag,
        GameDetail,
        Modal,
    },

    data() {
        return {
            dragging: false,
            draggingId: null,
            loading: false,
            gameData: null,
            gameDetailListIndex: null,
            gameDetailId: null,
            gameTagsId: null,
            queryLimit: 500,
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform', 'tags', 'games']),

        list() {
            return this.gameLists && this.platform && this.gameLists[this.platform.code]
                ? this.gameLists[this.platform.code]
                : null;
        },
    },

    mounted() {
        if (this.platform) {
            this.load();
            this.setPageTitle();
        } else {
            this.$router.push({ name: 'platforms' });
        }

        this.$bus.$on('OPEN_GAME', this.openGame);
        this.$bus.$on('OPEN_TAGS', this.openTags);
    },

    beforeDestroy() {
        this.$bus.$off('OPEN_GAME');
        this.$bus.$off('OPEN_TAGS');
    },

    methods: {
        tryAdd(games, tagName) {
            if (!games.includes(this.gameTagsId)) {
                this.addTag(tagName);
            }
        },

        addTag(tagName) {
            this.$store.commit('ADD_GAME_TAG', { tagName, gameId: this.gameTagsId });
            this.$bus.$emit('SAVE_TAGS', this.tags);
        },

        closeGame() {
            this.setPageTitle();
            this.gameDetailId = null;
        },

        setPageTitle() {
            document.title = this.platform
                ? `${this.platform.name} - Gamebrary`
                : 'Gamebrary';
        },

        removeTag(tagName) {
            this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameTagsId });
            this.$bus.$emit('SAVE_TAGS', this.tags);
        },

        openGame({ id, listId }) {
            this.gameDetailId = id;
            this.gameDetailListIndex = listId;
            this.$refs.game.open();
        },

        openTags(id) {
            this.gameTagsId = id;
            this.$refs.tag.open(id);
        },

        scroll() {
            this.$nextTick(() => {
                const gameBoard = this.$refs.gameBoard;
                gameBoard.scrollLeft = gameBoard.scrollWidth;
            });
        },

        dragEnd() {
            this.dragging = false;
            this.draggingId = null;
            this.$bus.$emit('TOAST', { message: 'List updated' });
            this.updateLists();
        },

        updateLists(force) {
            // TOOD: move to actions
            db.collection('lists').doc(this.user.uid).set(this.gameLists, { merge: !force })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        load() {
            const flattenedList = this.list
                ? this.list.map(({ games }) => games).flat()
                : [];

            const dedupedList = Array.from(new Set(flattenedList));

            return dedupedList.length > this.queryLimit
                ? this.loadGamesInChunks(dedupedList)
                : this.loadGames(dedupedList);
        },

        loadGames(gameList) {
            if (gameList && gameList.length > 0) {
                this.loading = true;

                this.$store.dispatch('LOAD_GAMES', gameList.toString())
                    .then(() => {
                        this.loading = false;
                    })
                    .catch(() => {
                        this.$bus.$emit('TOAST', { message: 'Error loading games', type: 'error' });
                    });
            }
        },

        loadGamesInChunks(gameList) {
            const chunkedGameList = chunk(gameList, this.queryLimit);

            chunkedGameList.forEach((gameListChunk) => {
                this.loadGames(gameListChunk);
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .game-board {
        user-select: none;
        display: flex;
        align-items: flex-start;
        height: calc(100vh - 48px);
        padding: 0 $gp;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-x: overlay;
        display: flex;
    }

    .list-placeholder {
        opacity: 0.25;
    }
</style>
