<template lang="html">
    <main>
        <form class="list-add" @submit.prevent="addList">
            <header>{{ title }}</header>

            <section>
                <label for="newListName">List name:</label>

                <input
                    name="newListName"
                    v-model.trim="newListName"
                    type="text"
                    ref="newListName"
                    autofocus
                    required
                    :placeholder="$t('list.placeholder')"
                />

                <div class="button-group">
                    <button type="button" class="xsmall" @click="listType = null">
                        <i class="fas fa-check-square" v-if="listType === null" />
                        <i class="far fa-square" v-else />
                        Collection
                    </button>

                    <button type="button" class="xsmall" @click="listType = 'wishlist'">
                        <i class="fas fa-check-square" v-if="listType === 'wishlist'" />
                        <i class="far fa-square" v-else />
                        Wishlist
                    </button>
                </div>

                <small v-if="isDuplicate">
                    {{ $t('list.duplicateWarning') }}
                </small>
            </section>

            <footer>
                <button
                    v-if="!isEmptyBoard"
                    class="small info"
                    type="button"
                    v-shortkey="['esc']"
                    @shortkey="reset"
                    @click="reset"
                >
                    {{ $t('global.cancel') }}
                </button>

                <button
                    class="small primary action"
                    type="submit"
                    :disabled="isDuplicate || !newListName"
                    @click="addList"
                >
                    {{ buttonLabel }}
                </button>
            </footer>
        </form>
    </main>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            newListName: '',
            listType: null,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        list() {
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

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();

            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },

        isEmptyBoard() {
            const newList = this.gameLists && this.platform && !this.gameLists[this.platform.code];
            const emptyList = this.gameLists[this.platform.code]
                && this.gameLists[this.platform.code].length === 0;

            return newList || emptyList;
        },
    },

    mounted() {
        this.focusField();
    },

    methods: {
        addSuggestion(suggestion) {
            this.newListName = suggestion;
            this.addList();
        },

        focusField() {
            this.$nextTick(() => {
                this.$emit('scroll');
            });
        },

        reset() {
            this.newListName = '';
            this.$store.commit('SET_ADDING_LIST_STATUS', false);
        },

        addList() {
            if (this.isDuplicate || !this.newListName) {
                return;
            }

            this.$store.commit('ADD_LIST', {
                listName: this.newListName,
                listType: this.listType,
            });

            this.$ga.event({
                eventCategory: 'list',
                eventAction: 'add',
                eventLabel: 'listAdded',
                eventValue: this.newListName,
            });

            this.$emit('update');
            this.$emit('scroll');
            this.reset();

            this.$bus.$emit('TOAST', { message: 'List added' });

            this.$nextTick(() => {
                this.$emit('scroll');
            });

            this.$store.commit('CLEAR_SEARCH_RESULTS');
            this.$store.commit('SET_ACTIVE_LIST_INDEX', this.list.length - 1);
            this.$store.commit('SET_SEARCH_ACTIVE', true);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "src/styles/styles.scss";

    main {
        flex-shrink: 0;
        padding-right: $gp;
    }

    .list-add {
        background: $color-light-gray;
        width: 300px;
        border-radius: $border-radius;
        overflow: hidden;
    }

    header {
        background-color: $color-green;
        color: $color-white;
        display: flex;
        align-items: center;
        height: $list-header-height;
        padding: 0 $gp / 2;
    }

    section {
        padding: $gp / 2;

        small {
            display: flex;
            margin-bottom: $gp / 4;
        }

        input {
            margin-bottom: $gp / 2;
        }
    }

    .panel.warning {
        margin-bottom: $gp / 2;
    }

    footer {
        padding: 0 $gp / 2 $gp / 2;
        display: flex;
        justify-content: space-between;
    }

    .list-types {
        // display: grid;
        // grid-template-columns: 1fr 1fr;
        // grid-gap: $gp;
    }
</style>
