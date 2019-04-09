<template lang="html">
    <div class="list-actions">
        <div class="actions">
            <button
                class="small info"
                :title="$t('list.add')"
                @click="addList"
            >
                <i class="fas fa-plus" />
            </button>

            <modal
                title="Game tags"
                ref="tags"
                message="Use tags to better organize your games"
                large
                padded
            >
                <button
                    class="small info"
                    title="Game tags"
                >
                    <i class="fas fa-tag" />
                </button>

                <tags slot="content" />
            </modal>

            <modal
                title="Custom wallpaper"
                ref="wallpapers"
                message="Upload your own wallpaper to customize your game board!"
                padded
            >
                <button
                    class="small success"
                    title="Upload wallpaper"
                >
                    <i class="far fa-image" />
                </button>

                <wallpaper-upload slot="content" />
            </modal>

            <modal
                :action-text="`Delete forever`"
                :message="`Your ${platform.name} collection will be deleted forever.`"
                :title="`Delete ${platform.name} collection`"
                padded
                show-close
                @action="deletePlatform"
            >
                <button
                    class="small info"
                    :title="$t('list.delete')"
                >
                    <i class="far fa-trash-alt" />
                </button>
            </modal>

            <share-list />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from '@/components/Modal/Modal';
import Tags from '@/components/Tags/Tags';
import ShareList from '@/components/ShareList/ShareList';
import ListAdd from '@/components/Lists/ListAdd';
import WallpaperUpload from '@/components/WallpaperUpload/WallpaperUpload';

export default {
    components: {
        Modal,
        Tags,
        WallpaperUpload,
        ShareList,
        ListAdd,
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();

            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },
    },

    methods: {
        addList() {
            this.$store.commit('SET_ADDING_LIST_STATUS', true);
        },

        deletePlatform() {
            this.$store.commit('REMOVE_PLATFORM');
            this.$router.push({ name: 'platforms' });
            this.$emit('update', true);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "src/styles/styles.scss";

    .list-actions {
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
