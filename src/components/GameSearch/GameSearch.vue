<template lang="html">
    <form @submit.prevent="search" class="game-search">
        <h4>
            Add games to {{ list[0].name }}
        </h4>

        <div class="search-box">
            <input
                ref="searchInput"
                type="text"
                v-model="searchText"
                placeholder="Search here"
            />
            <button class="primary small" @click="search">
                <i class="fas fa-circle-notch fast-spin hollow" v-if="loading" />
                <i class="fas fa-search" v-else />
            </button>
        </div>

        <div class="search-results" v-if="filteredResults.length > 0">
            <game-card
                v-for="{ id } in filteredResults"
                search-result
                :key="id"
                :game-id="id"
                :listId="listId"
                @added="added"
            />
        </div>

        <div class="search-actions">
            <button class="small info back" @click="back">
                <i class="fas fa-caret-left" />
                back
            </button>

            <button class="small info hollow back" @click="clear" v-if="filteredResults.length > 0">
                <i class="fas fa-broom" />
                clear
            </button>
        </div>

        <div v-if="loading && filteredResults.length === 0">
            No results
        </div>
    </form>
</template>

<script>
import GameCard from '@/components/GameCard/GameCard';
import { debounce } from 'lodash';
import { mapState } from 'vuex';

export default {
    components: {
        GameCard,
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
            this.$store.commit('SET_ACTIVE_LIST', null);
        },

        added() {
            this.$emit('added');
        },

        search: debounce(
            // eslint-disable-next-line
            function() {
                this.loading = true;

                this.$store.dispatch('SEARCH', this.searchText)
                    .then(() => {
                        this.error = null;
                        this.loading = false;
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

    h4 {
        margin: $gp / 2 0;
    }

    .game-search {
        background: #ccc;
        margin-top: $list-header-height;
        padding: $gp / 2;
    }

    .search-box {
        display: flex;
        align-items: center;

        input {
            margin: 0 $gp 0 0;
        }
    }

    .search-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .search-results {
        overflow: auto;
        max-height: calc(100vh - 300px);
    }

    .back {
        margin-top: $gp / 2;
    }

    input {
        margin: 0 0 $gp / 2;
    }

    .vue-content-placeholders {
        margin-bottom: $gp / 2;
    }
</style>
