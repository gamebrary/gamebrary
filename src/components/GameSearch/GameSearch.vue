<template lang="html">
    <form @submit.prevent="search" class="game-search">
        <div class="search-box">
            <input
                ref="searchInput"
                type="text"
                v-model="searchText"
                placeholder="Search here"
            />

            <button class="primary small search-button" @click="search">
                <i class="fas fa-circle-notch fast-spin hollow" v-if="loading" />
                <i class="fas fa-search" v-else />
            </button>
        </div>

        <!-- TODO: move logic out of template -->
        <small v-if="gamesInList.length" :title="gamesInList.map(({ name }) => name).join(', ')">
            <strong>{{ gamesInList.length }} game{{ gamesInList.length === 1 ? '' : 's' }}</strong>
             from search results already in your list
        </small>

        <div class="search-results" ref="searchResults" v-if="filteredResults.length > 0">
            <game-card
                v-for="{ id } in filteredResults"
                search-result
                :key="id"
                :game-id="id"
                :listId="listId"
                @added="added"
            />
        </div>

        <panel class="warning" v-if="noResults">
            <h4>No results found for "{{searchText}}"</h4>
            <p>Missing a game? Help out the community and <a href="https://www.igdb.com/games/new" target="_blank">Add it to IGDB</a></p>
        </panel>

        <div class="search-actions">
            <button class="small filled info" @click="back" title="back">
                <i class="fas fa-chevron-left" />
                Back
            </button>

            <igdb-credit linkable />
        </div>
    </form>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';
import IgdbCredit from '@/components/IgdbCredit/IgdbCredit';
import Panel from '@/components/Panel/Panel';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        GameCard,
        IgdbCredit,
        Panel,
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
    @import "src/styles/styles.scss";

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
