<template lang="html">
    <main>
        <form class="list-add" @submit.prevent="addList">
            <header>{{ $t('list.add') }}</header>

            <section>
                <input
                    v-model="newListName"
                    type="text"
                    ref="newListName"
                    autofocus
                    required
                    :placeholder="$t('list.placeholder')"
                />

                <panel
                    class="warning"
                    v-if="isDuplicate"
                    v-html="errorMessage"
                />

                <div class="suggestions">
                    <small>{{ $t('list.suggestionsTitle') }}:</small>

                    <button
                        class="tiny tag primary hollow"
                        v-for="suggestion in listNameSuggestions"
                        :key="suggestion"
                        type="button"
                        :disabled="listNames.includes(suggestion.toLowerCase())"
                        @click="addSuggestion($t(`list.suggestions.${suggestion}`))"
                    >
                        {{ $t(`list.suggestions.${suggestion}`) }}
                    </button>
                </div>
            </section>

            <footer>
                <button
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
                    {{ $t('global.save') }}
                </button>
            </footer>
        </form>
    </main>
</template>

<script>
import { mapState } from 'vuex';
import Panel from '@/components/Panel';

export default {
    components: {
        Panel,
    },

    data() {
        return {
            newListName: '',
            listNameSuggestions: [
                'owned',
                'wishlist',
                'currentlyPlaying',
                'completed',
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

            this.$store.commit('ADD_LIST', this.newListName);

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

    .panel.warning {
        margin-bottom: $gp / 2;
    }

    footer {
        padding: 0 $gp / 2 $gp / 2;
        display: flex;
        justify-content: space-between;
    }
</style>
