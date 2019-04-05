<template lang="html">
    <main>
        <form class="list-add">
            <header>Add list</header>

            <section>
                <input
                    v-model="newListName"
                    type="text"
                    ref="newListName"
                    autofocus
                    required
                    placeholder="List name (e.g. Owned)"
                />

                <panel
                    class="warning"
                    v-if="isDuplicate"
                    v-html="errorMessage"
                />

                <div class="suggestions">
                    <small>Suggestions:</small>

                    <button
                        class="small tiny tag primary hollow"
                        v-for="suggestion in listNameSuggestions"
                        :key="suggestion"
                        type="button"
                        :disabled="listNames.includes(suggestion.toLowerCase())"
                        @click="addList(suggestion)"
                    >
                        {{ suggestion }}
                    </button>
                </div>
            </section>

            <footer>
                <button
                    class="small info"
                    @click="reset"
                >
                    Cancel
                </button>

                <button
                    class="small primary action"
                    :disabled="isDuplicate || !newListName"
                    @click="addList"
                >
                    Save
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
            listNameSuggestions: [
                'Owned',
                'Wishlist',
                'Currently Playing',
                'Completed',
            ],
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },

        errorMessage() {
            return `You already have a list named <strong>${this.newListName}</strong>. Please use a different name.`;
        },

        listNames() {
            return this.list ?
                this.list.map(({ name }) => name.toLowerCase())
                : [];
        },

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();

            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },
    },

    mounted() {
        this.focusField();
    },

    methods: {
        focusField() {
            this.$nextTick(() => {
                this.$emit('scroll');
            });
        },

        reset() {
            this.newListName = '';
            this.$store.commit('SET_ADDING_LIST_STATUS', false);
        },

        addList(e, suggestion) {
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
        display: flex;
        align-items: center;
        background: $color-green;
        color: $color-white;
        height: $list-header-height;
        padding-left: $gp / 2;
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

    footer {
        padding: 0 $gp / 2 $gp / 2;
        display: flex;
        justify-content: space-between;
    }
</style>
