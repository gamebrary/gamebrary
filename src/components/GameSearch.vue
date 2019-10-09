<!-- TODO: rename component to add-game or similar -->
<template lang="html">
    <modal padded :title="$t('list.addGame')" @open="clear">
        <button class="add-game-button small secondary" :title="$t('list.addGame')">
            <i class="fas fa-plus" />
        </button>

        <div class="game-search" slot="content">
            <form @submit.prevent="search">
                <input
                    ref="searchInput"
                    type="text"
                    v-model="searchText"
                    :placeholder="$t('gameSearch.inputPlaceholder')"
                />

                <button class="primary small" @click="search">
                    <i class="fas fa-circle-notch fast-spin hollow" v-if="loading" />
                    <i class="fas fa-search" v-else />
                </button>
            </form>

            <small v-if="gamesInList.length" :title="gamesInListNames">
                <strong>{{ gamesInListMessage }}</strong>
                {{ $t('gameSearch.alreadyInList') }}
            </small>

            <div class="search-results" ref="searchResults" v-if="filteredResults.length > 0">
                <game-card-search
                    v-for="{ id } in filteredResults"
                    search-result
                    :key="id"
                    :game-id="id"
                    :listId="listId"
                    @added="added"
                />
            </div>

            <span class="no-results" v-if="noResults">
                {{ $t('gameSearch.noResultsFound') }}
            </span>

            <igdb-credit linkable />
        </div>
    </modal>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import Modal from '@/components/Modal';
import IgdbCredit from '@/components/IgdbCredit';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        GameCardSearch,
        IgdbCredit,
        Modal,
    },

    props: {
        listId: {
            type: [Number, String, Boolean],
            required: true,
            default: 0,
        },
    },

    data() {
        return {
            searchText: '',
            loading: false,
        };
    },

    computed: {
        ...mapState(['results', 'gameLists', 'platform']),

        noResults() {
            return this.filteredResults.length === 0
                && !this.loading
                && this.searchText.trim().length > 0;
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        filteredResults() {
            return this.results
                ? this.results.filter(({ id }) => !this.list[this.listId].games.includes(id))
                : [];
        },

        gamesInListNames() {
            return this.gamesInList.map(({ name }) => name).join(', ');
        },

        gamesInList() {
            return this.results
                ? this.results.filter(({ id }) => this.list[this.listId].games.includes(id))
                : [];
        },

        gamesInListMessage() {
            const gameCount = this.gamesInList.length;
            const plural = gameCount === 1 ? '' : 's';

            return `${gameCount} game${plural}`;
        },
    },

    watch: {
        searchText(value) {
            if (value) {
                this.search();
            }
        },
    },

    mounted() {
        if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
        }
    },

    methods: {
        clear() {
            this.searchText = '';
            this.$store.commit('CLEAR_SEARCH_RESULTS');
        },

        added() {
            this.$emit('added');
            this.$bus.$emit('GAMES_ADDED');

            if (this.filteredResults.length === 1) {
                this.clear();
            }
        },

        search: debounce(
            // eslint-disable-next-line
            function() {
                this.loading = true;

                this.$store.dispatch('SEARCH', this.searchText)
                    .then(() => {
                        this.error = null;
                        this.loading = false;
                        this.$refs.searchResults.scrollTop = 0;
                    })
                    .catch(({ data }) => {
                        this.loading = false;
                        this.error = data;
                    });
            }, 300),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .add-game-button {
        position: absolute;
        right: 0;
        bottom: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
    }

    form {
        display: flex;
        align-items: center;
        margin-bottom: $gp;

        input {
            margin-bottom: 0;
        }

        button {
            margin-left: $gp;
        }
    }

    .search-results {
        overflow: auto;
        height: calc(100vh - 240px);
    }

    .igdb-credit {
        justify-content: center;
        margin-top: auto;
    }
</style>
