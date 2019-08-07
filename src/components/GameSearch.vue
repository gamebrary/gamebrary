<template lang="html">
    <form @submit.prevent="search" class="game-search">
        <div class="search-box">
            <input
                ref="searchInput"
                type="text"
                v-model="searchText"
                :placeholder="$t('gameSearch.inputPlaceholder')"
            />

            <button class="primary small search-button" @click="search">
                <i class="fas fa-circle-notch fast-spin hollow" v-if="loading" />
                <i class="fas fa-search" v-else />
            </button>
        </div>

        <!-- TODO: move logic out of template -->
        <small v-if="gamesInList.length" :title="gamesInList.map(({ name }) => name).join(', ')">
            <strong>{{ gamesInList.length }} game{{ gamesInList.length === 1 ? '' : 's' }}</strong>
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

        <div class="search-actions">
            <button
                class="small filled info"
                title="back"
                v-shortkey="['esc']"
                @shortkey="back"
                @click="back"
            >
                <i class="fas fa-chevron-left" />
                {{ $t('global.back') }}
            </button>

            <igdb-credit linkable />
        </div>
    </form>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import IgdbCredit from '@/components/IgdbCredit';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        GameCardSearch,
        IgdbCredit,
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
            noResults: false,
            styles: {
                width: '95%',
                'max-width': '800px',
            },
        };
    },

    computed: {
        ...mapState(['results', 'gameLists', 'platform']),

        list() {
            return this.gameLists[this.platform.code];
        },

        filteredResults() {
            return this.results
                ? this.results.filter(({ id }) => !this.list[this.listId].games.includes(id))
                : [];
        },

        gamesInList() {
            return this.results
                ? this.results.filter(({ id }) => this.list[this.listId].games.includes(id))
                : [];
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
            this.searchText = null;
            this.$store.commit('CLEAR_SEARCH_RESULTS');
        },

        back() {
            this.$store.commit('SET_ACTIVE_LIST_INDEX', null);
            this.$store.commit('SET_SEARCH_ACTIVE', false);
        },

        added() {
            this.$emit('added');
            this.$bus.$emit('GAMES_ADDED');

            if (this.filteredResults.length === 1) {
                this.clear();
                this.back();
            }
        },

        search: debounce(
            // eslint-disable-next-line
            function() {
                this.loading = true;
                this.noResults = false;

                this.$store.dispatch('SEARCH', this.searchText)
                    .then(() => {
                        this.error = null;
                        this.loading = false;
                        this.noResults = this.filteredResults.length === 0;
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
    @import "~styles/styles.scss";

    .game-search {
        background: $color-light-gray;
        margin-top: $list-header-height;
        padding: $gp / 2;
    }

    .search-box {
        display: grid;
        grid-gap: $gp / 2;
        grid-template-columns: auto 32px;
    }

    .search-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: $gp / 2;
    }

    .search-results {
        overflow: auto;
        max-height: calc(100vh - 300px);
    }

    input {
        margin: 0 0 $gp / 2;
    }

    .search-button {
        height: 20px;
    }
</style>
