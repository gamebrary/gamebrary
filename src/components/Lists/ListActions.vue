<template lang="html">
    <div class="list-actions">
        <div class="actions">
            <modal
                ref="addList"
                message="Pick an option below"
                padded
                show-close
                :action-text="$t('global.create')"
                :title="$t('list.add')"
                :action-disabled="isDuplicate || !newListName"
                @action="addList"
                @close="reset"
                @open="focusField"
            >
                <button
                    class="small info"
                    :title="$t('list.add')"
                >
                    <i class="fas fa-plus" />
                </button>

                <form slot="content">
                    <div class="suggestions">
                        <button
                            class="small primary hollow"
                            v-for="suggestion in listNameSuggestions"
                            :key="suggestion"
                            type="button"
                            :disabled="listNames.includes(suggestion.toLowerCase())"
                            @click="addList(suggestion)"
                        >
                            {{ suggestion }}
                        </button>
                    </div>

                    <p>Or enter your own list name</p>

                    <input
                        v-model="newListName"
                        type="text"
                        ref="newListName"
                        autofocus
                        required
                        :placeholder="$t('list.input')"
                    />

                    <panel
                        class="warning"
                        v-if="isDuplicate"
                        v-html="errorMessage"
                    />
                </form>
            </modal>

            <modal
                title="Game tags"
                ref="tags"
                message="Use tags to better organize your games"
                large
                padded
            >
                <button
                    class="small info"
                    :title="$t('list.delete')"
                >
                    <i class="fas fa-tag" />
                </button>

                <tags slot="content" />
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
import Panel from '@/components/Panel/Panel';
import Modal from '@/components/Modal/Modal';
import Tags from '@/components/Tags/Tags';
import ShareList from '@/components/ShareList/ShareList';

export default {
    components: {
        Modal,
        Tags,
        ShareList,
        Panel,
    },

    data() {
        return {
            newListName: '',
            listNameSuggestions: [
                'Owned',
                'Wishlist',
                'Currently Playing',
                'Completed',
            ],
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),

        errorMessage() {
            return `You already have a list named <strong>${this.newListName}</strong>. Please use a different name.`;
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();

            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },

        listNames() {
            return this.list ?
                this.list.map(({ name }) => name.toLowerCase())
                : [];
        },
    },

    mounted() {
        if (!this.list) {
            this.$refs.addList.open();
        }
    },

    methods: {
        focusField() {
            this.$nextTick(() => {
                if (this.$refs.newListName) {
                    this.$refs.newListName.focus();
                }
            });
        },

        deletePlatform() {
            this.$store.commit('REMOVE_PLATFORM');
            this.$router.push({ name: 'platforms' });
            this.$emit('update', true);
        },

        addList(suggestion) {
            const listName = suggestion || this.newListName;
            this.$store.commit('ADD_LIST', listName);

            this.$ga.event({
                eventCategory: 'list',
                eventAction: 'add',
                eventLabel: 'listAdded',
                eventValue: listName,
            });

            this.$emit('update');
            this.$emit('scroll');
            this.reset();

            this.$bus.$emit('TOAST', { message: 'List added' });

            this.$nextTick(() => {
                this.$emit('scroll');
            });

            if (suggestion) {
                this.$refs.addList.close();
            }

            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST_INDEX', this.list.length - 1);
            this.$store.commit('SET_SEARCH_ACTIVE', true);
        },

        reset() {
            this.newListName = '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .list-actions {
        padding-right: $gp;
    }

    .actions {
        display: grid;
        grid-gap: $gp;
        align-items: center;
        flex-direction: column;
    }

    .panel.warning {
        margin: 0 0 $gp;
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
