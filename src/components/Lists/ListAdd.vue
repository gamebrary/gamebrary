<template lang="html">
    <modal :title="title" ref="listAddModal" @open="open">
        <button
            class="small primary add-list-button"
            :title="$t('list.add')"
        >
            <i class="fas fa-plus" />
        </button>

        <form class="list-add" @submit.prevent="addList" slot="content">
            <input
                v-model.trim="listName"
                type="text"
                autofocus
                required
                :placeholder="$t('list.placeholder')"
            />

            <footer>
                <button
                    class="primary"
                    type="submit"
                    :disabled="disabled"
                >
                    {{ buttonLabel }}
                </button>

                <small v-if="isDuplicate">{{ $t('list.duplicateWarning') }}</small>
            </footer>
        </form>
    </modal>
</template>

<script>
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
    components: {
        Modal,
    },

    data() {
        return {
            listName: '',
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        lists() {
            return this.gameLists[this.platform.code];
        },

        title() {
            return this.isEmptyBoard
                ? this.$t('list.addFirstTime')
                : this.$t('list.add');
        },

        buttonLabel() {
            return this.isEmptyBoard
                ? this.$t('list.getStarted')
                : this.$t('global.save');
        },

        existingListNames() {
            return this.lists
                ? this.lists.map(({ name }) => name.toLowerCase())
                : [];
        },

        isDuplicate() {
            return this.existingListNames.includes(this.listName.toLowerCase());
        },

        isEmptyBoard() {
            const newList = this.gameLists && this.platform && !this.gameLists[this.platform.code];
            const emptyList = this.gameLists[this.platform.code]
                && this.gameLists[this.platform.code].length === 0;

            return newList || emptyList;
        },

        disabled() {
            return this.isDuplicate || !this.listName;
        },
    },

    methods: {
        open() {
            this.listName = '';
        },

        addList() {
            if (this.disabled) {
                return;
            }

            const list = {
                games: [],
                name: this.listName,
            };

            this.$store.commit('ADD_LIST', list);

            this.$store.dispatch('SAVE_LIST', this.gameLists)
                .then(() => {
                    this.$bus.$emit('TOAST', { message: 'List added' });
                    this.$refs.listAddModal.close();
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "src/styles/styles.scss";

    .add-list-button {
        margin-right: $gp;
    }

    .list-add {
        padding: 0 $gp $gp;
        margin-right: $gp;
    }

    small {
        color: var(--note-color);
    }

    footer {
        margin-top: $gp;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
