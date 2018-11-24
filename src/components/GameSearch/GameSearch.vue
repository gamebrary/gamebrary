<template lang="html">
    <form @submit.prevent="search" class="game-search">
        <h4>
            <i class="fas fa-search" />
            Add game
        </h4>

        <input
            ref="searchInput"
            type="text"
            v-model="searchText"
            placeholder="Type here"
        />

        <div class="search-results" v-if="filteredResults.length > 0">
            <game-card
                v-for="{ id } in filteredResults"
                :key="id"
                :game-id="id"
                :listId="listId"
                @added="added"
                search-result
            />
        </div>

        <div class="search-actions">
            <button class="small info back" @click="back">
                <i class="fas fa-caret-left" />
                back
            </button>

            <button class="small info hollow back" @click="back">
                <i class="fas fa-broom" />
                clear
            </button>
        </div>

        <div v-if="loaded && filteredResults.length === 0">
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
            loaded: false,
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
            return this.results.filter(({ id }) => !this.list[this.listId].games.includes(id));
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
        this.$refs.searchInput.focus();
    },

    methods: {
        back() {
            this.$store.commit('SET_ACTIVE_LIST', null);
        },

        added() {
            this.$emit('added');
        },

        search: debounce(
            // eslint-disable-next-line
            function() {
                this.loaded = false;

                this.$store.dispatch('SEARCH', this.searchText)
                    .then(() => {
                        this.error = null;
                        this.loaded = true;
                    })
                    .catch(({ data }) => {
                        this.loaded = true;
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
