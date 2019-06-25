<template lang="html">
    <div class="game-board-actions">
        <div class="actions">
            <button
                class="small info"
                :title="$t('list.add')"
                @click="addList"
            >
                <i class="fas fa-plus" />
            </button>

            <modal
                :title="$t('tags.title')"
                ref="tags"
                :message="$t('tags.useTags')"
                padded
            >
                <button
                    class="small accent"
                    :title="$t('tags.title')"
                >
                    <i class="fas fa-tag" />
                </button>

                <tags slot="content" />
            </modal>

            <modal
                :title="`${platform.name}`"
                ref="settings"
                padded
            >
                <button
                    class="small accent"
                    :title="$t('tags.title')"
                >
                    <i class="fas fa-cog" />
                </button>

                <game-board-settings
                    slot="content"
                    @update="update"
                />
            </modal>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal/Modal';
import Tags from '@/components/Tags/Tags';
import ListAdd from '@/components/Lists/ListAdd';
import GameBoardSettings from '@/components/GameBoard/GameBoardSettings';
import WallpaperUpload from '@/components/WallpaperUpload/WallpaperUpload';

export default {
    components: {
        Modal,
        Tags,
        WallpaperUpload,
        ListAdd,
        GameBoardSettings,
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },
    },

    methods: {
        addList() {
            this.$store.commit('SET_ADDING_LIST_STATUS', true);
        },

        update(force) {
            this.$emit('update', force);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "src/styles/styles.scss";

    .game-board-actions {
        padding-right: $gp;
    }

    .actions {
        display: grid;
        grid-gap: $gp;
        align-items: center;
        flex-direction: column;
    }

    small {
        background: $color-white;
        margin-bottom: $gp / 2;
        display: block;
        padding: $gp / 2;
        border-radius: $border-radius;
    }

    .suggestions {
        display: grid;
        grid-gap: $gp;
    }
</style>
